var noOfArcs;
var arcs;
var crs ;
var balls;
var yposOffset;
var gameOver = false;
var win = false;
var yTextWin;
var level = 1;
function setup(){

  createCanvas(400, 600);
  background(255);
  //frameRate(5);

  //noOfArcs = floor(random(2,4));
  reset();

}

function draw() {
  background(51);
  if(!gameOver){

    for(var i=0;i<arcs.length;i++){
       arcs[i].update();
       arcs[i].show();
    }

    for(var i=0;i<balls.length;i++){
       balls[i].update();
       balls[i].show();
    }

    if(balls.length>0){
      if((balls[0].pos.y<270)&&(balls[0].pos.y>240)){
        for(var i=0;i<arcs.length;i++){
          if(arcs[i].bottom){
            if(arcs[i].clor===balls[0].color){
              arcs.splice(i,1);
              break;
            }else{
              gameOver = true;
            }
          }

        }
        balls.splice(0,1);
      }
    }

    if(arcs.length>0&&balls.length==0){
      console.log("balls game_over!");
      gameOver = true;
    }

    if(arcs.length==0&&balls.length==0){
      win = true;
      gameOver=true;
    }

  }else if(!win){
    textSize(50);
    textAlign(CENTER);
    fill(0, 150, 255);
    text("Game Over", width/2, height/3);
    level=1;
    textSize(30);
    textAlign(CENTER);
    fill(255, 150,0 );
    text("Tap To Play Again", width/2, height/1.5);
  }else if(win){
    textSize(50);
    textAlign(CENTER);
    fill(255);
    text("Great You Won", width/2, yTextWin);
    if(!(yTextWin>=height/3)){
        yTextWin+=10;
    }
    textSize(30);
    textAlign(CENTER);
    fill(255, 150,0 );
    text("Tap To Play Level: "+constrain((level+1),2,3), width/2, height/1.5);

  }



}

function press(){
  if(!gameOver){
    console.log("preesed");
    if(balls.length>0){
       balls[0].strike();
       for(var i=1; i<balls.length;i++){
          balls[i].move();
       }
    }
  }else{
    reset();
  }
}

function keyPressed(){
  press();
}
function mouseReleased(){
  press();
}

function reset(){
  if(win){
    level++;
    level = constrain(level,1,3);
  }

  gameOver = false;
  win = false;
  arcs = [];
  balls = [];
  crs = [];
  yTextWin = -50;

  crs = [new colorsObject(color(255,0,0)),new colorsObject(color(0,255,0)),new colorsObject(color(0,0,255)),new colorsObject(color(255,153,255))];


  noOfArcs = constrain(level+1,2,4);
  var angle = radians(360/noOfArcs);
  console.log(angle);

  for(var i=0;i<noOfArcs;i++){
    var cr = color(255);

    for(var i=0;i<crs.length;i++){
      if(crs[i].used==false){
        cr = crs[i].colr ;
        crs[i].used =true;
        break;
      }
    }
    //console.log(cr);
     arcs.push(new Arc(i*angle,(i+1)*angle,cr));

  }

  yposOffset = height - 100;

  for(var i=0;i<arcs.length;i++){

    balls.push(new Ball(yposOffset,arcs[i].clor));
    yposOffset+=50;
  }

}

function colorsObject(cr){
  this.colr = cr;
  this.used = false;
}
