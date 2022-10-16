var walker_list = []
var sprite_list = []
var dir = {
    x:0,
    y:0
};
var start_game = false;

var player;
const char_offset = [70,50];
var char_pos_list = [
    [87,88],
    [100,110],
    [130,118],
    [151,118],
    [174,118],
    [181,140],
    [208,114],
    [246,112],

    [300,100],
    [300,82],
    [347,113],
    [380,113],
    [420,110],
    [418,145],
    [450,110],
    [495,106],
    [513,103],
]

char_pos_list.forEach(dim => {
    dim[0] += char_offset[0]
    dim[1] += char_offset[1]
});

function preload() {
    sprite_list.push({pos:char_pos_list[0], size:70, type : "a_1_1", src : loadImage('sprites/a_1.png'),aspratio: 0.43478260869565216});
    sprite_list.push({pos:char_pos_list[1], size: 50, type : "a_1_2", src : loadImage('sprites/A_2.png'),aspratio: 0.5876288659793815});
    sprite_list.push({pos:char_pos_list[2], size: 40, type : "n_1_1", src : loadImage('sprites/n_1.png'),aspratio: 0.71951219512195126});
    sprite_list.push({pos:char_pos_list[3], size: 40, type : "n_1_2", src : loadImage('sprites/n_2.png'),aspratio: 0.5180722891566265});
    sprite_list.push({pos:char_pos_list[4], size: 35, type : "g_1_1", src : loadImage('sprites/g_1.png'),aspratio: 0.87323722891566265});
    sprite_list.push({pos:char_pos_list[5], size: 65, type : "g_1_2", src : loadImage('sprites/g_2.png'),aspratio: 0.4318260869565216});
    sprite_list.push({pos:char_pos_list[6], size: 40, type : "r_1", src : loadImage('sprites/r.png'),aspratio: 0.78666219512195126});
    sprite_list.push({pos:char_pos_list[7], size: 40, type : "u_1", src : loadImage('sprites/u_1.png'),aspratio: 0.6704545454545});

    sprite_list.push({pos:char_pos_list[8], size: 55, type : "b_1", src : loadImage('sprites/b_1.png'),aspratio: 0.81});
    sprite_list.push({pos:char_pos_list[9], size: 35, type : "b_2", src : loadImage('sprites/b_2.png'),aspratio: 1.109375});
    sprite_list.push({pos:char_pos_list[10], size: 37, type : "a_2_1", src : loadImage('sprites/a_2_1.png'),aspratio: 0.9076923});
    sprite_list.push({pos:char_pos_list[11], size: 35, type : "n_2_1", src : loadImage('sprites/n_2_1.png'),aspratio: 0.97149375});
    sprite_list.push({pos:char_pos_list[12], size: 45, type : "g_2_1", src : loadImage('sprites/g_2_1.png'),aspratio: 0.6754545454545});
    sprite_list.push({pos:char_pos_list[13], size: 45, type : "g_2_2", src : loadImage('sprites/g_2_2.png'),aspratio: 0.78066219512195126});
    sprite_list.push({pos:char_pos_list[14], size: 45, type : "r_2", src : loadImage('sprites/r_2.png'),aspratio: 0.88059701121951});
    sprite_list.push({pos:char_pos_list[15], size: 45, type : "u_2_1", src : loadImage('sprites/u_2_1.png'),aspratio: 0.4691358});
    sprite_list.push({pos:char_pos_list[16], size: 50, type : "u_2_2", src : loadImage('sprites/u_2_2.png'),aspratio: 0.4691358});


    sprite_list.forEach(sprite => {
        // console.log(sprite.src);
        walker_list.push(new Walker(sprite));
    });
    
}

function setup() {
    createCanvas(BOARD_DIM[0], BOARD_DIM[1]);
    button = createButton('Start');
    button.mousePressed(changeState);
    player = new Player([0,0],SHAPES.SQUARE);
    setPlayerShape();
    

}
  
function draw() {
    background(255);
    checkKeyDown()

    var i = walker_list.length
    while (i--) {
        if(start_game)
            walker_list[i].update();
        walker_list[i].render();
        if (player.hasCollide(walker_list[i])){
            console.log("collision")
            walker_list.splice(i, 1);
            setPlayerShape();
        }
    }
    player.render();
    reset_keystroke();
    
}

function setPlayerShape(){
    let walker = walker_list[Math.floor(Math.random()*walker_list.length)];
    if(walker)
        player.copyShape(walker);
}



function checkKeyDown() {
    var changed = false;
    if (keyIsDown(LEFT_ARROW)) {
        dir.x = -1;
        changed = true;
    } 
    
    if (keyIsDown(RIGHT_ARROW)) {
        dir.x = 1;
        changed = true;
    }
    if (keyIsDown(UP_ARROW)) {
        dir.y = -1;
        changed = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        dir.y = 1;
        changed = true;
    }

    if(changed)
        player.update(dir);
}

function reset_keystroke(){
    dir.x = 0;
    dir.y = 0;
}

function changeState() {
    start_game = true;
}
