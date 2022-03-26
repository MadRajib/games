class Board {
    constructor(rows, cols, canvas_dim) {
        this.rows = rows;
        this.cols = cols;
        this.canvas_dim = canvas_dim;
        this.cellsList = [];
        this.cell_width = this.canvas_dim[0]/this.rows;
        this.cell_height = this.canvas_dim[1]/this.cols;
        this.reset();
        this.pattern = null;
    }

    render() {
        this.cellsList.forEach(cell => {
            cell.render();
        });
    }

    update() {
        this.cellsList.forEach(cell => {
            cell.update();
        });
    }
    
    setBoard(pattern) {
        this.pattern = pattern;
        let shape = SHAPES.sample()
        pattern.forEach( elem => {
            let cell = this.cellsList[elem -1];
            cell.setNewShape(shape,"#fdf0d5")
        });

        let i = 0;
        const showInterval = setInterval(()=>{
            if(i >= pattern.length) {
                clearInterval(showInterval)
                setGameStatus("Guess the Pattern")
                cur_state = STATES["START_GUESSING"];
                return;
            }
            console.log(i,pattern.length)
            let cell = this.cellsList[pattern[i]-1];
            cell.renderShape(1000);
            i++;
        },2000);

    }
    
    getCellAt( mX, mY ){
        let r_index = floor(mY/this.cell_width);
        let c_index = floor(mX/this.cell_height);
        return this.cellsList[(r_index*this.rows+c_index)]
    }

    reset(){
        this.cellsList = []
        for (let c = 0; c < this.rows; c++) {
            for (let r = 0; r < this.cols; r++) {
                let cell = new Cell(r*this.cell_width, c*this.cell_height, this.cell_width, this.cell_height, this.cellsList.length + 1);
                this.cellsList.push(cell);
            }
        }
    }


}

class Cell {
    constructor(x, y, width, height, id){
        this.x = x+4;
        this.y = y+4;
        this.width = width-4;
        this.height = height-4;
        this.centerX = this.x + this.width/2;
        this.centerY = this.y + this.height/2;
        this.shape = null;
        this.id = id;
        this.color = "";
    }

    render(){
        push()
        noFill();

        if (this.color.length === 0) {
            stroke("#457b9d");
        }else {
            stroke(this.color);
            strokeWeight(4); 
        }
        rect(this.x, this.y, this.width, this.height);
        pop();
        if(this.shape != null)
            this.shape.render();
    }

    update(){

    }
    renderShape(timeout) {
        if(this.shape !=  null)
            this.shape.renderWithTimeout(timeout)
    }

    setShape(shape){
        this.shape = shape;
    }

    setNewShape(shape,colorHex) {
        switch(shape){
            case "CIRCLE":
                this.shape = new CircleShape(this.centerX, this.centerY, 60, 60, colorHex);
                break;
            case "WRONG":
                this.shape = new WrongShape(this.centerX, this.centerY, 60, 60,colorHex);
                break;
            case "SQUARE":
                this.shape = new SquareShape(this.centerX, this.centerY, 60, 60, colorHex);
                break;
            case "TRIANGLE":
                this.shape = new TriangleShape(this.centerX, this.centerY, 60, 60, colorHex);
                break;
            case "HEXAGON":
                this.shape = new HexagonShape(this.centerX, this.centerY, 60, 60, colorHex);
                break;
            case "DIAMOND":
                this.shape = new DiamondShape(this.centerX, this.centerY, 60, 60, colorHex);
                break;
        }
    }
    setWrongShape(){
        this.setNewShape("WRONG","#ff4d6d");
        this.shape.setRender(null,true);
    }
}

class Shape {
    constructor(x,y,w,h,colorHex){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.render_flg = false;
        this.color = colorHex;
        // this.color = "#fdf0d5";
    }

    render(){
        if(this.render_flg === true) {
        
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            
            ellipse(this.x,this.y, this.w, this.h);
            pop();
        }   
    }

    update(){

    }

    setRender(color,renderFlag) {
        if(color != null) 
            this.color = color;
        this.render_flg = renderFlag;
    }

    renderWithTimeout(timeout){
        this.render_flg = true;
        setTimeout(()=>{
            console.log("done rendering")
            this.render_flg = false;
        },timeout);
    }
}

class User {
    constructor() {
        this.score = 0;
        this.HIGH_SCORE = 0;
    }
}

class WrongShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x,y,w,h,colorHex);
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            beginShape();
            vertex(this.x - this.w/2,this.y - this.w/2);
            vertex(this.x+this.w/2, this.y+this.h/2);
            endShape();
            beginShape();
            vertex(this.x - this.w/2, this.y + this.w/2);
            vertex(this.x + this.w/2, this.y - this.w/2);
            endShape();
            pop();
        }   
    }
}


class CircleShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x,y,w,h,colorHex);
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            
            ellipse(this.x,this.y, this.w, this.h);
            pop();
        }   
    }
}

class SquareShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x-w/2,y-h/2,w,h,colorHex);
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            
            rect(this.x,this.y, this.w, this.h);
            pop();
        }   
    }
}

class TriangleShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x,y,w,h,colorHex);
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            
            triangle(this.x,this.y-this.h/2, this.x - this.w/2, this.y + this.h/2, this.x+this.w/2, this.y + this.h/2 );
            pop();
        }   
    }
}

class HexagonShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x,y,w,h,colorHex);
        this.sides = 6;
        this.d_delta = 360/this.sides;
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            translate(this.x, this.y);
            beginShape();
            let deg = -90;
            let rad = radians(deg);
            let x = cos(rad)*this.w/2;
            let y = sin(rad)*this.h/2;
            vertex(x, y);
            for(let i = 0; i < this.sides -1; i++) {
                deg += this.d_delta;
                let rad = radians(deg);
                let x = cos(rad)*this.w/2;
                let y = sin(rad)*this.h/2;
                vertex(x, y);
                
            }
            endShape(CLOSE);
            pop();
        }   
    }
}

class DiamondShape extends Shape{
    constructor(x,y,w,h,colorHex){
        super(x,y,w,h,colorHex);
        this.angle = radians(45);
    }

    render(){
        if(this.render_flg === true) {
            push();
            drawingContext.shadowBlur = 32;
            drawingContext.shadowColor = this.color;
            stroke(this.color);
            strokeWeight(8);
            noFill();
            
            translate(this.x, this.y)
            rotate(this.angle);
            rect(-this.w/2,-this.h/2, this.w, this.h);
            pop();
        }   
    }
}



