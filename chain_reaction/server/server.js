const io = require('socket.io')();
const { initGame, gameLoop, updateBoard,createNewPlayer,MAX_PLAYERS } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeRoomId } = require('./utils');

const state = {};
const clientRooms = {};


io.on('connection',client =>{

  client.on('gridTouched',handleGridTap);
  client.on('newGame',handleNewGame);
  client.on('joinGame',handleJoinGame);
  client.on('startGame',handleStartGame);

  function handleStartGame(){

    const roomCode = clientRooms[client.id];
    const room = io.sockets.adapter.rooms[roomCode];


    let allUsers;
    if(room){
      allUsers = room.sockets;
    }

    let numClients = 0;
    if(allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if(numClients < 2){
      client.emit('tooLowPlayers');
      return;
    }

    state[roomCode].active = true;
    emitStartGame(roomCode);
    emitTurn(roomCode,1);
    startGameInterval(roomCode);
  
  }

  function handleJoinGame(gameCode){
    if(state[gameCode] !== undefined && state[gameCode].active) {
      client.emit('tooManyPlayers');
      return;
    }
    const room = io.sockets.adapter.rooms[gameCode];
    
    let allUsers;
    if(room){
      allUsers = room.sockets;
    }

    let numClients = 0;
    if(allUsers) {
      numClients = Object.keys(allUsers).length;
    }
    // console.log(numClients,MAX_PLAYERS)
    if(numClients === 0){
      client.emit('unknownCode');
      return;
    }else if(numClients+1 > MAX_PLAYERS) {
      client.emit('tooManyPlayers');
      return;
    }

    clientRooms[client.id] = gameCode;
    

    client.join(gameCode);
    client.number = numClients + 1;
    client.emit('init', client.number);
    client.emit('gameCode',gameCode);

    createNewPlayer(state[gameCode]);
    emitPlayerCount(gameCode,state[gameCode].players_count);

  }


  function handleNewGame() {
    let roomName = makeRoomId(6);
    clientRooms[client.id] = roomName;
    client.emit('gameCode',roomName);

    state[roomName] = initGame();

    client.join(roomName);
    client.number = 1;
    client.emit('init',1);

  }


  function handleGridTap(coordinate) {
    const roomName = clientRooms[client.id];

    if(!roomName) return;
    updateBoard(client.number,state[roomName],coordinate);
    emitTurn(roomName,state[roomName].turn);
  }

});



function startGameInterval(roomName) {
  
  const intervalId = setInterval(()=>{
      const winner = gameLoop(state[roomName]);


      if(!winner){
        emitGameState(roomName, state[roomName]);
      }else{
        emitGameState(roomName, state[roomName]);
        setTimeout(()=>{
          emitGameOver(roomName, parseInt(winner));
          state[roomName] = null;
          clearInterval(intervalId);
        },500);
        
      }

  },1000/FRAME_RATE);
}


function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

function emitPlayerCount(room,count) {
  io.sockets.in(room)
    .emit('newPlayer', JSON.stringify({ count }));
}

function emitStartGame(room) {
  io.sockets.in(room)
    .emit('startGame',1);
}

function emitTurn(room,turn) {
  io.sockets.in(room)
    .emit('playerTurn',turn);
}

const port = process.env.PORT || 3000;
console.log("Server listening at",port);
io.listen(port);