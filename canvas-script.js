var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 420;

var gameBoard = document.getElementById('game-board');
var gameBackground = document.getElementById('game-background');
gameBoard.width = BOARD_WIDTH;
gameBoard.height = BOARD_HEIGHT;
var boundingRect = gameBoard.getBoundingClientRect();

var percentComplete = 0;
var pixelsMatched = 0;
var puzzlePixels = jerry;
var searchablePuzzlePixels = makeSearchable(jerry);
var userPixels = [];
var undoneUserPixels = [];
var drawing = false;
var iWon = false;
var passwordProgress = 0;
var password = [73, 77, 32, 71, 65, 89];

var ctx = gameBoard.getContext('2d');


// Drawing methods

function drawPixelSet(pixelSet) {
  ctx.beginPath();
  for (var j = 0; j < pixelSet.length; j++) {
    var x = (pixelSet[j] % BOARD_WIDTH) - boundingRect.top - 1;
    var y = Math.floor((pixelSet[j] / BOARD_WIDTH) - boundingRect.left - 1);
    if (j == 0) ctx.moveTo(x, y);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.rect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
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

  if (percentComplete > 5.0 && iWon === false) {
    iWon = true;
    gameBackground.src = "https://db.tt/iPCFWzsL";
    gameBackground.loop = false;
    puzzlePixels = [];
  }
}


// Misc.

function determineHit(pixel) {
  if (searchablePuzzlePixels.binarySearch(pixel) !== -1) {
    pixelsMatched++;
  }
}

function calculatePercentComplete() {
  var ratio = (pixelsMatched / searchablePuzzlePixels.length);
  return (Math.round(ratio * 10000) / 100);
}

function pushPixel(e) {
  var x = e.clientX;
  var y = e.clientY;
  var pixel = y * BOARD_WIDTH + x;
  userPixels[userPixels.length - 1].push(pixel);
  determineHit(pixel)
  percentComplete = calculatePercentComplete();
}

function makeSearchable(arr) {
  var reduced = [].concat.apply([], arr);
  var sorted = reduced.sort(function(a, b) { return a - b });
  var unique = [];
  for (var i = 0; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1]) { unique.push(sorted[i]); }
  };
  return unique;
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


// Overrides

Array.prototype.binarySearch = function(needle) {
  var min = 0;
  var max = this.length - 1;
  var currentIndex;
  var currentValue;

  while (min <= max) {
    currentIndex = (min + max) / 2 | 0;
    currentValue = this[currentIndex];
    if (needle === currentValue) { return currentIndex; }

    if (needle < this[currentIndex]) {
      max = currentIndex - 1;
    } else {
      min = currentIndex + 1;
    }
  }
  return -1;
}
