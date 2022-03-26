let canvas_dim = [420,420];
let gameBoard = new Board(3, 3, canvas_dim);
let user = new User();
let curr_ptr = 0;
let cur_state = STATES["RESET"];
let patternC = new Pattern();

let difficulty = 3;
let level = 1;

let startBtn = document.getElementById("start_game")
let resetBtn = document.getElementById("reset_game")
let levelBar = document.getElementById("game_level_bar")

function setup() {
  var canvas = createCanvas(canvas_dim[0],canvas_dim[1]);
  canvas.parent("game_canvas_container")
  resetGame();
}

function draw() {
  switch (cur_state) {
    case STATES["RESET"]:
      resetGame();
      cur_state = STATES["PAUSED"];
      break;
    case STATES["PAUSED"]:
      background("#1d3557");
      gameBoard.render();
      pauseGame();
      cur_state = STATES["PAUSED_1"];
      break;
    case STATES["PAUSED_1"]:
        return;
    case STATES["PATTER_DISPLAY"]:
    case STATES["START_GUESSING"]:
      background("#1d3557");
      gameBoard.update();
      gameBoard.render();
  }
}

function mouseClicked() {
  if(cur_state !== STATES["START_GUESSING"]) 
    return;
  let cell_clicked = gameBoard.getCellAt(mouseX, mouseY);
  console.log("user_clicked",cell_clicked);
  updateGame(cell_clicked);
  // prevent default
  return false;
}

function updateGame(cell_clicked){
  console.log(gameBoard.pattern);
  if(match_pattern(gameBoard.pattern, cell_clicked)){
    cell_clicked.shape.setRender("#07BEB8",true);
    user.score++;
    user.HIGH_SCORE = max(user.HIGH_SCORE,user.score);
    curr_ptr++;
    setGameStatus("Current Score : " + user.score);
  } else {
    cur_state = STATES["PAUSED"]
    cell_clicked.setWrongShape();
    console.log("Wrong! user scored", user.score);
    setGameStatus("Opps! wrong guess, current score: " + user.score);
    user.score = 0;
    level = 1;
    difficulty = 3;
  }

  if(curr_ptr >= gameBoard.pattern.length){
    setGameStatus("Nice! next Level, you scored : " + user.score);
    curr_ptr = 0;
    cur_state = STATES["PAUSED"]
    level++;
    if(level > 3 && level < 6 )
      difficulty++;
    levelBar.innerText = "Level "+ level; 
  }
}

function match_pattern(pattern, cell_clicked) {
  return pattern[curr_ptr] === cell_clicked.id
}

function setGameStatus(mgs){
  let gameStatusBar = document.getElementById("game_status_bar")
  gameStatusBar.innerText = mgs;
}

function start_game_btn_clicked(){
  resetGame();
  cur_state = STATES["PATTER_DISPLAY"]
  setGameStatus("Wait! Showing pattern....")

  startBtn.style.display = 'none';
  resetBtn.style.display = 'inline';
  gameBoard.setBoard(patternC.generate(difficulty,1,9,1));
}

function reset_game_btn_clicked(){
  cur_state = STATES["RESET"]
}

function resetGame() {
  background("#1d3557");
  gameBoard.reset();
  gameBoard.render();
  startBtn.style.display = 'inline';
  resetBtn.style.display = 'none';
  setGameStatus("Click Start to start the game")
}

function pauseGame(){
  startBtn.style.display = 'inline';
  resetBtn.style.display = 'none';
}