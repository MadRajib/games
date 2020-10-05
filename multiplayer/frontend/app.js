const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

const socket = io('http://localhost:3000');

socket.on('init',handleInit);
socket.on('gameCode',handleGameCode);
socket.on('gameState',handleGameState);
socket.on('gameOver',handleGameOver);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

let canvas, ctx;
let playerNumber;
let gameActive = false;


function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);

  gameActive = true;
}


function keydown(e) {
  socket.emit('keydown',e.keyCode);
}

function paintGame(state) {
  

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridSize = state.gridSize;

  const cellSize = canvas.width / gridSize;

  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  paintPlayer(state.players[0], cellSize, SNAKE_COLOR);
  paintPlayer(state.players[1], cellSize, 'red');

}

function paintPlayer(playerState, size, color) {
  const snake = playerState.snake;
  ctx.fillStyle = color;

  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

// paintGame(gameState);



function handleInit(player_number) {
  playerNumber = player_number;
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
  }else{
    alert("your lose");
  }

  gameActive = false;
}

function handleGameCode(gameCode) {
  if(!gameActive) return;
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}