const {
  GRID_SIZE
} = require('./constants');

const MAX_PLAYERS = 4;
const COLORS_CODE = ["#800080", "#00FF00", "#808080", "#00FFFF"];

module.exports = {
  initGame,
  gameLoop,
  updateBoard,
  createNewPlayer,
  MAX_PLAYERS,
}


function initGame() {
  const state = createGameState();
  createNewPlayer(state);

  return state;
}

function createGameState() {
  return {
    turn: 1,
    active: false,
    rows: 10,
    cols: 10,
    players: [],
    players_count: 0,
    board: Array(10).fill().map(() => Array(10)),
  };
}

function createNewPlayer(state) {
  let prev_count = state.players_count;

  if (prev_count >= MAX_PLAYERS) return;

  const color = getColorCode(prev_count);
  if (!color) return;
  let player_number = prev_count + 1;

  const player = {
    number: player_number,
    color: color
  };

  state.players.push(player);
  state.players_count++;
}

function gameLoop(state) {

  if (!state) return;

  const rows = state.rows;
  const cols = state.cols;

  let occupied_cell_count = 0;
  let dic = {};
  
  state.players.forEach(element => {
    dic[element.number] = 0;
  });

  for(let i = 0;i<cols;i++){
    for(let j =0;j<rows;j++){

      if(state.board[i][j]){
        dic[state.board[i][j].player]++
        occupied_cell_count++;
      }

    }
  }

  
  if(occupied_cell_count >2){
    for (var key in dic){
      if(occupied_cell_count === dic[key]){

        console.log(key);
        return key;
      }
    }
  }
  
  return false;

}

function updateBoard(player, state, cord) {
  if(!state) return;
  if (state.turn != player) return;

  let x = cord[0];
  let y = cord[1];
  if (x < 0 || x >= state.cols || y < 0 && y >= state.rows) return;

  const cell = state.board[x][y];

  if (cell) {

    if (cell.player != player) return;
    cell.count++;
    blast(player, cell, state.board);

  } else {
    state.board[x][y] = createCell(player, 1, cord);
  }

  state.turn = (state.turn + 1 > state.players.length) ? 1 : state.turn + 1;

}

function createCell(player, count, coord) {
  return {
    count: count,
    player: player,
    x: coord[0],
    y: coord[1]
  };
}

function getColorCode(index) {
  if (index + 1 >= MAX_PLAYERS) return;
  return COLORS_CODE[index];
}

function blast(player, cell, board) {
  if (!cell) return;

  setTimeout(() => {
    // cell is on the edge
    if ((cell.x === 0 && cell.y == 0) ||
      (cell.x === 9 && cell.y == 0) ||
      (cell.x === 9 && cell.y == 9) ||
      (cell.x === 0 && cell.y == 9)) {

      if (cell.count === 2) {
        // blast it
        updateCells(player,cell, board);

      } 
      return
    }

    if ((cell.x === 0) ||
      (cell.x === 9) ||
      (cell.y == 0) ||
      (cell.y == 9)) {

      if (cell.count === 3) {
        // blast it
        updateCells(player,cell, board);

      }
      return;
    }

    if (cell.count > 3) {
      updateCells(player,cell, board);
    }
    return;

  }, 100);

}

function updateCells(player, cell, board) {
  let leftCell = getCell(1, cell, board);
  let rightCell = getCell(2, cell, board);
  let upCell = getCell(3, cell, board);
  let downCell = getCell(4, cell, board);



  if (leftCell !== false) {
    if (leftCell !== undefined) {
      leftCell.count++;
      leftCell.player = player;
      blast(player, leftCell,board);
    } else {
      board[cell.x - 1][cell.y] = createCell(player, 1, [cell.x - 1, cell.y]);
      blast(player,board[cell.x - 1][cell.y],board);
    }

  }

  if (downCell !== false) {
    if (downCell !== undefined) {
      downCell.count++;
      downCell.player = player;
      blast(player, downCell,board);
    } else {
      board[cell.x][cell.y + 1] = createCell(player, 1, [cell.x, cell.y + 1]);
      blast(player,board[cell.x][cell.y + 1],board);
    }
  }

  if (rightCell !== false) {
    if (rightCell !== undefined ) {
      rightCell.count++;
      rightCell.player = player;
      blast(player, rightCell,board);
    } else {
      board[cell.x + 1][cell.y] = createCell(player, 1, [cell.x + 1, cell.y]);
      blast(player,board[cell.x+1][cell.y],board);
    }

  }

  if (upCell !== false) {
    if (upCell !== undefined ) {
      upCell.count++;
      upCell.player = player;
      blast(player, upCell,board);
    } else {
      board[cell.x][cell.y - 1] = createCell(player, 1, [cell.x, cell.y - 1]);
      blast(player,board[cell.x][cell.y - 1],board);
    }

  }
  cell.count = 0;
}

function getCell(dir, cell, board) {
  if(cell === undefined) return false;
  
  const x = parseInt(cell.x);
  const y = parseInt(cell.y);

  if (x < 0 || x >= 10 || y < 0 || y >= 10) return false;
  
  switch (dir) {
    case 1:
      if (x - 1 < 0) return false;
      return board[x - 1][y];
    case 2:
      if (x + 1 >= 10) return false;
      return board[x + 1][y];
    case 3:
      if (y - 1 < 0) return false;
      return board[x][y - 1];
    case 4:
      if (y + 1 >= 10) return false;
      return board[x][y + 1];
  }

  return false;
}
