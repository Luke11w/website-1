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
In welchem Land werden die Überlebenden begraben?`,
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
Gib die Antwort als Zahl ein.`,
    answers: ["0"]
  },
  {
    question: `Du hast nur ein Streichholz.
In einem dunklen Raum sind eine Kerze,
eine Lampe und ein Ofen.
Was zündest du zuerst an?
Gib die Antwort als Zahl ein.`,
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
  }
];

const WRONG_MESSAGES = [
  "❌ Falsch... John Pork lacht dich aus.",
  "❌ Nope. Denk langsamer nach.",
  "❌ Zu logisch gedacht 😈",
  "❌ Skill Issue detected 💀",
  "❌ Fast... aber John Pork sagt nein.",
  "❌ Diese Antwort wurde vom Pork-Rat abgelehnt."
];

const GLITCH_MESSAGES = [
  "ERROR 67",
  "PORK DETECTED",
  "BRAIN NOT FOUND",
  "ACCESS DENIED",
  "THINK AGAIN",
  "JOHN PORK WATCHING"
];

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

function ensureQuizSet() {
  const existing = sessionStorage.getItem("johnPorkQuizSet");
  if (existing) return JSON.parse(existing);

  const selected = shuffleArray(QUESTION_POOL).slice(0, 5);
  sessionStorage.setItem("johnPorkQuizSet", JSON.stringify(selected));
  return selected;
}

function resetQuizSet() {
  sessionStorage.removeItem("johnPorkQuizSet");
  sessionStorage.removeItem("johnPorkSolvedStep");
}

function markSolved(step) {
  sessionStorage.setItem("johnPorkSolvedStep", String(step));
}

function canAccessStep(step) {
  if (step === 1) return true;
  const solved = Number(sessionStorage.getItem("johnPorkSolvedStep") || "0");
  return solved >= step - 1;
}

function protectStep(step) {
  if (!canAccessStep(step)) {
    window.location.href = "raetsel-1.html";
  }
}

function createGlitchText() {
  const el = document.createElement("div");
  el.className = "glitch-text";
  el.textContent = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)];
  el.style.left = Math.random() * 80 + "vw";
  el.style.top = Math.random() * 80 + "vh";
  el.style.fontSize = 14 + Math.random() * 18 + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function startAmbientEffects() {
  setInterval(createGlitchText, 2200);
}

function loadStep(step) {
  protectStep(step);
  const quizSet = ensureQuizSet();
  const data = quizSet[step - 1];

  const questionTitle = document.getElementById("questionTitle");
  const questionText = document.getElementById("questionText");
  const progressLabel = document.getElementById("progressLabel");
  const progressFill = document.getElementById("progressFill");
  const answerInput = document.getElementById("answerInput");
  const resultText = document.getElementById("resultText");
  const checkBtn = document.getElementById("checkBtn");
  const quizBox = document.getElementById("quizBox");

  questionTitle.textContent = `Rätsel ${step} / 5`;
  questionText.textContent = data.question;
  progressLabel.textContent = `Fortschritt: ${step} von 5`;
  progressFill.style.width = `${step * 20}%`;

  function shakeQuiz() {
    quizBox.classList.remove("shake");
    void quizBox.offsetWidth;
    quizBox.classList.add("shake");
  }

  function okFlash() {
    quizBox.classList.remove("flash-ok");
    void quizBox.offsetWidth;
    quizBox.classList.add("flash-ok");
  }

  function handleCheck() {
    const value = normalizeText(answerInput.value);
    const valid = data.answers.map(normalizeText);

    if (valid.includes(value)) {
      resultText.textContent = "✅ RICHTIG! John Pork lässt dich weiter...";
      okFlash();
      markSolved(step);

      const nextUrl = step >= 5 ? "geschafft.html" : `raetsel-${step + 1}.html`;
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 900);
    } else {
      resultText.textContent = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
      shakeQuiz();
      answerInput.select();
    }
  }

  checkBtn.addEventListener("click", handleCheck);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCheck();
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

  const saved = localStorage.getItem("johnPorkWinnerName");
  if (saved) {
    output.textContent = saved;
  }

  function saveName() {
    const name = input.value.trim();
    if (name.length < 2) {
      info.textContent = "❌ Bitte gib mindestens 2 Zeichen ein.";
      return;
    }

    localStorage.setItem("johnPorkWinnerName", name);
    output.textContent = name;
    info.textContent = "✅ Name gespeichert. Jetzt Screenshot machen.";
  }

  saveBtn.addEventListener("click", saveName);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveName();
    }
  });

  restartBtn.addEventListener("click", () => {
    resetQuizSet();
    window.location.href = "raetsel-1.html";
  });
}
