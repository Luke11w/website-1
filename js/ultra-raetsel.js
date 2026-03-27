const wrongMessages = [
  "❌ Falsch... John Pork hat aufgelegt.",
  "❌ Nope. Dein Brainrot-Level reicht noch nicht.",
  "❌ Falsch. Der Pork-Rat ist enttäuscht.",
  "❌ Leider nein. Versuch nochmal, du Legende.",
  "❌ Daneben. John Pork lacht gerade sehr laut.",
  "❌ Nicht korrekt. Du wurdest kurz aus dem Pork-Universum gebannt."
];

function randomWrongMessage() {
  return wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
}

function checkCode(correctCode, nextPage, messageId, inputId) {
  const input = document.getElementById(inputId);
  const message = document.getElementById(messageId);

  if (!input || !message) return;

  const value = input.value.trim();

  if (value === correctCode) {
    message.innerHTML = "✅ RICHTIG! John Pork lässt dich weiter...";
    setTimeout(() => {
      window.location.href = nextPage;
    }, 1100);
  } else {
    message.innerHTML = randomWrongMessage();
    input.value = "";
    input.focus();
  }
}

function saveWinnerName() {
  const input = document.getElementById("winnerName");
  const output = document.getElementById("finalNameOutput");
  const info = document.getElementById("saveInfo");

  if (!input || !output || !info) return;

  const name = input.value.trim();

  if (name.length < 2) {
    info.innerHTML = "❌ Bitte gib mindestens 2 Zeichen ein.";
    return;
  }

  localStorage.setItem("johnPorkWinnerName", name);
  output.textContent = name;
  info.innerHTML = "✅ Name gespeichert. Jetzt Screenshot machen.";
}

function loadWinnerName() {
  const output = document.getElementById("finalNameOutput");
  if (!output) return;

  const saved = localStorage.getItem("johnPorkWinnerName");
  if (saved) output.textContent = saved;
}

function pressEnterSubmit(inputId, correctCode, nextPage, messageId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkCode(correctCode, nextPage, messageId, inputId);
    }
  });
}

function pressEnterNameSave() {
  const input = document.getElementById("winnerName");
  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveWinnerName();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadWinnerName();
  pressEnterNameSave();
});
