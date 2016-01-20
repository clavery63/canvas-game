var GAME_BOARD_WIDTH = 600;
var GAME_BOARD_HEIGHT = 600;

var gameBoard = document.getElementById('game-board');
var gameBackground = document.getElementById('game-background');
gameBoard.width = GAME_BOARD_WIDTH;
gameBoard.height = GAME_BOARD_HEIGHT;
var boundingRect = gameBoard.getBoundingClientRect();

var pixelSets = [];
var undonePixelSets = [];
var drawing = false;
var passwordProgress = 0;
var password = [73, 77, 32, 71, 65, 89];

var ctx = gameBoard.getContext('2d');

ctx.fillStyle = '#009999';

function pushPixel(e) {
  var x = e.clientX;
  var y = e.clientY;
  pixelSets[pixelSets.length - 1].push(y * GAME_BOARD_WIDTH + x);
}

function drawPixelSet(pixelSet) {
  ctx.beginPath();
  for (var j = 0; j < pixelSet.length; j++) {
    var x = (pixelSet[j] % GAME_BOARD_WIDTH) - boundingRect.top - 1;
    var y = Math.floor((pixelSet[j] / GAME_BOARD_WIDTH) - boundingRect.left - 1);
    if (j == 0) ctx.moveTo(x, y);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#fff';
  ctx.rect(0, 0, GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
  ctx.fill();
  ctx.drawImage(gameBackground, 0, 0);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;

  for (var i = 0; i < pixelSets.length; i++) {
    var pixelSet = pixelSets[i];
    drawPixelSet(pixelSet);
  }

  window.requestAnimationFrame(draw);
}

// Trigger Game Loop

window.requestAnimationFrame(draw);


// Event Handlers

function mouseDown(e) {
  drawing = true;
  pixelSets.push([]);
  pushPixel(e);
}

function mouseUp(e) {
  drawing = false;
}

function mouseMove(e) {
  if (drawing == true) {
    pushPixel(e);
  }
}

function keyUp(e) {
  if (e.keyCode == password[passwordProgress]) {
    passwordProgress++;
  } else {
    passwordProgress = 0;
  }

  if (passwordProgress > 5) {
    pixelSets = [];
    undonePixelSets = [];
    passwordProgress = 0;
  }

  // ctrl+z for undo
  if (e.ctrlKey == true && e.keyCode == 90 && pixelSets.length) {
    undonePixelSets.push(pixelSets.pop());
  }

   // ctrl+y for redo
  if (e.ctrlKey == true && e.keyCode == 89 && undonePixelSets.length) {
    pixelSets.push(undonePixelSets.pop());
  }
}
