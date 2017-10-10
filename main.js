// setup canvas and prepare for drawing 2D shapes
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var displayScore = document.querySelector('p');
var ballCount = 0;

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number within the range min-max
function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

// Shape constructor
function Shape(x, y, velX, velY, exists) {
    // start coordinates for each ball object
    this.x = x;
    this.y = y;

    // horizontal and vertical velocity
    this.velX = velX;
    this.velY = velY;

    this.exists = exists;
}

// Ball constructor which inherits from Shape
function Ball(x, y, velX, velY, exists, color, size){
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

// ensure that the Ball prototype and constructor are set correctly 
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Evil circle constructor which inherits from Shape
function EvilCircle(x,y,exists){
    Shape.call(this,x,y,exists);
    this.color = 'white';
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
}

// ensure that the EvilCircle prototype and constructor are set correctly 
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


// methods appended to Ball prototype
Ball.prototype.draw = function() {
    // signal the start of drawing onto the canvas
    ctx.beginPath();
    // define the colour of the drawing
    ctx.fillStyle = this.color;
    // trace an arc onto the canvas
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    // finish the drawing
    ctx.fill();
}

Ball.prototype.update = function() {

    // check if the ball has reached the edge of the canvas
    if((this.x + this.size) >= width){
        this.velX = -(this.velX);
    }
    if((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    if((this.y + this.size) >= height){
        this.velY = -(this.velY);
    }
    if((this.y - this.size) <= 0){
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
}

// function to change the color of the ball upon a collision
Ball.prototype.collisionDetect = function() {
    // increment through the ball array
    for(var j=0; j<balls.length; j++){
        // calculate distance between current ball and other balls in the array
        if(!(this === balls[j])){
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy)

            // once a collision is detected, change the colour of each ball
            if(distance < this.size + balls[j].size){
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            }
        }
    }
}

// methods appended to EvilCircle prototype

EvilCircle.prototype.draw = function() {
    // signal the start of drawing onto the canvas
    ctx.beginPath();
    // define the line colour of the hollow circle
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    // finish the drawing
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function(){

    // check if the ball has reached the edge of the canvas
    if((this.x + this.size) >= width){
        this.x = this.x - this.size;
    }
    if((this.x - this.size) <= 0) {
        this.x = this.x + this.size;
    }
    if((this.y + this.size) >= height){
        this.y = this.y - this.size;
    }
    if((this.y - this.size) <= 0){
        this.y = this.y + this.size;
    }
}

EvilCircle.prototype.setControls = function(){
    // local variable defined for this due to function scope issues in conditional statements
    var _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

// function to change the color of the ball upon a collision
EvilCircle.prototype.collisionDetect = function() {
    // increment through the ball array
    for(var j=0; j<balls.length; j++){
        // check whether the ball exists on screen
        if(balls[j].exists){
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy)

            // once a collision is detected, change the colour of each ball
            if(distance < this.size + balls[j].size){
                balls[j].exists = false;
                ballCount -= 1;
                displayScore.textContent = 'Ball count: ' + ballCount;
            }
        }
    }
}

// array to handle the displayed balls
var balls = [];

var player1 = new EvilCircle(random(0,width), random(0,height), true);
player1.setControls();


function loop() {
    // set the background colour to black (transparency can be changed to give lines)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // draw a rectangle over the surface of the canvas
    ctx.fillRect(0, 0, width, height);

    // continue looping until 25 balls have been created
    while (balls.length < 25) {
        // create a new instance of a ball object
        var ball = new Ball(
            random(0,width),
            random(0,height),
            random(-7,7),
            random(-7,7),
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            true,
            random(10,20)
        );
        // push the ball to the end of the balls array
        balls.push(ball);
        ballCount += 1;
        displayScore.textContent = 'Ball count: ' + ballCount;
    }
    

    // loop through the balls array drawing each onto the canvas and update the ball positions
    for (var i = 0; i < balls.length; i++) {
        if(balls[i].exists){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
        player1.draw();
        player1.checkBounds();
        player1.collisionDetect();
    }
    requestAnimationFrame(loop);
}

// start animation
loop();