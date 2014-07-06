var jPong = function () {
  if (!Modernizr.canvas) {
    return;
  }

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  //application states
  var stateFunc = null;

  //title screen
  var titleStarted = false;

  //gameover screen
  var gameOverStarted = false;

  //objects for game play
  //game environment
  var playerScore = 0;
  var computerScore = 0;
  var level = 0;

  //playfield
  var xMin = 0;
  var xMax = canvas.width;
  var yMin = 0;
  var yMax = canvas.height;

  //create game objects and arrays
  var player = {};
  var computer = {};
  var ball = {};

  //keyPresses
  var keyPressList = [];

  var runGame = function () {
    stateFunc();
  }

  //gameStateTitle();
  //initial state
  //draws title screen once and waits for space bar
  //changes state to NewGame
  var gameStateTitle = function () {
    if (titleStarted != true) {
      fillBackground();
      setTextStyle();
      context.fillText("HTML5 Canvas Pong", 130, 70);
      context.fillText("Press Space To Play", 120, 140);
      titleStarted = true;
    }
    else {
      //wait for space key click
      if (keyPressList[32] == true) {
        stateFunc = gameStateNewGame;
        titleStarted = false;
      }
    }
  }

  //gameStateNewGame();
  //initializes variables and changes state to 
  var gameStateNewGame = function () {
    //set up new game

    level = 0;
    playerScore = 0;
    computerScore = 0;

    player.maxSpeed = 240;
    player.width = 20;
    player.height = 40;
    player.halfWidth = player.width / 2;
    player.halfHeight = player.height / 2;
    player.up = false;
    player.down = false;

    computer.maxSpeed = 240;
    computer.width = 20;
    computer.height = 40;
    computer.halfWidth = computer.width / 2;
    computer.halfHeight = computer.height / 2;

    ball.xVelMax = 480;
    ball.width = 10;
    ball.halfWidth = ball.width / 2;
    serveBall();

    fillBackground();
    renderMedian();
    renderScoreBoard();

    player.y = yMax / 2;
    computer.y = yMax / 2;

    stateFunc = gameStatePlay;
  }

  var gameStatePlay = function () {
    checkKeys();
    update();
    render();
    frameRateCounter.countFrames();
  }

  var gameStateGameOver = function () {
    if (gameOverStarted != true) {
       render();
       setTextStyle();
       context.fillText("Game Over!", 150, 70);
       context.fillText("Press Space To Play", 120, 140);
       gameOverStarted = true;
    }
    else {
      //wait for space key click
      if (keyPressList[32] == true) {
        switchGameState(GAME_STATE_TITLE);
        gameOverStarted = false;
      }
    }
  }

  var render = function () {
    fillBackground();
    renderMedian();
    renderScoreBoard();
    renderPaddle(computer, xMax - 20);
    renderPaddle(player, 20);
    renderBall();
  }

  var fillBackground = function () {
    context.fillStyle = '#000000';
    context.fillRect(xMin, yMin, xMax, yMax);
  }

  var setTextStyle = function () {
    context.fillStyle = '#ffffff';
    context.font = '15px _sans';
    context.textBaseline = 'top';
  }

  var renderMedian = function () {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.strokeStyle = '#7F7F7F';
    context.lineWidth = 6;

    context.beginPath();

    for (var y = 5; y < yMax; y += 20) {
      context.moveTo(xMax / 2, y);
      context.lineTo(xMax / 2, y + 10);
    }

    context.stroke();
    context.closePath();

    context.restore();
  }

  var renderScoreBoard = function () {
    context.save();

    context.fillStyle = '#ffffff';
    context.fillText('Player: ' + playerScore, 10, 20);
    context.fillText('Computer: ' + computerScore, 220, 20);
    context.fillText('FPS: ' + frameRateCounter.lastFrameCount, 500, 20);

    context.restore();
/*
    context.fillStyle = '#ffffff';
    context.fillText('Score ' + score, 10, 20);
    renderPlayerShip(200, 16, 270, 0.75)
    context.fillText('X ' + playerShips, 220, 20);
    context.fillText('FPS: ' + frameRateCounter.lastFrameCount, 300, 20);
*/
  }

  var checkKeys = function () {
    //check keys
    if (keyPressList[87] == true || keyPressList[38] == true) {
      //up
      player.up = true;
    }
    else {
      player.up = false;
    }

    if (keyPressList[83] == true || keyPressList[40] == true) {
      player.down = true;
    }
    else {
      player.down = false;
    }
  }

  var update = function () {
    updateBall();
    updatePlayer();
    updateComputer();
    bounceBall();
  }

  var updateBall = function () {
    if (ball.serve > 0) {
      ball.serve -= (1 / FRAME_RATE);
      return;
    }

    ball.x += ball.xVel / FRAME_RATE;
    ball.y += ball.yVel / FRAME_RATE;
  }

  var updatePlayer = function () {
    if (player.up == true && player.down == false) {
      player.y -= player.maxSpeed / FRAME_RATE;

      if (player.y < xMin) {
        player.y = xMin;
      }
    }
    else if (player.down == true && player.up == false) {
      player.y += player.maxSpeed / FRAME_RATE;

      if (player.y > yMax) {
        player.y = yMax;
      }
    }

    var q;
    if (ball.xVel > 0) {
      q = ((xMax - 30) - ball.x) + (xMax - 30 - 30);
    }
    else {
      q = ball.x - 30;
    }

    var y = ball.y + ((ball.yVel / Math.abs(ball.xVel)) * q);
    p = Math.floor(y / yMax);

    if (p % 2 == 1) {
      ball.yy = yMax - (y % yMax);
    }
    else {
      ball.yy = Math.abs(y % yMax);
    }
  }

  var updateComputer = function () {
    if (ball.y < computer.y) {
      computer.y -= computer.maxSpeed / FRAME_RATE;

      if (ball.y > computer.y) {
        computer.y = ball.y;
      }
    }
    else if (ball.y > computer.y) {
      computer.y += computer.maxSpeed / FRAME_RATE;

      if (ball.y < computer.y) {
        computer.y = ball.y;
      }
    }
  }

  var serveBall = function () {
    ball.x = (xMin + xMax) / 2;
    ball.y = (yMin + yMax) / 2;
    ball.xVel = 100 + ((playerScore + computerScore) * 50);

    if (ball.xVel > ball.xVelMax) {
      ball.xVel = ball.xVelMax;
    }

    ball.yVel = 100;
    ball.serve = 1;
  }

  var bounceBall = function () {
    //computer scored
    if (ball.x < xMin) {
      computerScore += 1;
      serveBall();
    }

    //player scored
    if (ball.x > xMax) {
      playerScore += 1;
      computer.maxSpeed += 50;
      serveBall();
    }

    //collision with sides
    if (ball.yVel < 0 && ball.y < yMin) {
      ball.y = yMin - ball.y;
      ball.yVel = -ball.yVel;
    }
    else if (ball.yVel > 0 && ball.y > yMax) {
      ball.y = yMax + yMax - ball.y;
      ball.yVel = -ball.yVel;
    }

    //collision with player 
    if (ball.xVel < 0 && ball.x < 30 && ball.x > 10) {
      if (ball.y > player.y - player.halfHeight &&
          ball.y < player.y + player.halfHeight) {
        var yVel;

        if (player.up == true && player.down == false) {
          yVel = -(player.maxSpeed + Math.abs(ball.yVel));
        }
        else if (player.down == true && player.up == false) {
          yVel = player.maxSpeed + Math.abs(ball.yVel);
        }
        else {
          yVel = ball.yVel + player.maxSpeed * ((ball.y - player.y) / player.width);
        }

        ball.xVel = Math.abs(yVel - ball.yVel) - ball.xVel;
        ball.yVel = yVel;

        if (ball.xVel > ball.xVelMax) {
          ball.xVel = ball.xVelMax;
        }

        if (ball.yVel > (computer.maxSpeed + 100)) {
          ball.yVel = computer.maxSpeed + 100;
        }
        else if (ball.yVel < -(computer.maxSpeed + 100)) {
          ball.yVel = -(computer.maxSpeed + 100);
        }
/*
        ball.xVel = Math.abs(ball.y - player.y) - ball.xVel;
        ball.yVel = ball.yVel + ball.y - player.y;

        if (player.up == true && player.down == false) {
          ball.xVel += player.maxSpeed;
          ball.yVel -= player.maxSpeed;
        }
        else if (player.down == true && player.up == false) {
          ball.xVel += player.maxSpeed;
          ball.yVel += player.maxSpeed;
        }
*/
      }
    }

    // collision with computer
    if (ball.xVel > 0 && ball.x > xMax - 30 && ball.x < xMax - 10) {
      if (ball.y > computer.y - computer.halfHeight &&
          ball.y < computer.y + computer.halfHeight) {
        //a mirrored return.
        ball.x = (2 * (xMax - 30)) - ball.x;
        ball.xVel = -ball.xVel;

        //varies the velocity a little based on where the computer hits the ball.
        //ball.xVel = Math.abs(ball.y - computer.y) - ball.xVel;
        //ball.yVel = ball.yVel + ball.y - computer.y;
      }
    }
  }

  var renderPaddle = function (paddle, x) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = '#ffffff';

    context.fillRect(x - paddle.halfWidth, paddle.y - paddle.halfHeight, paddle.width, paddle.height);

    context.restore();
  }

  var renderBall = function () {
    if (ball.serve > 0) {
      return;
    }

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = '#ffffff';

    context.fillRect(ball.x - ball.halfWidth, ball.y - ball.halfWidth, ball.width, ball.width);

    context.fillRect(30 - ball.halfWidth, ball.yy - ball.halfWidth, ball.width, ball.width);

    context.restore();
  }

  document.onkeydown = function (e) {
    e = e ? e : window.event;
    keyPressList[e.keyCode] = true;
  }

  document.onkeyup = function (e) {
    e = e ? e : window.event;
    keyPressList[e.keyCode] = false;
  }

  //*** application start
  stateFunc = gameStateTitle;
  frameRateCounter = new FrameRateCounter();

  //**** application loop
  const FRAME_RATE = 40;
  var intervalTime = 1000 / FRAME_RATE;
  setInterval(runGame, intervalTime);
}

//***** object prototypes *****
//*** consoleLog util object
//create constructor
var ConsoleLog = function () {
}

//create function that will be added to the class
console_log = function (message) {
  if(typeof(console) !== 'undefined' && console != null) {
    console.log(message);
  }
}

//add class/static function to class by assignment
ConsoleLog.log = console_log;
//*** end console log object
//*** FrameRateCounter  object prototype

var FrameRateCounter = function () {
   this.lastFrameCount = 0;
   var dateTemp = new Date();
   this.frameLast = dateTemp.getTime();
   delete dateTemp;
   this.frameCtr = 0;
}

FrameRateCounter.prototype.countFrames = function () {
  var dateTemp = new Date();
  this.frameCtr++;

  if (dateTemp.getTime() >= this.frameLast + 1000) {
    ConsoleLog.log("frame event");
    this.lastFrameCount = this.frameCtr;
    this.frameLast = dateTemp.getTime();
    this.frameCtr = 0;
  }

  delete dateTemp;
}

var Debugger = function () {};

Debugger.log = function (message) {
  try {
    console.log(message);
  }
  catch (exception) {
    return;
  }
}
