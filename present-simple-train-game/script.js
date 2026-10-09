const sourceZone = document.getElementById("source-zone");
const dropZone = document.getElementById("drop-zone");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const endModal = document.getElementById("end-game-modal");
const counter = document.getElementById("level-counter");
const scoreDisplay = document.getElementById("final-score");
const playerNameInput = document.getElementById("player-name");
const saveResultButton = document.getElementById("save-result-btn");
const saveStatus = document.getElementById("save-status");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardStatus = document.getElementById("leaderboard-status");
const clearLeaderboardButton = document.getElementById("clear-leaderboard-btn");
const GAME_LENGTH = 7;
const LEADERBOARD_KEY = "presentSimpleTrainLeaderboard";
const questionBank = [
  ["Do", "you", "like", "cats", "?"],
  ["Does", "he", "read", "books", "?"],
  ["Do", "they", "play", "games", "?"],
  ["Does", "she", "sing", "well", "?"],
  ["Do", "we", "go", "home", "?"],
  ["Do", "I", "see", "a", "car", "?"],
  ["Does", "it", "work", "?"],
  ["Do", "you", "watch", "TV", "?"],
  ["Does", "your", "brother", "play", "football", "?"],
  ["Do", "the", "children", "like", "milk", "?"],
  ["Does", "Anna", "speak", "English", "?"],
  ["Do", "birds", "sing", "in", "the", "morning", "?"],
  ["Does", "your", "father", "drive", "to", "work", "?"],
  ["Do", "we", "need", "any", "help", "?"],
  ["Does", "Tom", "get", "up", "early", "?"],
  ["Do", "they", "live", "near", "school", "?"],
  ["Does", "the", "bus", "stop", "here", "?"],
  ["Do", "you", "drink", "coffee", "?"],
  ["Does", "your", "cat", "sleep", "outside", "?"],
  ["Do", "students", "wear", "uniforms", "?"],
  ["Does", "Mia", "take", "the", "train", "?"],
  ["Do", "your", "friends", "visit", "you", "often", "?"],
  ["Does", "this", "shop", "open", "on", "Sunday", "?"],
  ["Do", "you", "walk", "to", "school", "?"],
  ["Does", "he", "wash", "the", "dishes", "?"],
  ["Do", "they", "have", "a", "garden", "?"],
  ["Does", "your", "mother", "cook", "dinner", "?"],
  ["Do", "we", "start", "at", "nine", "?"],
  ["Does", "the", "dog", "chase", "the", "ball", "?"],
  ["Do", "you", "know", "that", "song", "?"],
  ["Does", "Jack", "fix", "bikes", "?"],
  ["Do", "these", "shoes", "fit", "you", "?"],
  ["Does", "your", "sister", "draw", "well", "?"],
  ["Do", "the", "shops", "close", "early", "?"],
  ["Does", "it", "rain", "here", "in", "winter", "?"],
  ["Do", "you", "read", "before", "bed", "?"],
  ["Does", "Peter", "teach", "science", "?"],
  ["Do", "we", "take", "this", "road", "?"],
  ["Does", "the", "movie", "begin", "at", "six", "?"],
  ["Do", "your", "parents", "travel", "often", "?"],
  ["Does", "Emma", "help", "her", "brother", "?"],
  ["Do", "you", "make", "your", "bed", "every", "day", "?"],
  ["Does", "this", "phone", "work", "well", "?"],
  ["Do", "they", "clean", "the", "classroom", "?"],
  ["Does", "your", "teacher", "give", "homework", "?"],
  ["Do", "we", "have", "enough", "time", "?"],
  ["Does", "the", "baby", "cry", "at", "night", "?"],
  ["Do", "you", "listen", "to", "music", "while", "studying", "?"],
  ["Does", "your", "cousin", "play", "the", "guitar", "?"],
  ["Do", "people", "use", "this", "website", "often", "?"],
];
let gameQuestions = [];
let level = 0;
let answer = [];
let correctAnswers = 0;

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function startGame() {
  gameQuestions = shuffle(questionBank).slice(0, GAME_LENGTH);
  level = 0;
  correctAnswers = 0;
  endModal.classList.add("hidden");
  render();
}

function render() {
  counter.textContent = `Вопрос ${Math.min(level + 1, GAME_LENGTH)} из ${GAME_LENGTH}`;
  dropZone.querySelectorAll(".wagon,.caboose").forEach((el) => el.remove());
  sourceZone.replaceChildren();
  feedback.textContent = "";
  nextBtn.classList.add("hidden");
  if (level >= gameQuestions.length) {
    counter.textContent = `Все ${GAME_LENGTH} вопросов пройдены`;
    scoreDisplay.textContent = `Правильных ответов: ${correctAnswers} из ${GAME_LENGTH}`;
    saveStatus.textContent = "";
    saveResultButton.disabled = false;
    saveResultButton.classList.remove("hidden");
    playerNameInput.value =
      localStorage.getItem("presentSimpleTrainPlayer") || "";
    endModal.classList.remove("hidden");
    return;
  }
  answer = gameQuestions[level];
  shuffle(answer).forEach((word) => {
    const wagon = document.createElement("button");
    wagon.className = "wagon";
    wagon.type = "button";
    wagon.textContent = word;
    wagon.draggable = true;
    wagon.addEventListener("dragstart", (event) =>
      event.dataTransfer.setData(
        "text/plain",
        String([...sourceZone.children].indexOf(wagon)),
      ),
    );
    wagon.addEventListener("click", () => place(wagon));
    sourceZone.append(wagon);
  });
}

function place(wagon) {
  if (wagon.parentElement !== sourceZone) return;
  dropZone.append(wagon);
  check();
}

function check() {
  const placed = [...dropZone.querySelectorAll(".wagon")];
  if (placed.length !== answer.length) return;
  const correct = placed.every((el, index) => el.textContent === answer[index]);
  feedback.textContent = correct
    ? "Правильно! Отличная работа!"
    : "Порядок неверный. Переставь вагоны и попробуй снова.";
  feedback.className = correct ? "feedback-correct" : "feedback-wrong";
  if (correct) {
    correctAnswers++;
    placed.forEach((el) => (el.draggable = false));
    const caboose = document.createElement("span");
    caboose.className = "caboose";
    caboose.setAttribute("aria-label", "Последний вагон");
    dropZone.append(caboose);
    nextBtn.classList.remove("hidden");
  }
}

dropZone.addEventListener("dragover", (event) => event.preventDefault());
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  const sourceIndex = Number(event.dataTransfer.getData("text/plain"));
  const wagon = sourceZone.children[sourceIndex];
  if (wagon?.classList.contains("wagon")) place(wagon);
});
nextBtn.addEventListener("click", () => {
  level++;
  render();
});
restartBtn.addEventListener("click", startGame);

function getLeaderboard() {
  try {
    const entries = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  const entries = getLeaderboard()
    .sort((a, b) => b.score - a.score || a.date - b.date)
    .slice(0, 10);
  leaderboardList.replaceChildren();
  leaderboardStatus.textContent = entries.length
    ? "Топ-10 результатов на этом устройстве"
    : "Пока нет результатов";
  entries.forEach((entry, index) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const score = document.createElement("strong");
    name.textContent = `${index + 1}. ${entry.name}`;
    score.textContent = `${entry.score}/${GAME_LENGTH}`;
    item.append(name, score);
    leaderboardList.append(item);
  });
}

saveResultButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim().replace(/\\s+/g, " ").slice(0, 20);
  if (!name) {
    saveStatus.textContent = "Введи имя, чтобы сохранить результат.";
    playerNameInput.focus();
    return;
  }
  try {
    const entries = getLeaderboard();
    entries.push({ name, score: correctAnswers, date: Date.now() });
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    localStorage.setItem("presentSimpleTrainPlayer", name);
    saveStatus.textContent = "Результат сохранён в таблице лидеров.";
    saveResultButton.disabled = true;
    saveResultButton.classList.add("hidden");
    renderLeaderboard();
  } catch {
    saveStatus.textContent = "Не удалось сохранить результат в этом браузере.";
  }
});

clearLeaderboardButton.addEventListener("click", () => {
  if (!confirm("Удалить таблицу лидеров на этом устройстве?")) return;
  localStorage.removeItem(LEADERBOARD_KEY);
  renderLeaderboard();
});
window.addEventListener("storage", renderLeaderboard);
renderLeaderboard();
startGame();
