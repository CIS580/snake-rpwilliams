/*
* Title: snake.js
* Description: A web version of the classic snake arcade game for CIS 580
* Author: Ryan Williams
* Last updated: 9.4.2016
*/

/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();  // timestamp 

var initial_x = 0;
var initial_y = 0;

var snake_width = 20;
var snake_height = 20;

var snake = [{x: initial_x, y: initial_y, width: snake_width, height: snake_height}];
var snake_size = 40;

var snake_speed = 2;

var input = 
{
  up: false,
  down: false,
  left: false,
  right: false
}
/* end global variables */

/**
 * @function init
 * Initializes the direction of the snake so it is moving
 * right at the very beginning.
 * Draws the initial snake on the screen.
 */
function init()
{
  current_direction = "right";
  draw_snake(snake_size);
}
init();

/**
 * @function draw_snake
 * Draws a snake depending on the size.
 * @param size
 * The size of the snake (use snake_size)
 */
function draw_snake(size)
{
  for(i = 0; i < size; i++)
  {
    snake.push({x: i, y: 0, width: snake_width, height: snake_height})
  }
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) 
{
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;  // Ensures the old time is always the last frame

  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) 
{
  move(snake_speed);
  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically
  // DONE: Move the snake
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) 
{
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
  paint();
}

/**
  * @function paint
  * "Paints" a new instance of the snake
  */
function paint()
{ 
  for(i = snake.length - 1; i >= 0; i--)
  {
    backCtx.fillStyle = 'darkgrey';
    backCtx.fillRect(snake[i].x, snake[i].y, 20, 20);

    backCtx.strokeStyle = 'black';
    backCtx.strokeRect(snake[i].x, snake[i].y, 20, 20);    
  }  
}

/**
  * @function move
  * Moves the snake in a snake like fashion.
  * @param speed
  * The speed of the snake (initially is 2)
  */
function move(speed)
{
  for(i = snake.length - 1; i >= 0; i--)
  {
    if(i == 0)
    {
      if(current_direction == "up") snake[0].y -= speed;   
      else if(current_direction == "right") snake[0].x += speed;
      else if(current_direction == "left") snake[0].x -= speed; 
      else if(current_direction == "down") snake[0].y += speed;
    }
    else
    {
      snake[i].x = snake[i-1].x;
      snake[i].y = snake[i-1].y;
    }
  }
}

window.onkeydown = function(event)
{
  event.preventDefault();
  var key = event.keyCode;

  switch (key)
  {
    // UP
    case 38:
    case 87:
      if(current_direction != "down")
      {
        current_direction = "up";
        console.log("up");
      }
      break;
    // LEFT
    case 37:
    case 65:
      if(current_direction != "right")
      {
        current_direction = "left";
        console.log("left");
      } 
      break;  
    // RIGHT
    case 39:
    case 68:
      if(current_direction != "left")
      {
        current_direction = "right";
        console.log("right");
      } 
      break;
    // DOWN
    case 40:
    case 83:
      if(current_direction != "up") 
      {
        current_direction = "down";
        console.log("down");
      }
      break;
  }
}





/* Launch the game */
window.requestAnimationFrame(loop); 


