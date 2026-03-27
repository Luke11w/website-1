const QUESTION_POOL = [
  {
    question: `Ein Raum hat 4 Ecken.
In jeder Ecke sitzt 1 Katze.
Vor jeder Katze sitzen 3 Katzen.
Wie viele Katzen sind im Raum?`,
    answers: ["4"]
  },
  {
    question: `Du hast 3 Äpfel.
Du nimmst 2 weg.
Wie viele hast du?`,
    answers: ["2"]
  },
  {
    question: `Wie viele Monate haben 28 Tage?`,
    answers: ["12"]
  },
  {
    question: `Ein Bauer hat 17 Schafe.
Alle bis auf 9 laufen weg.
Wie viele bleiben übrig?`,
    answers: ["9"]
  },
  {
    question: `Wenn du an einem Rennen teilnimmst
und den Zweiten überholst,
an welchem Platz bist du dann?`,
    answers: ["2", "zweiter", "platz 2"]
  },
  {
    question: `Ein Flugzeug stürzt genau auf der Grenze
von Deutschland und Frankreich ab.
In welchem Land werden die Überlebenden begraben?
Gib 0 ein, wenn gar nicht.`,
    answers: ["0", "gar nicht", "nicht", "nirgendwo"]
  },
  {
    question: `Was ist schwerer:
1 Kilo Federn oder 1 Kilo Steine?
Gib den Unterschied als Zahl ein.`,
    answers: ["0"]
  },
  {
    question: `Du gehst um 20 Uhr schlafen
und stellst deinen Wecker auf 9 Uhr.
Wie viele Stunden schläfst du?`,
    answers: ["1"]
  },
  {
    question: `Wie oft kannst du 10 von 100 abziehen?`,
    answers: ["1"]
  },
  {
    question: `Wenn 5 Maschinen 5 Minuten brauchen,
um 5 Teile herzustellen,
wie lange brauchen 100 Maschinen für 100 Teile?`,
    answers: ["5"]
  },
  {
    question: `Ein elektrischer Zug fährt von Bern nach Zürich.
Der Wind weht nach Westen.
In welche Richtung weht der Rauch?
Gib 0 ein, wenn es keinen gibt.`,
    answers: ["0"]
  },
  {
    question: `2, 4, 8, 16, ?
Welche Zahl kommt als nächstes?`,
    answers: ["32"]
  }
];

const WRONG_MESSAGES = [
  "❌ Falsch. Denk nochmal nach.",
  "❌ Nope. Das war ein Trick.",
  "❌ Nicht richtig. Versuch es nochmal.",
  "❌ Fast... aber leider nein.",
  "❌ John Pork schüttelt den Kopf."
];

const QUIZ_KEY = "johnPorkQuizSimple";
const SOLVED_KEY = "johnPorkSolvedSimple";

function normalizeText(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startNewRun() {
  const selected = shuffleArray(QUESTION_POOL).slice(0, 5);
  sessionStorage.setItem(QUIZ_KEY, JSON.stringify(selected));
  sessionStorage.setItem(SOLVED_KEY, "0");
}

function getQuiz() {
  const raw = sessionStorage.getItem(QUIZ_KEY);
  if (!raw) {
    startNewRun();
    return JSON.parse(sessionStorage.getItem(QUIZ_KEY));
  }
  return JSON.parse(raw);
}

function getSolved() {
  return Number(sessionStorage.getItem(SOLVED_KEY) || "0");
}

function setSolved(step) {
  sessionStorage.setItem(SOLVED_KEY, String(step));
}

function canOpenStep(step) {
  if (step === 1) return true;
  return getSolved() >= step - 1;
}

function protectStep(step) {
  if (!canOpenStep(step)) {
    window.location.href = "raetsel-1.html";
  }
}

function loadQuestionPage(step) {
  if (step === 1) {
    startNewRun();
  } else {
    protectStep(step);
  }

  const quiz = getQuiz();
  const current = quiz[step - 1];

  const card = document.getElementById("quizCard");
  const title = document.getElementById("questionTitle");
  const text = document.getElementById("questionText");
  const progressLabel = document.getElementById("progressLabel");
  const progressFill = document.getElementById("progressFill");
  const answerInput = document.getElementById("answerInput");
  const checkBtn = document.getElementById("checkBtn");
  const result = document.getElementById("resultText");

  title.textContent = `Rätsel ${step} / 5`;
  text.textContent = current.question;
  progressLabel.textContent = `Fortschritt: ${step} von 5`;
  progressFill.style.width = `${step * 20}%`;

  function showWrong() {
    result.className = "result bad";
    result.textContent = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    answerInput.select();
  }

  function showCorrect() {
    result.className = "result good";
    result.textContent = "✅ Richtig! Weiter geht's...";
    setSolved(step);

    const nextPage = step === 5 ? "geschafft.html" : `raetsel-${step + 1}.html`;
    setTimeout(() => {
      window.location.href = nextPage;
    }, 800);
  }

  function checkAnswer() {
    const value = normalizeText(answerInput.value);
    const validAnswers = current.answers.map(normalizeText);

    if (validAnswers.includes(value)) {
      showCorrect();
    } else {
      showWrong();
    }
  }

  checkBtn.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });

  answerInput.focus();
}

function loadWinnerPage() {
  protectStep(6);

  const output = document.getElementById("finalNameOutput");
  const saveBtn = document.getElementById("saveNameBtn");
  const input = document.getElementById("winnerName");
  const info = document.getElementById("saveInfo");
  const restartBtn = document.getElementById("restartBtn");

  const savedName = localStorage.getItem("johnPorkWinnerName");
  if (savedName) {
    output.textContent = savedName;
  }

  function saveName() {
    const name = input.value.trim();

    if (name.length < 2) {
      info.className = "result bad";
      info.textContent = "❌ Bitte mindestens 2 Zeichen eingeben.";
      return;
    }

    localStorage.setItem("johnPorkWinnerName", name);
    output.textContent = name;
    info.className = "result good";
    info.textContent = "✅ Name gespeichert. Jetzt Screenshot machen.";
  }

  saveBtn.addEventListener("click", saveName);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveName();
    }
  });

  restartBtn.addEventListener("click", () => {
    startNewRun();
    window.location.href = "raetsel-1.html";
  });
}
