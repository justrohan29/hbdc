const app = document.querySelector("#game");

// setup
const numCols = 10;
const numRows = 8;
const inputText = "Lorem ipsum dolor sit amet, consyectetur adipisycing elit. Aliquam odio orci, sollicitydin in fermentum at";
const correctChars = ["A", "a", "O", "o"];

// modify at ease
const showSpace = false;
const hideCorrectLetter = true;
const leaveWrongMark = false;

// not used... yet?
const lineHeight = 50;
const numRowsVisible = 6;
const groundLevel = 0;

let matrix;
let maxScore;
let playerScore;

window.onload = () => {
  setup();
  setNewGame();
  setGravity();
};

function setup() {
  let newInput = prepareText(inputText, numCols * numRows, showSpace);
  let inputLines = breakText(newInput, numCols, numRows);
  matrix = makeTextContainer();
  app.appendChild(matrix);
  drawText(matrix, inputLines);
  mapLetters();
}

// leaves readable characters in input, no punctuation
function prepareText(input, length, showSpace = false) {
  let newInput = input.replace(/[^\w\s\']|_/g, "");
  if (!showSpace) newInput = newInput.replace(/\s+/g, "");
  return newInput.substr(0, length);
}

// converts input into lines of text
function breakText(input, cols, rows) {
  let words = [];
  for (let i = 0; i < rows; i++) {
    words.push(input.substr(i * cols, cols));
  }
  return words;
}

// creates a container for text lines
function makeTextContainer() {
  let element = document.createElement("div");
  element.classList.add("matrix");
  return element;
}

// fills container with lines of text
function drawText(container, textLines) {
  maxScore = 0;
  textLines.forEach((text, index) => {
    let newLine = makeLine(index);
    makeLetters(newLine, text);
    container.prepend(newLine);
  });
}

// creates a line to be filled with letters
function makeLine(index) {
  let element = document.createElement("div");
  element.classList.add("text-line");
  element.dataset.index = index;
  return element;
}

// fills a line with letters
function makeLetters(container, letters) {
  letters.split("").forEach((letter, index) => {
    container.appendChild(makeLetter(letter, true));
  });
}

// creates a letter tile
function makeLetter(char, randomCase) {
  let element = document.createElement("div");
  element.classList.add("letter-box");
  
  if (randomCase) {
    let rn = Math.floor(Math.random() * 11);
    char = rn % 2 ? char.toUpperCase() : char.toLowerCase();
  }
  if (isCorrectLetter(char)) maxScore++;

  let tileWrapper = makeLetterWrapper("tile");
  element.appendChild(tileWrapper);

  let charWrapper = makeLetterWrapper("char");
  charWrapper.innerHTML = char;
  element.appendChild(charWrapper);

  return element;
}

function makeLetterWrapper(type) {
  let tile = document.createElement("span");
  tile.classList.add("wrapper");
  tile.classList.add(type);
  return tile;
}

// adds logic to each letter tile it finds
function mapLetters() {
  Array.from(document.querySelectorAll(".letter-box")).forEach((element) => {
    element.addEventListener("click", (e) => {
      let letter = e.currentTarget;
      if (isCorrectLetter(letter.querySelector(".char").innerHTML)) {
        letter.classList.add("correct");
        if (hideCorrectLetter) letter.classList.add("hide");
        updateScore(1);
      } else {
        letter.classList.add("wrong");
        letter.addEventListener('animationend', letterAnimationListener);
      }
    });
  });
}

function isCorrectLetter(char) {
  return correctChars.indexOf(char) != -1;
}

function letterAnimationListener(e) {
  if (e.animationName == 'kf-letter-wrong-blink-top') {
    if (leaveWrongMark) {
      e.currentTarget.classList.add('mark');
      return null;
    }
    e.currentTarget.classList.remove('wrong');
  }
}

// text falling mechanism

// initial fall from top to bottom
function setGravity() {
  matrix.classList.add('gravity-intro');
  matrix.addEventListener('animationend', gravityIntroListener);
}

// one line fall loop
function gravityIntroListener(e) {
  if (e.animationName != 'kf-gravity-intro') return null;

  matrix.removeEventListener('animationend', gravityIntroListener);
  matrix.classList.remove('gravity-intro');

  matrix.addEventListener('animationiteration', gravityLoopListener);
  matrix.classList.add('gravity-loop');
  
  fadeLastRow();
}

function gravityLoopListener(e) {
  if (e.animationName != 'kf-gravity-loop') return null;
  swapItems();
}

// makes text disappear
function fadeLastRow() {
  matrix.lastChild.classList.add('row-fade');
}

// moves last row to the beginning
function swapItems() {
  let lastLine = matrix.lastChild;
  matrix.prepend(lastLine);
  lastLine.classList.remove('row-fade');

  fadeLastRow();
}

function stopGravity() {
  matrix.classList.remove('gravity-loop');
}

// game conditions

function updateScore(amount) {
  playerScore += amount;
  checkWinGame();
}

function checkWinGame() {
  if (playerScore == maxScore) winGame();
}

function winGame() {
  stopGravity();
  alert("A winner is you!");
}

function setNewGame() {
  playerScore = 0;
}