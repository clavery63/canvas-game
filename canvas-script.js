var GAME_BOARD_WIDTH = 600;
var GAME_BOARD_HEIGHT = 420;

var gameBoard = document.getElementById('game-board');
var gameBackground = document.getElementById('game-background');
gameBoard.width = GAME_BOARD_WIDTH;
gameBoard.height = GAME_BOARD_HEIGHT;
var boundingRect = gameBoard.getBoundingClientRect();

var percentComplete = 0;
var pixelsMatched = 0;
var puzzlePixels = jerry;
var userPixels = [];
var undoneUserPixels = [];
var drawing = false;
var passwordProgress = 0;
var password = [73, 77, 32, 71, 65, 89];

var ctx = gameBoard.getContext('2d');

ctx.fillStyle = '#009999';

function pushPixel(e) {
  var x = e.clientX;
  var y = e.clientY;
  userPixels[userPixels.length - 1].push(y * GAME_BOARD_WIDTH + x);
  percentComplete = calculatePercentComplete();
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
  ctx.fillStyle = '#ffffff';
  ctx.rect(0, 0, GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
  ctx.fill();
  ctx.drawImage(gameBackground, 0, 0);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  for (var i = 0; i < puzzlePixels.length; i++) {
    var pixelSet = puzzlePixels[i];
    drawPixelSet(pixelSet);
  }

  ctx.strokeStyle = '#ff0000';

  for (var i = 0; i < userPixels.length; i++) {
    var pixelSet = userPixels[i];
    drawPixelSet(pixelSet);
  }
}

function updateDOM() {
  percentageSpan = document.getElementById('jerry-percentage');
  percentageSpan.textContent = percentComplete;
}

function calculatePixelsMatched(mergedPuzzlePixels, mergedUserPixels) {
  pixelsMatched = 0;

  for (var i = 0; i < mergedPuzzlePixels.length; i++) {
    for (var j = 0; j < mergedUserPixels.length; j++){
      if (mergedPuzzlePixels[i] == mergedUserPixels[j]) {
        debugger;
        pixelsMatched++;
        break;
      }
    }
  }
  return pixelsMatched;
}

function calculatePercentComplete() {
  var mPP = [].concat.apply([], puzzlePixels);
  var mUP = [].concat.apply([], userPixels);
  var ratio = (calculatePixelsMatched(mPP, mUP) / mPP.length);
  return (Math.round(ratio * 10000) / 100);
}

// Main Game Loop

function gameLoop() {
  draw();
  updateDOM();

  window.requestAnimationFrame(gameLoop);
}

// Trigger Game Loop

window.requestAnimationFrame(gameLoop);


// Event Handlers

function mouseDown(e) {
  drawing = true;
  userPixels.push([]);
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
    userPixels = [];
    undoneUserPixels = [];
    passwordProgress = 0;
  }

  // ctrl+z for undo
  if (e.ctrlKey == true && e.keyCode == 90 && userPixels.length) {
    undoneUserPixels.push(userPixels.pop());
  }

   // ctrl+y for redo
  if (e.ctrlKey == true && e.keyCode == 89 && undoneUserPixels.length) {
    userPixels.push(undoneUserPixels.pop());
  }
}
