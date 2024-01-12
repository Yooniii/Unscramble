const url ="https://random-word-api.herokuapp.com/word?length=10";
const wordRef = document.getElementById("word-ref");
var input = document.getElementById("user-input");
const startBtn = document.getElementById("start-btn");
let allowedKeys = [];
let wordHistory = [];
let scoreCount = 0;
let word;
let startTimer;
const startingMinutes = 1;
let time = startingMinutes * 60;
const countdownEl = document.getElementById("timer");

startBtn.addEventListener("click", startGame);

function updateCountdown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  } 
  countdownEl.innerHTML = `${minutes}:${seconds}`;
  time--;

  if (time < 0) {
    clearInterval(startTimer);
    endGame();
  }
}

function startGame() {
  startTimer = setInterval(updateCountdown, 1000);
  
  initBoard();
  console.log(word);
  startBtn.disabled = true;
  input.disabled = false;

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      if (allowedLetters(input.value, allowedKeys)) {
        checkWord(input.value); // check for previous entries + valid eng word
        input.value = "";
      }
      else {
        input.value = "";
        console.log("contains letters not allowed");
        document.getElementById("error-msg").innerHTML = "Word contains disallowed letters!"
      }
    }
  });
}

function allowedLetters(input, allowedKeys) {
  for (let i = 0; i < input.length; i++) {
    if (!allowedKeys.includes(input[i])) {
      return false;
    }
  }
  return true;
}

function initBoard() {
  fetch(url)
    .then(response => response.json())
    .then(words => {
      word = words[0];
      wordRef.innerHTML = word;
      // initialize grey keyboard
      for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "Grey"
      }
      // shade allowed letter keys 
      for (let i=0; i<10; i++) {
        shadeAllowedKeys(word[i]);
        allowedKeys.push(word[i]);
      }
    })
  .catch(error => console.error(error));
}

function shadeAllowedKeys(letter) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      if (elem.style.backgroundColor === "Green") {
        return;
      }
      elem.style.backgroundColor = "Green";
      break;
    }
  }
}

async function checkWord(userWord) {
  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + userWord);
  const data = await response.json();
  
    if (data.title === 'No Definitions Found') {
      console.log(`The word '${userWord}' is not a valid English word.`);
      document.getElementById("error-msg").innerHTML = "Not a valid word!";

    } else if (wordHistory.indexOf(userWord) === -1) {
      console.log(`The word '${userWord}' is a valid English word.`);
      
      updateScore(getPoints(userWord.length));
      document.getElementById("error-msg").innerHTML = "";
      wordHistory.push(userWord);

    } else if (wordHistory.indexOf(userWord) >= 0) {
      console.log("already entered");
      document.getElementById("error-msg").style.innerHTML = `'${userWord}' was already entered`;
    }

  // handle 404 errors gracefully
}
  
function getPoints(wordLength) {
  if (wordLength >= 1 && wordLength <= 3) {
    return scoreCount += 2;
  } else if (wordLength === 4 || wordLength=== 5) {
    return scoreCount += 4;
  } else if (wordLength >= 6 && wordLength <= 9) {
    return scoreCount += 5;
  } else if (wordLength >= 10) {
    return scoreCount += 10;
  }
}

function updateScore(points) {
  var scoreWindow = document.getElementById("score-window");
  scoreWindow.innerHTML = "Current Points: " + points;
  console.log("score updated")
}

function endGame () {
  console.log("end");
  input.disabled = true;

  // play again?
  // reset wordHistory
  // reset scoreCount
}