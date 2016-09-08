/*
* Title: snake.js
* Description: A web version of the classic snake arcade game for CIS 580
* Author: Ryan Williams
* Last updated: 9.7.2016
*/

/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();  // timestamp 

var snake;
var snake_speed;
var snake_width = 20;
var snake_height = 20;

var apple_width = 20;
var apple_height = 20;

var INITIAL_SIZE = 10;
var INITIAL_X = backBuffer.width / 2;
var INITIAL_Y = backBuffer.height / 2;

var apple_x;
var apple_y;
var eaten_apple = false;

var score;

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
  snake_speed = 3;
  snake = [{x: INITIAL_X, y: INITIAL_Y, width: snake_width, height: snake_height}]
  current_direction = "right";
  grow_snake(INITIAL_SIZE, INITIAL_X, INITIAL_Y);
  apple_x = Math.floor((Math.random() * 740) + 1);  // Random x value between 750 and 1
  apple_y = Math.floor((Math.random() * 460) + 1);  // Random y value between 470 and 1
  score = 0;
}
init();

/*
 *@function spawn_apple
 * Spawns a new apple
*/
function spawn_apple()
{
  frontCtx.fillStyle = 'red';
  frontCtx.fillRect(apple_x, apple_y, apple_width, apple_height);
}

/*
 *@function spawn_snake
 * Spawns a new snake
 *@param {index} the position in the snake's body array
*/
function spawn_snake(index)
{
  backCtx.fillStyle = 'darkgreen';
  backCtx.fillRect(snake[index].x, snake[index].y, snake_width, snake_height);

  backCtx.strokeStyle = 'green';
  backCtx.strokeRect(snake[index].x, snake[index].y, snake_width, snake_height);
}

/**
 * @function grow_snake
 * Draws a snake depending on the size.
 * @param {length} The size of the snake 
 * @param {snakeX} The snake head's x position
 * @param {snakeY} The snake head's y position 
 */
function grow_snake(length, snakeX, snakeY)
{
  for(i = 0; i < length; i++)
  {
    snake.push({x: snakeX, y: snakeY, width: snake_width, height: snake_height});
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

  /* Check for a collision with the screen or with the snake's body by the snake's head */
  if(check_collision(snake[0].x, snake[0].y, snake) || snake[0].x > 750 || snake[0].x < 0
    || snake[0].y > 480 || snake[0].y < 0)
  {
   init(); // Restart the game without pausing
  }
  check_apple_collision();
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
  * "Paints" a new rendering of the canvas
  */
function paint()
{ 
  if(eaten_apple)
  {
    grow_snake(10, snake[0].x, snake[0].y);
    snake_speed += 1;
    eaten_apple = false;
  }
  for(i = snake.length - 1; i >= 0; i--)
  {
    spawn_snake(i);   
  }
  spawn_apple();
}

/**
  * @function checkCollision 
  * Checks for a collision from the snake's head.
  * @param {x} The snake's head x position
  * @param {y} The snake's head y position
  * @param {array} The snake array
  * @returns Boolean if there was a collision or not
  */
var check_collision = function(x, y, array)
{
  for(i = 1; i < array.length; i++)
  {
    if(array[i].x === x && array[i].y === y)
    {
      return true;
    }
  }
  return false;
}

function check_apple_collision()
{
  var smallY;
  var smallX;
  var bigX;
  var bigY;
  if(snake[0].x >= apple_x)
  {
    bigX = snake[0].x;
    smallX = apple_x;
  }
  else if(snake[0].x < apple_x)
  {
    smallX = snake[0].x;
    bigX = apple_x;
  }
  if(snake[0].y >= apple_y)
  {
    bigY = snake[0].y;
    smallY = apple_y;
  }
  else if(snake[0].x < apple_x)
  {
    smallY = snake[0].y;
    bigY = apple_y;
  }

  var apple_distance = Math.abs(Math.sqrt(((bigX - smallX)*(bigX - smallX))
   + ((bigY - smallY)*(bigY - smallY))));

  if(apple_distance <= 20)
  {
    apple_x = Math.floor((Math.random() * 740) + 1);  // Random x value between 750 and 1
    apple_y = Math.floor((Math.random() * 460) + 1);  // Random y value between 470 and 1
    spawn_apple(apple_x, apple_y);
    score++; 
    document.getElementById('score').innerHTML = "Score: " + score;

    var tail = 
    {
      x: snake[0].x,
      y: snake[0].y
    };

    eaten_apple = true;
  }
  else
  {
    var tail = snake.pop();
    tail.x = snake[0].x;
    tail.y = snake[0].y;
  }
  snake.unshift(tail);
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
      }
      break;
    // LEFT
    case 37:
    case 65:
      if(current_direction != "right")
      {
        current_direction = "left";
      } 
      break;  
    // RIGHT
    case 39:
    case 68:
      if(current_direction != "left")
      {
        current_direction = "right";
      } 
      break;
    // DOWN
    case 40:
    case 83:
      if(current_direction != "up") 
      {
        current_direction = "down";
      }
      break;
  }
}


/* Launch the game */
window.requestAnimationFrame(loop); 


