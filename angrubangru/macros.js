var BOARD_DIM = [800,400]

const SHAPES = Object.freeze({
  TRIANGLE: 0,
  SQUARE: 1,
  PENTAGON: 2,
  HEXAGON: 3,
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}