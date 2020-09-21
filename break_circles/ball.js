function Ball(ypos,cr){
  this.pos = createVector(width/2, ypos);
  this.velocity= createVector(0, 0);
  this.color= cr;
  this.radius = 30;
  this.strike = false;
  this.yOffset = this.pos.y;

  this.show = function(){
    noStroke();
    fill(this.color);
    ellipse(this.pos.x,this.pos.y,this.radius,this.radius);

  }

  this.update = function(){
    this.pos.add(this.velocity);
    if(this.pos.y==(this.yOffset-50)){
      this.velocity.mult(0);
      this.yOffset = this.pos.y;
    }
  }

  this.strike = function(){

      this.velocity.set(0,-1);
      this.velocity.mult(10);
      this.strike = true;
      this.yOffset = 0;
  }

  this.move = function(){
    this.velocity.set(0,-1);
  }

}
