
//Define Variables
var canvas, ctx;

//lives
var lives = 3;
var heart = new Image();
heart.src = "./images/heart.png";
var hearty = 20;
var heartx;

var score = 0;
var intervalID;

//penty
var enemy = new Image();
enemy.src = "./images/penty.png";
var ex = [0,0,0,0,0,0,0,0,0,0];
var ey = [0,0,0,0,0,0,0,0,0,0];
var ewidth = 50;
var eheight = 30;
var edy = 1;
var disappear = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

//SpaceShip
var sdx = 1;
var sheight = 40;
var swidth = 60;
var plasma = new Image();
plasma.src = "./images/plasma1.png";
var sy;
var sx;
var fadeShip = false;

//laser
var laserRadius = 8;
var laserColor = 'red';
var lasery;
var laserx;
var laserdy = 10;
var pow = false;

//Stars in background
var starx = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var stary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var starRadius = 2
var stardy = 5;


////////////////////////////////////////

//display Start Screen
function start()
{
  canvas = document.getElementById("1");
  ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width, canvas.height);
  displayStart();
  //draw();
}


//Define Canvas and ctx
function load()
{
  score = 0;
  lives = 3;
  fadeShip = false;
  ctx.clearRect(0,0,canvas.width, canvas.height);
  sx = (canvas.width - swidth)/2;
  sy = (canvas.height - 2*sheight);

  for (var i = 0; i < ex.length; i++)
  {
    ex[i] = Math.random()*(canvas.width - 60);
    ey[i] = canvas.height/ey.length*(i+1) - canvas.height;
    ctx.drawImage(enemy, ex[i], ey[i]);
  }

  for (var i = 0; i < starx.length; i++)
  {
    starx[i] = Math.random()*(canvas.width - 1);
    stary[i] = canvas.height/stary.length*(i+1);
  }

  intervalID = setInterval(draw, 5);


}

///////////////////////
function draw()
{
  ctx.clearRect(0,0,canvas.width, canvas.height);

  //checkWall();

  moveShip();
  drawStars();
  drawPlasma(sx,sy,swidth,sheight);
  drawEnemy();
  if (pow)
    animateLaser();
  drawLives();

  displayScore();

  checkWall();
}


//////////////////////

//All Collisions
function checkWall()
{
  //Spaceship hit wall
  if (moveL && sx - sdx <= 0)
    sx = 0;
  else if (moveR && sx + sdx >= canvas.width - swidth)
    sx = canvas.width - swidth;

  //penty respawn
  for (var i = 0; i < ex.length; i++)
  {
    if (ey[i] >= canvas.height)
    {
      ex[i] = Math.random()*(canvas.width - 50);
      ey[i] = -50;
      ctx.drawImage(enemy, ex[i], ey[i]);
      if (1 != disappear[i])
        console.log("..");
        //score++;
      else
        disappear[i] = -1;
    }
  }

  //star animation respawn
  for (var i = 0; i < starx.length; i++)
  {
    if (stary[i] >= canvas.height)
    {
      starx[i] = Math.random()*(canvas.width - 1);
      stary[i] = 0;
    }
  }

  //collision of penty and SpaceShip
  for (var i = 0; i < ex.length; i++)
  {
    if ((ex[i] >= sx && ex[i] <= sx + swidth || ex[i] + ewidth >= sx && ex[i] + ewidth <= sx + swidth) && (ey[i] >= sy && ey[i] <= sy + swidth || ey[i]+ eheight >= sy && ey[i] + eheight <= sy + swidth) && 1 != disappear[i] && !fadeShip)
    {
      disappear[i] = 1;
      lives -= 1;
      fadeShip = true;
      pow = false;

      if (lives == 0)
      {
        clearInterval(intervalID);
        fadeShip = false;
        displayRestart();
      }


      setTimeout(function(){fadeShip = false;}, 2000);
     }

    //hit penty with laser
     if (pow && disappear[i] != 1 && lasery >= ey[i] && lasery <= ey[i] + eheight && laserx >= ex[i] && laserx <= ex[i] + ewidth)
     {
       score++;
       disappear[i] = 1;
       pow = false;
       console.log('hit');
     }
}
}

// ALL DRAWING FUNCTIONS
////////////////////////
function drawEnemy()
{
for (var i = 0; i < ey.length; i++)
{
  ey[i] += edy;
  if (1 != disappear[i])
  {
    ctx.drawImage(enemy, ex[i], ey[i]);
  }
}
}

function drawPlasma(x,y,width,height)
{
if (fadeShip)
  plasma.src = "./images/plasma1_fade.png";
else
  plasma.src = "./images/plasma1.png";

ctx.drawImage(plasma, sx, sy);
}

function drawStars()
{
for (var i = 0; i < stary.length; i++)
{
  ctx.beginPath();
  ctx.arc(starx[i], stary[i],  starRadius, 0, 2*Math.PI);
  //		x, y, radius, sAngle, eAngle
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  stary[i] += stardy;
}
}

function drawLives()
{
heartx = canvas.width - 40;

for (var i = 0; i < lives; i++)
{
  ctx.drawImage(heart, heartx - i*60, hearty);
}
}

function displayStart()
{
ctx.clearRect(0,0,canvas.width, canvas.height);

/*stardy = 1
drawStars();
checkWall();*/

ctx.fillStyle = 'white';
ctx.font = '40px Courier New';
ctx.fillText("Plasma's Spaceship", 35, 130);

//ctx.beginPath();
ctx.rect(canvas.width/2 - 75, canvas.height-300, 150, 80);
ctx.fillStyle = "red";
ctx.fill();
//ctx.closePath();

ctx.fillStyle = 'white';
ctx.font = '20px Courier New';
ctx.fillText("Let's Play", canvas.width/2 - 60, canvas.height-255);


}

function displayRestart()
{
ctx.rect(canvas.width/2 - 75, canvas.height/2 - 40, 150, 80);
ctx.fillStyle = "red";
ctx.fill();

ctx.fillStyle = 'white';
ctx.font = '20px Courier New';
ctx.fillText("Restart", canvas.width/2 - 40, canvas.height/2);
}

function displayScore()
{
ctx.fillStyle = 'white';
ctx.font = '30px Courier New';
ctx.fillText("Score: " +score, 10, 40);
}
/////////////////////////////////////////

//Mouse position
function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
  };
}

//Function to check whether a point is inside the rectangle button
function isInside(pos, rect){
  return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//Start Button Rectangle
var startRect = {
  x:175,
  y:500,
  width:150,
  height:180
};

//Restart Button Rectangle
var restartRect = {
  x:175,
  y:360,
  width:150,
  height:180
};

//Click to re/start game
document.addEventListener("click", function(evt)
{
  var mousePos = getMousePos(canvas, evt);

  if (isInside(mousePos,startRect) || isInside(mousePos,restartRect))
      load();

}, false);


//Functions to move Plasma
var moveL = false;
var moveR = false;
document.addEventListener("keydown", KeyDown, false);
document.addEventListener("keyup", KeyUp, false);
document.addEventListener("keydown", shoot, false);

function shoot()
{
  if (event.key == ' ' && !pow && !fadeShip)
  {
    drawShoot();
    console.log("shoot");
  }
}

function drawShoot()
{
    ctx.beginPath();
    ctx.arc(sx + swidth/2, sy + 5,  laserRadius, 0, 2*Math.PI);
    //		x, y, radius, sAngle, eAngle
    ctx.fillStyle = laserColor;
    ctx.fill();
    ctx.closePath();

    laserx = sx + swidth/2;
    lasery = sy +5;
    pow = true;
 }

function animateLaser()
{
  lasery -= laserdy;

  ctx.beginPath();
  ctx.arc(laserx, lasery,  laserRadius, 0, 2*Math.PI);
  //		x, y, radius, sAngle, eAngle
  ctx.fillStyle = laserColor;
  ctx.fill();
  ctx.closePath();

  if (lasery < -laserRadius)
  {
    pow = false;
  }

}

function KeyDown()
{
  if (event.key == "Left" || event.key == "ArrowLeft")
  {
    moveL = true;
  }
  if (event.key == "Right" || event.key == "ArrowRight")
    moveR = true;
}

function KeyUp()
{
  if (event.key == "Left" || event.key == "ArrowLeft")
    moveL = false;
  if (event.key == "Right" || event.key == "ArrowRight")
    moveR = false;
}

function moveShip()
{
  if (moveL)
    sx -= sdx;
  if (moveR)
    sx += sdx;
}
