document.addEventListener("DOMContentLoaded",()=>{
  const GRID = document.querySelector('.game-grid');
  const width = 10;
  const CELLS_COUNT = 100;
  const BOMBS_COUNT = 20;

  let flags_count = 0;

  let cells = [];
  let isGameOver = false;

  // create Game Board
  function createBoard() {



    // v => no bomb ; b => bomb
    const temp_cells = Array(CELLS_COUNT).fill('v')
    temp_cells.fill('b',0,20);
    temp_cells.sort(()=> Math.random() - 0.5);  // shuffle the temp cells
    
    
    // create the cells with respective classes

    for (let i = 0; i < CELLS_COUNT; i++) {
      
      const outer_cell = document.createElement('div')
      outer_cell.classList.add("outer-cell");
      
      const cell = document.createElement('div');
      
      cell.classList.add("cell",temp_cells[i]);
      cell.setAttribute('id',i);
      cell.innerHTML = temp_cells[i];
      
      outer_cell.appendChild(cell);
      GRID.appendChild(outer_cell); // append the div to the grid
      
      cells.push(cell); // save cell for future use

      cell.addEventListener('click',(e)=>{
        cell_clicked(cell);
      });

      cell.addEventListener("contextmenu",(e)=>{
        e.preventDefault();
        addFlag(cell);
      });

    }  

    // create bomb counts for each cell
    for (let i = 0; i < cells.length; i++){

      let x = i % width;
      let y = (i / width) | 0; //floor the number
      
      // debugger;

      const v_class = cells[i].classList.contains('v');

      if(!v_class) continue; // if is b class skip the cell

    
      let bomb_count = 0;
      

      // check left
      if((x-1>= 0) && cells[i-1].classList.contains('b')) bomb_count++;
      // check up left
      if((x -1 >=0 && y-1 >=0) && cells[ i - width -1].classList.contains('b')) bomb_count ++;
      // check up
      if((y-1 >=0) && cells[ i - width].classList.contains('b')) bomb_count ++;
      // check up right
      if(( x+1 < width && y-1 >=0 ) && cells[ i - width + 1].classList.contains('b')) bomb_count ++;
      // check right
      if((x +1 < width) && cells[ i +1].classList.contains('b')) bomb_count ++;
      // check down right
      if((x +1 < width && y +1 < width ) && cells[ i + width +1].classList.contains('b')) bomb_count ++;
      // check down
      if((y+1 < width) && cells[ i +width].classList.contains('b')) bomb_count ++;
      // check down left
      if(( x-1 >=0 && y+1 < width) && cells[ i + width -1].classList.contains('b')) bomb_count ++;

      // set total bomb count as data
      cells[i].setAttribute('data',bomb_count);
      cells[i].innerHTML = cells[i].innerHTML +":" + bomb_count;
      
    }


  }





  createBoard()


  function addFlag(cell) {
    console.log("called");
    if(isGameOver) return;
    if(!cell.classList.contains('checked') && (flags_count < BOMBS_COUNT)){
      if(!cell.classList.contains("flag")){
        cell.classList.add("flag");
        cell.innerHTML = "🏴";
        flags_count ++;
        
        CheckForWin()

      }else{
        cell.classList.remove("flag");
        cell.innerHTML = "";
        flags_count--;
      }
    }

    
  }

  function cell_clicked(cell) {

    if(isGameOver) return;
    if(cell.classList.contains("checked") || cell.classList.contains("flag")) return;

    if(cell.classList.contains("b")){
      gameOver(cell);
    }else{
      let count =  cell.getAttribute("data")
      if(count != 0){
        cell.classList.add("checked");
        cell.innerHTML = count;
        return;
      }
      
      cell.classList.add("checked");
      // If data = 0 cell is clicked recursively call every neighbor cells 
      checkCells(cell);
      
    }
    
    
  }

// check all neighboring cells

function checkCells(cell) {
  const id = parseInt(cell.id);

  let x = id % width;
  let y = (id / width) | 0; //floor the number
  


  setTimeout(()=>{
    if(x-1 >= 0){
      let leftCell = cells[id - 1];
      cell_clicked(leftCell);
    }

    if((x -1 >=0) && (y -1>=0) ){
      let leftUp = cells[id - width -1];
      cell_clicked(leftUp);
    }

    if(y -1>=0 ){
      let up = cells[id - width];
      cell_clicked(up);
    }

    if((x +1 < width) && (y -1>=0) ){
      const rightUp = cells[id - width +1];
      cell_clicked(rightUp);
    }
    
    if(x +1 < width ){
      const right = cells[id + 1];
      cell_clicked(right);
    }

    if((x +1 < width) && (y + 1 < width) ){
      const rightDown = cells[id + width +1];
      cell_clicked(rightDown);
    }

    if(y + 1 < width){
      const down = cells[id + width];
      cell_clicked(down);
    }

    if((x -1 >=0) && (y +1 < width) ){
      const leftDown = cells[id + width -1];
      cell_clicked(leftDown);
    }

  },100)
}


function gameOver(cell) {
    console.log("Game Over!");
    isGameOver = true;

    const instructions = document.querySelector(".instructions");
    instructions.innerHTML = "💥 BomB! 💥 Game Over! <br>Reload for New Game!";

    cells.forEach(cell =>{
      if(cell.classList.contains('b')){
        cell.innerHTML = "💣";
        cell.style.backgroundColor = '#d90429';
      }
    })
}



// /check for win
function CheckForWin() {
  let match_count = 0;
  for(let i = 0; i< cells.length;i++){
    if(cells[i].classList.contains("flag") && cells[i].classList.contains("b")){
      match_count ++;
    }

    if(match_count === BOMBS_COUNT){
      const instructions = document.querySelector(".instructions");
      instructions.innerHTML = "🎉Cool You Won!🎉 <br>Reload for New Game!";
      // alert("Madrajib: Cool!")
    }
  }
}
  
});