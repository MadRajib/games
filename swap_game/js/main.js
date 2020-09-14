let g_selected = null;
// window.addEventListener('load', function() {
//   document.querySelector('input[type="file"]').addEventListener('change', function() {
//       if (this.files && this.files[0]) {
//           var img = document.querySelector('img');  // $('img')[0]
//           img.src = URL.createObjectURL(this.files[0]); // set src to blob url
//           img.onload = imageIsLoaded;
//       }
//   });
// });

// function imageIsLoaded() { 
//   alert(this.src);  // blob url
//   // update width and height ...
// }

function CreateNumbers(range) {
  var number_list = Array.from({length: range-1}, (_, i) => i + 1)
  shuffle(number_list)
  return number_list
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

onload = function () {

  var canvas = Snap("#canvas");

  let rows = 3;
  let cols = 3;
  let size =  50;
  $('#canvas_container').width('50%');
  $('#canvas_container').height('500px');
  
  canvas.attr({
    width:'100%', 
    height: '100%',
    viewBox: "0,0,"+ rows*size+","+ cols * size
  })

  const grid = new Grid(rows, cols,size);
  grid.draw(canvas)
  g_selected.select();


  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":

        move("ArrowDown")

        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":

        move("ArrowUp")

        break;
      case "Left": // IE/Edge specific value
      case "ArrowLeft":


        move("ArrowLeft")

        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":

        move("ArrowRight")

        break;
      case " ":
        swapCells()
        break;
      case "Esc": // IE/Edge specific value
      case "Escape":
        // Do something for "esc" key press.
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);

  function move(dir) {
    grid.moveSelection(dir)
  }
  function swapCells() {
    grid.swapCells()
  }

  $('#swap_button').click(function() {
    grid.swapCells();
  });
}




class Grid {

  cells = [];
  constructor(row, col, size) {
    this.size = size;
    this.row = row;
    this.col = col;
    this.number_list = CreateNumbers(this.row * this.col);

    this.createCells(this.row * this.col);
    
  }

  draw(ctx) {
    this.cells.forEach(cell => {
      cell.draw(ctx)
    });
  }


  createCells(cellsSize) {
    let x = 0;
    let sz = this.size;

    var emptyCellIndex = Math.floor((Math.random() * cellsSize) + 0);
    let num_index = 0;
    for (let index = 0; index < cellsSize; index++) {

      let y = index % this.col;
      if (index != 0 && y === 0) x++;

      if(index === emptyCellIndex){
        this.cells.push(new Cell(y, x, sz, sz,""));
      }else{
        this.cells.push(new Cell(y, x, sz, sz,this.number_list[num_index++]));
      }
    }

   
    this.cells[emptyCellIndex].cellType = 0;
    g_selected = this.cells[emptyCellIndex];
  }



  moveSelection(dir) {

    if(g_selected === null) return;

    let x = g_selected.loc_x;
    let y =  g_selected.loc_y;

    let index = x + y * this.row;

    if (index < this.row * this.col) {

      switch (dir) {
        case "ArrowLeft":

          if (x - 1 < 0) return false;

          let left_index = index - 1;

          g_selected.deSelect()
          g_selected = this.cells[left_index];
          g_selected.select()
          
          return true;
          
          case "ArrowRight":
            if (x + 1 >= this.col) return false;
            let right_index = index + 1;

            g_selected.deSelect()
            g_selected = this.cells[right_index];
            g_selected.select()

            return true;
          case "ArrowUp":
            if (y - 1 < 0) return false;
            let up_index = x + (y - 1) * this.row;

            g_selected.deSelect()
            g_selected = this.cells[up_index];
            g_selected.select()

            return true;
          case "ArrowDown":
            if (y + 1 >= this.row) return false;
            let down_index = x + (y + 1) * this.row;
            g_selected.deSelect()
            g_selected = this.cells[down_index];
            g_selected.select()

            return true;
      }
    }
    return false;
  }

  findEmptyCell(){

    let current_cell = g_selected;
    let x = g_selected.loc_x;
    let y =  g_selected.loc_y;

    let c_index = x + y * this.row;

    if (c_index >= this.row * this.col){
      return null;
    }

    // check left
    if (x - 1 >= 0){
      let index = c_index - 1;
      if(this.cells[index].cellType == 0) return [c_index,index];
    }
    
    // check right
    if (x + 1 < this.col){
      let index = c_index + 1;
      if(this.cells[index].cellType == 0) return [c_index,index];
    } 

    //check up
    if (y - 1 >= 0){
      let index = x + (y - 1) * this.row;
      if(this.cells[index].cellType == 0) return [c_index,index];
    } 
    

    //check down
    if (y + 1 < this.row){
      let index = x + (y + 1) * this.row;
      if(this.cells[index].cellType == 0) return [c_index,index];
    } 
    

    return null;

  }

  // swap cells
  swapCells() {

    let emptyCell = this.findEmptyCell();

    if(emptyCell === null) return;

    let cell_1_index = emptyCell[0];
    let cell_2_index = emptyCell[1];
    
    let left_x = this.cells[cell_1_index].loc_x
    let left_y = this.cells[cell_1_index].loc_y

    let current_x = this.cells[cell_2_index].loc_x
    let current_y = this.cells[cell_2_index].loc_y


    this.cells[cell_1_index].move(current_x, current_y)
    this.cells[cell_2_index].move(left_x, left_y)


    let temp_cell = this.cells[cell_1_index]
    this.cells[cell_1_index] = this.cells[cell_2_index]
    this.cells[cell_2_index] = temp_cell

    if(this.checkBoard()){
      alert("Cool !")
    }

  }

  // check the board if solved
  checkBoard(){
    for (let i = 0; i < this.cells.length -1 ; i++) {
      if(this.cells[i].labelTxt != i+1) return false;
    }
    return true;
  }

}

// Cell Class
class Cell {

  constructor(x, y, height, width,label) {
    // var to differentiate between empty and non empty cell
    this.cellType = 1; 
    // location in grid, indexes 
    this.loc_x = x;
    this.loc_y = y;

    // pixel location in the grid
    this.pos = this.constructor.CalculatePixelPosition(x,y,width,height);

    // dimension of the cell
    this.height = height;
    this.width = width;

    // var to check if it selected cell
    this.selected = false;

    // style of cell
    this.normalStrokeWidth = 2;
    this.labelTxt = label;

    this.labelOffset = {'x': 20, 'y':40}
  }

  // calculates the pixel location 
  static CalculatePixelPosition(x,y,width,height){
    return {'x': x*width, 'y':y * height};
  }

  // call back function when an item is deselected
  deSelect() {
    this.selected = false;
    // apply original style 
    this.cell.select("#box").attr({
      strokeWidth: this.normalStrokeWidth,
    })
  }

  select(){
    this.selected = true;
    this.cell.select("#box").attr({
      strokeWidth: 5,
    })

  }

  draw(s) {
    // initialize the snap object
    
    
    let box = s.rect(0,0,this.width, this.height);
    let label = s.text(this.labelOffset.x,this.labelOffset.y)

    label.attr({
      id:"label",
      'font-size':20,
      text:this.labelTxt
    });

    box.attr({
      id:"box",
      fill: (this.cellType === 0) ? "#ffffff" : "#bada55",
      stroke: "#000",
      strokeWidth: this.normalStrokeWidth
    });

    this.cell = s.group(box,label);
    this.cell.attr({
      transform : "translate("+this.pos.x+","+this.pos.y+")"
    })

    // on selected event listener
    this.cell.click(() => {
      console.log("selected", this.loc_x, this.loc_y);

      // if already selected deselect it
      if (this.selected) {
          this.deSelect();
      } else {
        // unselect any other cell before selecting
        if (g_selected != null) {
          g_selected.deSelect();
        }
        // save this cell in the global selected var 
        g_selected = this;

        this.selected = true;
        // change the box style con selected
        this.cell.select("#box").attr({
          strokeWidth: 5,
        })
      }

    });

  }

  // to transform fun function 
  move(dx, dy) {
    // update the cell index in the grid
    this.loc_x = dx;
    this.loc_y = dy;

    // calculate the new pixel position
    this.pos = this.constructor.CalculatePixelPosition(this.loc_x,this.loc_y,this.width,this.height)
    // animate the new position
    this.cell.animate({ 'transform' : "translate("+this.pos.x+","+this.pos.y+")"},120)
    
  }


}