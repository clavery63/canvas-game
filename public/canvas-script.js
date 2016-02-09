var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 420;

var gameBackground = document.getElementById('game-background');
var heroSpan = document.getElementById('hero-name');
var gameBoard = document.getElementById('game-board');
var boundingRect = gameBoard.getBoundingClientRect();

gameBoard.width = BOARD_WIDTH;
gameBoard.height = BOARD_HEIGHT;

var drawing = false;
var passwordProgress = 0;
var password = [73, 77, 32, 71, 65, 89];
var ctx = gameBoard.getContext('2d');
var level = 1;

var percentComplete, pixelsMatched, puzzlePixels, eb,
searchablePuzzlePixels, userPixels, undoneUserPixels, iWon


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
  var percentageSpan = document.getElementById('percentage');
  percentageSpan.textContent = percentComplete;

  var percentRequired = levelData[level - 1].percent || 1.0;

  if (percentComplete > percentRequired && iWon === false) {
    iWon = true;
    gameBackground.src = levelData[level - 1].good;
    gameBackground.loop = false;
    puzzlePixels = [];
    setTimeout(function() {
      // setTimeout for now.  Later we'll listen for when the video stops
      loadLevel(++level);
    }, 7000);
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

function loadLevel(level) {
  if (level > levelData.length) { window.location = eb; }
  heroSpan.textContent = levelData[level - 1].heroName;
  gameBackground.src = levelData[level - 1].bad;
  gameBackground.loop = true;
  percentComplete = 0;
  pixelsMatched = 0;
  puzzlePixels = levelData[level - 1].puzzle;
  searchablePuzzlePixels = makeSearchable(levelData[level - 1].puzzle);
  userPixels = [];
  undoneUserPixels = [];
  iWon = false;
}

function doSomething() {
  var a = eb = "";
  var b = [
    10431, 16311, 63112, 35834, 73473, 11931, 19311, 93463, 10139, 83973,
    1173, 109311, 53119, 31113, 1143, 1083100, 3463, 99311, 13109, 347
  ];

  for (var i = 0; i < b.length; i++) { a = a.concat(b[i].toString()); }

  var c = a.split(3);

  for (var i = 0; i < c.length; i++) { eb = eb.concat(String.fromCharCode(c[i])); }
}


// Main Game Loop

function gameLoop() {
  draw();
  updateDOM();

  window.requestAnimationFrame(gameLoop);
}


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


// Trigger Game Loop

doSomething();
loadLevel(1);
window.requestAnimationFrame(gameLoop);
