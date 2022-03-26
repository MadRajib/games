STATES = {
    "RESET" : 0,    
    "PATTER_DISPLAY" : 1,
    "START_GUESSING" : 2,
    "OVER" : 3,
    "PAUSED" : 4,
    "PAUSED_1" : 5,
    "RESUMED" : 6
}

SHAPES = ["CIRCLE","SQUARE", "TRIANGLE", "HEXAGON", "DIAMOND"]
Levels = [
    {
        "length": 3,
        "shape" : 1,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 4,
        "shape" : 2,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 3,
        "shape" : 2,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 4,
        "shape" : 2,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 3,
        "shape" : 3,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 4,
        "shape" : 3,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 3,
        "shape" : 4,
        "rows" : 3,
        "cols" : 3,
    },
    {
        "length": 3,
        "shape" : 5,
        "rows" : 3,
        "cols" : 3,
    },

]

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
  }