const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const roomScreen = document.getElementById('roomScreen');

const g_gameCodeDisplay = document.getElementById('g_gameCodeDisplay');
const g_totalPlayerDisplay  = document.getElementById('g_totalPlayerDisplay');
const g_playerTurn = document.getElementById('g_playerTurn');

const r_gameCodeDisplay = document.getElementById('r_gameCodeDisplay');
const r_totalPlayerDisplay  = document.getElementById('r_totalPlayerDisplay');

const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const startGameBtn = document.getElementById('startGameButton');

const gameCodeInput = document.getElementById('gameCodeInput');



startGameBtn.addEventListener('click',startGame);
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);


function handleTouch(event) {
  let x = event.clientX;
  let y = event.clientY;
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  x = (x/cellWidth) | 0;
  y = (y/cellHeight) | 0;

  socket.emit('gridTouched',[x,y]);

}

function startGame(){
  socket.emit('startGame');
  init();

}

function newGame() {
  initialScreen.style.display = "none";
  roomScreen.style.display = "block";
  socket.emit('newGame');
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  initialScreen.style.display = "none";
  roomScreen.style.display = "block";
  startGameBtn.style.display = "none";
}

// const socket = io('https://chain-reaction-multi.herokuapp.com/');

const socket = io('http://localhost:3000/');
socket.on('init',handleInit);
socket.on('gameCode',handleGameCode);
socket.on('gameState',handleGameState);
socket.on('gameOver',handleGameOver);
socket.on('playerTurn',handlePlayerTurn);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooLowPlayers', handleTooLowPlayers);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('newPlayer',handleNewPlayer);

socket.on('startGame',handleStartGame);



let canvas, ctx;
let playerNumber;
let gameActive = false;
let cellWidth;
let cellHeight;


function init() {
  initialScreen.style.display = "none";
  roomScreen.style.display = "none";

  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  canvas.addEventListener('click',handleTouch);

  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 360;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  gameActive = true;
}

// init();
// newGame();

function paintGame(state) {
  
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rows = state.rows;
  const cols = state.cols;

  
  cellWidth = canvas.width / cols;
  cellHeight = canvas.height / rows;


  ctx.strokeStyle = "#c2c2c2";
  for (let r = 0; r < rows;r++) {
    for(let c = 0;c < cols;c++){
      ctx.strokeRect(c*cellWidth, r*cellHeight, cellWidth, cellHeight);
    }
  }

  

  for(let i = 0;i<cols;i++){
    for(let j =0;j<rows;j++){

      if(state.board[i][j]){
        let cell = state.board[i][j];
        let player_index = cell.player -1;
        let player = state.players[player_index];
        paintPlayer(player,cell,cellWidth,cellHeight);
        
      }

    }
  }

}

function paintPlayer(player,cell,width,height) {
  
  let offset = [[0,0]];
  if(cell.count === 2){
    offset = [[-8,0],[8,0]];
  }else if(cell.count === 3){
    offset = [[-5,8],[0,-4],[8,8]];
  }

  if(cell.count>3) return;
  for(let i = 0;i< cell.count;i++){  
    
    ctx.beginPath();
    ctx.arc(cell.x * width + width/2 + offset[i][0], cell.y*height + height/2 + offset[i][1], 8, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.fill();
  }
  
}

// paintGame(gameState);



function handleInit(player_number) {
  playerNumber = player_number;
}

function handleStartGame(data){
  gameActive = true;
  init();

}

function handleGameState(gameState) {
  if(!gameActive) return;

  gameState = JSON.parse(gameState);

  requestAnimationFrame(()=> paintGame(gameState));
}

function handleGameOver(data) {
  if(!gameActive) return;

  data = JSON.parse(data);

  if(data.winner === playerNumber){
    alert("your win!");
    g_playerTurn.innerText = "🎊 Hurray!🎊\n🎉👏You Won!👏🎉";
  }else{
    alert("your lose");
    g_playerTurn.innerText = "👏 😵You Lose!😵 👏";
  }

  gameActive = false;
}

function handleGameCode(gameCode) {
  r_gameCodeDisplay.innerText = gameCode;
  g_gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function handleTooLowPlayers(){
  initialScreen.style.display = "none";
  roomScreen.style.display = "block";
  startGameBtn.style.display = "block";
  alert('No Players In the Room');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  startGameBtn.style.display = "block";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";

}

function handleNewPlayer(data){

  const count = JSON.parse(data);
  g_totalPlayerDisplay.innerText = count.count;
  r_totalPlayerDisplay.innerText = count.count;
}

function handlePlayerTurn(data){
  g_playerTurn.innerText = (parseInt(data) === playerNumber)?"🤗Your Turn!🤗":"😒 Player-"+data+" Turn!";
}