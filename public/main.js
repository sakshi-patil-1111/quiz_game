let questions = [];
let highScore;

let quizSection = document.querySelector(".quiz-section");
let quizBox = document.querySelector(".quiz-box");
let resultBox = document.querySelector(".result-box");
let newRoundBtn = document.querySelector(".newRound-btn");
let goHomeBtn = document.querySelector(".goHome-btn");
let progressBar = document.querySelector(".progress-bar");
let optionList = document.querySelector(".option-list");
let timer;
let timeLeft = 15;
let timerDisplay = document.querySelector(".timer-display");
let highScoreDisplay = document.querySelector(".high-score");
let questionCount = 0;
let questionNum = 1;
let userScore = 0;
let nextBtn = document.querySelector(".next-btn");

async function initializeQuiz() {
  await getDataFromServer();

  goHomeBtn.addEventListener("click", () => {
    window.location.href = "/";
  });

  showQuestions(0);
  updateDetails(1);
  headerScore();

  newRoundBtn.addEventListener("click", () => {
    window.location.href = "/select";
  });

  nextBtn.addEventListener("click", () => {
    if (questionCount < questions.length - 1) {
      questionCount++;
      showQuestions(questionCount);
      updateProgressBar();

      questionNum++;
      updateDetails(questionNum);
      nextBtn.classList.remove("active");
    } else {
      showResultBox();
    }
  });
}

async function getDataFromServer() {
  await fetch("/api/questions")
    .then((response) => response.json())
    .then((data) => {
      questions = data;
    })
    .catch((error) => console.error("Error fetching questions:", error));

  await fetch("/api/highScore")
    .then((response) => response.json())
    .then((data) => {
      highScore = parseInt(data.highScore);
    })
    .catch((error) => console.error("Error fetching highscore:", error));
}

function showQuestions(index) {
  let questionText = document.querySelector(".question-text");
  questionText.innerHTML = `${questions[index].question}`;

  let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
    <div class="option"><span>${questions[index].options[1]}</span></div>
    <div class="option"><span>${questions[index].options[2]}</span></div>
    <div class="option"><span>${questions[index].options[3]}</span></div>`;

  optionList.innerHTML = optionTag;

  let option = document.querySelectorAll(".option");
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }

  resetTimer();
  startTimer();
}

function optionSelected(ans) {
  let allOptions = optionList.children.length;
  let correctAns = questions[questionCount].correct_answer;

  if (ans) {
    let userAns = ans.textContent;

    clearInterval(timer);
    if (userAns === correctAns) {
      ans.classList.add("correct");
      userScore++;
      headerScore();
    } else {
      ans.classList.add("incorrect");
    }
  }
  for (let i = 0; i < allOptions; i++) {
    optionList.children[i].classList.add("disabled");
    if (optionList.children[i].textContent === correctAns) {
      optionList.children[i].classList.add("correct");
    }
  }

  nextBtn.classList.add("active");
}

function updateDetails(index) {
  if (questions && questions.length > 0 && questions[index - 1]) {
    let questionTotal = document.querySelector(".question-total");
    let categoryInfo = document.querySelector(".category-info");
    let difficultyInfo = document.querySelector(".difficulty-info");

    questionTotal.innerHTML = `${index} of ${questions.length} Questions`;
    categoryInfo.innerHTML = `Category: ${questions[index - 1].category}`;
    difficultyInfo.innerHTML = `Difficulty: ${questions[index - 1].difficulty}`;
  }
}

function headerScore() {
  let headerScoreText = document.querySelector(".header-score");
  headerScoreText.textContent = `Score : ${userScore} / ${questions.length}`;
}

function showResultBox() {
  quizBox.classList.add("not-active");
  resultBox.classList.add("active");

  let scoreText = document.querySelector(".score-text");
  scoreText.textContent = `Your Score is ${userScore} out of ${questions.length}`;

  let circularProgress = document.querySelector(".progress");
  let progressVal = document.querySelector(".progress-value");
  let progressStartVal = -1;
  let progressEndVal = Math.round((userScore / questions.length) * 100);
  let speed = 20;

  let progress = setInterval(() => {
    progressStartVal++;

    progressVal.textContent = `${progressStartVal}%`;
    circularProgress.style.background = `conic-gradient(#c40094 ${
      progressStartVal * 3.6
    }deg, rgba(255, 255, 255, 0.1) 0deg)`;

    if (progressStartVal === progressEndVal) {
      clearInterval(progress);
    }
  }, speed);

  updateHighScore();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft < 6) {
      timerDisplay.classList.add("active");
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      optionSelected(null);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timerDisplay.classList.remove("active");
  timeLeft = 15;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
}

function updateProgressBar() {
  let progressPercentage = (questionNum / questions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function updateHighScore() {
  let scorePercentage = Math.round((userScore / questions.length) * 100);
  if (scorePercentage > highScore) {
    highScore = scorePercentage;
    saveHighScore(highScore);
  }
  highScoreDisplay.textContent = `${highScore}%`;
}

async function saveHighScore(highScore) {
  await fetch("/api/highScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newhighScore: highScore }),
  }).catch((error) => console.error("Error saving highscore:", error));
}

initializeQuiz();
