const url ="https://random-word-api.herokuapp.com/word?length=10";
const wordRef = document.getElementById("word-ref");
const playBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const countdownEl = document.getElementById("timer");
const startingMinutes = 1;
const input = document.getElementById("user-input");
let allowedKeys = [];
let wordHistory = [];
let scoreCount = 0;
let word;
let timer;
let time;
playBtn.addEventListener("click", startGame);

function startGame() {
  time = startingMinutes * 60;
  timer = setInterval(updateCountdown, 1000);
  initBoard();
  playBtn.disabled = true;
  input.disabled = false;

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      if (checkLetters(input.value.toLowerCase(), allowedKeys)) {
        checkWord(input.value); // check for previous entries + valid  word
        input.value = "";
      }
      else {
        input.value = "";
        document.getElementById("error-msg").innerHTML = "Word contains disallowed letters!"
      }
    }
  });
}

function updateCountdown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  } 
  countdownEl.innerHTML = `${minutes}:${seconds}`;
  time--;

  if (time < 0) {
    clearInterval(timer);
    endGame();
  }
}

function initBoard() {
  fetch(url)
    .then(response => response.json())
      .then(words => {
        word = words[0];
        wordRef.innerHTML = word;
        wordRef.style.fontSize = "40px";

        for (const elem of document.getElementsByClassName("keyboard-button")) {
          elem.style.backgroundColor = "rgb(218, 218, 218)"
        }

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
      if (elem.style.backgroundColor === "#b2eb99") {
        return;
      }
      elem.style.backgroundColor = "#b2eb99";
      break;
    }
  }
}

function checkLetters (input, allowedKeys) {
  for (let i = 0; i < input.length; i++) {
    if (!allowedKeys.includes(input[i])) {
      return false;
    }
  }
  return true;
}

async function checkWord(userWord) {
  fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + userWord)
    .then(response => response.json())
      .then (data => {
        if (data.title === 'No Definitions Found') {
          document.getElementById("error-msg").innerHTML = "Not a valid word";

        } else if (wordHistory.indexOf(userWord) === -1) {
          wordHistory.push(userWord);
          updateScore(getPoints(userWord.length));
          document.getElementById("error-msg").innerHTML ="";

        } else if (wordHistory.indexOf(userWord >= 0)) {
          document.getElementById("error-msg").innerHTML = userWord + " was already entered";
        }
      })
}

  
function getPoints(wordLength) {
  if (wordLength >= 1 && wordLength <= 3) {
    return scoreCount += 2;
  } else if (wordLength === 4 || wordLength=== 5) {
    return scoreCount += 4;
  } else if (wordLength >= 6 && wordLength <= 9) {
    return scoreCount += 6;
  } else if (wordLength >= 10) {
    return scoreCount += 10;
  }
}

function updateScore(points) {
  document.getElementById("score-window").innerHTML = "Current Score: " + points;
}

function endGame () {
  input.value = "";
  input.disabled = true;
  document.getElementById("word-ref").innerHTML = "GAME OVER";
  document.getElementById("error-msg").innerHTML = "";
  playAgainBtn.disabled = false;

  playAgainBtn.onclick = function () {
    if (timer) {
      clearInterval(timer);
    }
    
    allowedKeys = [];
    wordHistory = [];
    scoreCount = 0;
    document.getElementById("score-window").innerHTML = "Current Score: 0";
    startGame();
    playAgainBtn.disabled = true;
  }
}