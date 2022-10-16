class Player {
    pos = {x:70,y:70};
    shape = null;
    type = null;
    vel = 5;
    w = 0;
    h = 0;
    
    constructor(pos) {
      this.pos.x =  pos[0];
      this.pos.y =  pos[1];
    }
    
    render(){
        fill('#222222');
        // ellipse(this.pos.x,this.pos.y,50,50);
        if(this.shape)
            image(this.shape, this.pos.x, this.pos.y,this.w, this.h);
    }

    update(dir){
        var x = this.pos.x;
        var y = this.pos.y;

        this.pos.x +=  dir.x*this.vel;
        this.pos.y +=  dir.y*this.vel;

        if (this.pos.x >= BOARD_DIM[0] || this.pos.x <=0)
            this.pos.x = x;

        if (this.pos.y >= BOARD_DIM[1] || this.pos.y <=0)
            this.pos.y =y; 
    }

    hasCollide(walker){
        if(walker.type != this.type) return;
        var a = 15 + 15;
        var x = walker.pos.x - this.pos.x;
        var y = walker.pos.y - this.pos.y;
      
        if (a > Math.sqrt((x * x) + (y * y))) {
          return true;
        } else {
          return false;
        }
    }

    copyShape(walker){
        this.shape = walker.shape;
        this.type = walker.type;
        this.w = walker.w;
        this.h = walker.h;

    }
  
}


class Walker {
  
    type =  null;
    pos = {x:70,y:70};
    dir = {x:0, y:0};
    shape = null;
    vel = 2;
    walk = 0;
    pause_timeout = 0;
    walk_timeout = 0;
    reset_flag = false;
    aratio = 1;
    w = 0;
    h = 0;
    
    constructor(sprite) {
      this.pos.x =  sprite.pos[0];
      this.pos.y =  sprite.pos[1];
      this.type = sprite.type;
      this.shape = sprite.src;
      this.aspratio = sprite.aspratio;
      this.h = sprite.size;
      this.w = this.h* this.aspratio;
      this.reset();
    }
    
    generate_dir(){
        this.dir.x = getRndInteger(-1,1);
        this.dir.y = getRndInteger(-1,1);
    }
    render(){
        fill('#222222');
        // ellipse(this.pos.x,this.pos.y,50,50);
        if(this.shape)
            image(this.shape, this.pos.x, this.pos.y,this.w, this.h);
            // this.shape.render([this.pos.x,this.pos.y]);

    }

    update(){
        var x = this.pos.x;
        var y = this.pos.y;

        this.pos.x +=  this.dir.x*this.vel;
        this.pos.y +=  this.dir.y*this.vel;

        if (this.pos.x + 50 >= BOARD_DIM[0] || this.pos.x <=0 +50){
            this.pos.x = x;
            this.dir.x *= -1;
            console.log("bound out x")
        }
            

        if (this.pos.y +50 >= BOARD_DIM[1] || this.pos.y <=0 + 50){
            this.pos.y = y;
            this.dir.y *= -1;
            console.log("bound out y")
        }

        if(this.reset_flag){
            this.reset();
        }
            
    }

    reset(){
        this.walk = getRndInteger(0,1);
        if(this.walk == 1){
            console.log("Walking");
            this.pause_timeout = 0;
            this.walk_timeout = getRndInteger(1000,5000);

            // set a new direction only when walking
            this.generate_dir();
            this.vel = getRndInteger(1,2);
 
            setTimeout(() => {
                console.log("Walking timeout");
                this.reset_flag = true;
            }, this.walk_timeout);
        }else {
            console.log("Pausing");
            this.walk_timeout = 0;
            this.pause_timeout = getRndInteger(100,2000);
 
            // pause the walk in pause state
            this.dir.x = 0;
            this.dir.y = 0;
 
            setTimeout(() => {
                console.log("Pausing timeout");
                this.reset_flag = true;
            }, this.pause_timeout);
        }

        this.reset_flag = false;
    }
  
}


class Shape {
    npoints;
    radius;
    type;
    constructor(radius, npoints, type){
        
        this.radius = (radius < 20)? 20: radius;
        this.npoints = (npoints < 3)? 3: npoints;
        this.type = type;
    }

    render(pos) {
        let angle = TWO_PI / this.npoints;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
          let sx = pos[0] + cos(a) * this.radius;
          let sy = pos[1] + sin(a) * this.radius;
          vertex(sx, sy);
        }
        endShape(CLOSE);
      }
}
