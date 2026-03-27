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
    answers: ["2", "zweiter", "platz 2", "2."]
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
    question: `Du hast nur ein Streichholz.
In einem dunklen Raum sind eine Kerze,
eine Lampe und ein Ofen.
Was zündest du zuerst an?
Gib 1 ein, wenn es das Streichholz ist.`,
    answers: ["1"]
  },
  {
    question: `Ein Vater und ein Sohn sind zusammen 36 Jahre alt.
Der Vater ist 30 Jahre älter als der Sohn.
Wie alt ist der Sohn?`,
    answers: ["3"]
  },
  {
    question: `2, 4, 8, 16, ?
Welche Zahl kommt als nächstes?`,
    answers: ["32"]
  },
  {
    question: `1, 1, 2, 3, 5, 8, ?
Welche Zahl fehlt?`,
    answers: ["13"]
  },
  {
    question: `Wie viele Tiere jeder Art nahm Moses mit auf die Arche?
Gib 0 ein, wenn keine.`,
    answers: ["0"]
  },
  {
    question: `Wenn heute Montag ist,
welcher Wochentag war gestern?
Gib 7 für Sonntag ein.`,
    answers: ["7", "sonntag"]
  },
  {
    question: `Eine Uhr zeigt genau 6 Uhr.
Wie groß ist der Winkel zwischen Stunden- und Minutenzeiger?`,
    answers: ["180"]
  }
];

const WRONG_MESSAGES = [
  "❌ Falsch... John Pork ist nicht beeindruckt.",
  "❌ Nope. Denk noch mal ganz langsam nach.",
  "❌ Zu schnell. Das war ein Trap.",
  "❌ Skill Issue detected 💀",
  "❌ Fast... aber das Pork-Orakel sagt nein.",
  "❌ Nicht korrekt. Dein Brainrot war zu stark.",
  "❌ Zugriff verweigert. Falsche Antwort."
];

const GLITCH_WORDS = [
  "ERROR 67",
  "PORK DETECTED",
  "ACCESS DENIED",
  "JOHN PORK WATCHING",
  "THINK AGAIN",
  "BRAIN NOT FOUND",
  "LEVEL CORRUPTED"
];

const QUIZ_SET_KEY = "johnPorkQuizSetV2";
const PROGRESS_KEY = "johnPorkSolvedStepV2";
const LIVES_KEY = "johnPorkLivesV2";

function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]+$/g, "");
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resetFullRun() {
  sessionStorage.removeItem(QUIZ_SET_KEY);
  sessionStorage.removeItem(PROGRESS_KEY);
  sessionStorage.removeItem(LIVES_KEY);
}

function ensureLives() {
  const raw = sessionStorage.getItem(LIVES_KEY);
  if (raw === null) {
    sessionStorage.setItem(LIVES_KEY, "3");
    return 3;
  }
  return Number(raw);
}

function setLives(value) {
  sessionStorage.setItem(LIVES_KEY, String(value));
}

function getLives() {
  return ensureLives();
}

function ensureQuizSet() {
  const existing = sessionStorage.getItem(QUIZ_SET_KEY);
  if (existing) return JSON.parse(existing);

  const selected = shuffleArray(QUESTION_POOL).slice(0, 5);
  sessionStorage.setItem(QUIZ_SET_KEY, JSON.stringify(selected));
  sessionStorage.setItem(PROGRESS_KEY, "0");
  sessionStorage.setItem(LIVES_KEY, "3");
  return selected;
}

function getSolvedStep() {
  return Number(sessionStorage.getItem(PROGRESS_KEY) || "0");
}

function markSolved(step) {
  sessionStorage.setItem(PROGRESS_KEY, String(step));
}

function canAccessStep(step) {
  if (step === 1) return true;
  return getSolvedStep() >= step - 1;
}

function protectStep(step) {
  if (!canAccessStep(step)) {
    window.location.href = "raetsel-1.html";
  }
}

function spawnGlitchWord() {
  const el = document.createElement("div");
  el.className = "glitch-float";
  el.textContent = GLITCH_WORDS[Math.floor(Math.random() * GLITCH_WORDS.length)];
  el.style.left = Math.random() * 82 + "vw";
  el.style.top = Math.random() * 82 + "vh";
  el.style.fontSize = 14 + Math.random() * 16 + "px";
  el.style.color = ["#fff", "#ff6666", "#ffff66", "#66ccff", "#ff99ff"][Math.floor(Math.random() * 5)];
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

function startAmbientEffects() {
  setInterval(spawnGlitchWord, 2200);
}

function spawnParticles() {
  const layer = document.getElementById("particles");
  if (!layer) return;

  setInterval(() => {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.bottom = "-10px";
    p.style.animationDuration = 4 + Math.random() * 4 + "s";
    p.style.opacity = 0.4 + Math.random() * 0.5;
    p.style.width = p.style.height = 4 + Math.random() * 8 + "px";
    layer.appendChild(p);
    setTimeout(() => p.remove(), 8000);
  }, 250);
}

function pulseFlash() {
  const flash = document.getElementById("overlayFlash");
  if (!flash) return;
  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
}

function updateLivesUi() {
  const el = document.getElementById("livesText");
  if (!el) return;
  const lives = getLives();
  el.textContent = "❤️ Leben: " + lives;
}

function applyShake(el) {
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
}

function applySuccess(el) {
  el.classList.remove("success-flash");
  void el.offsetWidth;
  el.classList.add("success-flash");
}

function loadStepPage(step) {
  if (step === 1) {
    resetFullRun();
  } else {
    protectStep(step);
  }

  const quizSet = ensureQuizSet();
  const data = quizSet[step - 1];

  const card = document.getElementById("quizCard");
  const questionTitle = document.getElementById("questionTitle");
  const questionText = document.getElementById("questionText");
  const progressLabel = document.getElementById("progressLabel");
  const progressFill = document.getElementById("progressFill");
  const answerInput = document.getElementById("answerInput");
  const resultText = document.getElementById("resultText");
  const checkBtn = document.getElementById("checkBtn");

  questionTitle.textContent = `Rätsel ${step} / 5`;
  questionText.textContent = data.question;
  progressLabel.textContent = `Fortschritt: ${step} von 5`;
  progressFill.style.width = `${step * 20}%`;
  updateLivesUi();

  function handleWrong() {
    const currentLives = getLives() - 1;
    setLives(currentLives);
    updateLivesUi();
    applyShake(card);
    pulseFlash();

    if (currentLives <= 0) {
      resultText.textContent = "💀 Keine Leben mehr...";
      setTimeout(() => {
        window.location.href = "gameover.html";
      }, 700);
      return;
    }

    resultText.textContent = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
    answerInput.select();
  }

  function handleCorrect() {
    resultText.textContent = "✅ RICHTIG! John Pork öffnet das nächste Portal...";
    resultText.className = "result good";
    applySuccess(card);
    markSolved(step);

    const nextUrl = step >= 5 ? "geschafft.html" : `raetsel-${step + 1}.html`;
    setTimeout(() => {
      window.location.href = nextUrl;
    }, 950);
  }

  function checkAnswer() {
    const value = normalizeText(answerInput.value);
    const validAnswers = data.answers.map(normalizeText);

    resultText.className = "result";

    if (validAnswers.includes(value)) {
      handleCorrect();
    } else {
      resultText.className = "result bad";
      handleWrong();
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

  updateLivesUi();

  const savedName = localStorage.getItem("johnPorkWinnerName");
  if (savedName) {
    output.textContent = savedName;
  }

  function saveName() {
    const name = input.value.trim();
    if (name.length < 2) {
      info.textContent = "❌ Bitte gib mindestens 2 Zeichen ein.";
      info.className = "result bad";
      return;
    }

    localStorage.setItem("johnPorkWinnerName", name);
    output.textContent = name;
    info.textContent = "✅ Name gespeichert. Jetzt Screenshot machen.";
    info.className = "result good";
    pulseFlash();
  }

  saveBtn.addEventListener("click", saveName);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveName();
  });

  restartBtn.addEventListener("click", () => {
    resetFullRun();
    window.location.href = "raetsel-1.html";
  });
}

function loadGameOverPage() {
  const restartBtn = document.getElementById("restartBtn");
  const homeBtn = document.getElementById("homeBtn");

  restartBtn.addEventListener("click", () => {
    resetFullRun();
    window.location.href = "raetsel-1.html";
  });

  homeBtn.addEventListener("click", () => {
    resetFullRun();
    window.location.href = "index.html";
  });
}
