function Arc(start,end,colr){
  this.start_angle  = start;
  this.end_angle = end - radians(25) ;
  this.angle= this.end - this.end;
  this.rot_angle = 0.1
  this.clor = colr
  this.bottom = false;


  this.show = function(){
    stroke(this.clor);
    strokeWeight(20);
    noFill();
    arc(width/2, 200, 100, 100, this.start_angle,this.end_angle);

  }

  this.update = function(){
    this.start_angle+=this.rot_angle;
    this.start_angle%=TWO_PI;
    this.end_angle+=this.rot_angle;
    this.end_angle%=TWO_PI;

    if(abs(this.end_angle-HALF_PI)<radians(10)){
      this.bottom = true;
    }

    if(abs(this.start_angle-HALF_PI)<radians(10)){
      this.bottom = false;
    }

    if(this.bottom){
      //console.log("In bottom");
    }else{
    //  console.log("not in bottom");
    }




  }

  this.collision = function(ball){
      var ball_pos = ball.pos.y+ball.radius/2;

  }

}
