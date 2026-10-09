// --- Элементы DOM ---

const numbersContainer = document.getElementById("numbers-container");
const wordsContainer = document.getElementById("words-container");
const nextLevelButton = document.getElementById("next-level-button");
const restartButton = document.getElementById("restart-button");
const messageText = document.getElementById("message-text");
const confettiContainer = document.getElementById("confetti-container");
const timerElement = document.getElementById("timer");
const freezeOverlay = document.getElementById("freeze-overlay");
const resultPanel = document.getElementById("result-panel");
const resultSummary = document.getElementById("result-summary");
const playerNameInput = document.getElementById("player-name");
const submitScoreButton = document.getElementById("submit-score");
const submitStatus = document.getElementById("submit-status");
const leaderboardBody = document.getElementById("leaderboard-body");
const leaderboardStatus = document.getElementById("leaderboard-status");
const supabaseConfig = window.NUMBERS_SUPABASE_CONFIG || {};
const supabaseReady =
  supabaseConfig.url &&
  !supabaseConfig.url.includes("YOUR-PROJECT") &&
  supabaseConfig.anonKey &&
  !supabaseConfig.anonKey.includes("YOUR_SUPABASE");
const leaderboardUrl = supabaseReady
  ? `${new URL(supabaseConfig.url).origin}/rest/v1/numbers_leaderboard`
  : null;

// --- Состояние игры ---
let currentLevel = 1;
let draggedItem = null;
let correctMatches = 0;
let timerInterval = null;
let timeLeft = 120;
let isFrozen = false;
let selectedWord = null; // Для тач-устройств (выбор кликом)
let selectedNumber = null;
let mistakes = 0;
let runStartedAt = 0;
let finalResult = null;
let resultSubmitted = false;

const numbersData = {
  1: {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
  },
  2: {
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
  },
};

// --- Аудио ---
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported");
    }
  }
}

function playSound(freq, type = "sine", duration = 0.2, volume = 0.05) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain).connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration,
  );
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

function playFreezeSound() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  playSound(1200, "sine", 0.3, 0.05);

  const bufferSize = audioCtx.sampleRate * 0.2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.05, now);
  noiseGain.gain.linearRampToValueAtTime(0, now + 0.2);
  noiseSource.connect(noiseGain).connect(audioCtx.destination);
  noiseSource.start(now);
}

// --- Логика заморозки ---
function freezeGame(duration) {
  playFreezeSound();
  isFrozen = true;
  freezeOverlay.classList.remove("hidden");

  setTimeout(() => {
    isFrozen = false;
    freezeOverlay.classList.add("hidden");
  }, duration);
}

// --- Вспомогательные функции ---
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function showMessage(text, colorClass) {
  messageText.textContent = text;
  messageText.className = `text-xl sm:text-2xl font-semibold transition-opacity duration-300 ${colorClass} opacity-100`;
  setTimeout(() => messageText.classList.remove("opacity-100"), 2000);
}

function launchConfetti() {
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("div");
    c.classList.add("confetti");
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    c.style.left = `${Math.random() * 100}vw`;
    c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = `${Math.random() * 2}s`;
    c.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
    confettiContainer.appendChild(c);
  }
  setTimeout(() => (confettiContainer.innerHTML = ""), 5000);
}

function formatElapsedTime(seconds) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function calculateScore(seconds, errorCount) {
  return Math.max(0, 1000 - seconds * 5 - errorCount * 150);
}

async function loadLeaderboard() {
  if (!leaderboardUrl) {
    leaderboardStatus.textContent = "Рейтинг не настроен";
    return;
  }
  leaderboardStatus.textContent = "Загрузка...";
  try {
    const response = await fetch(
      `${leaderboardUrl}?select=player_name,score,elapsed_seconds,mistakes&order=score.desc,elapsed_seconds.asc&limit=10`,
      {
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
      },
    );
    if (!response.ok) throw new Error("Не удалось загрузить рейтинг");
    const rows = await response.json();
    leaderboardBody.replaceChildren();
    rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      [
        String(index + 1),
        row.player_name,
        String(row.score),
        formatElapsedTime(row.elapsed_seconds),
        String(row.mistakes),
      ].forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      leaderboardBody.appendChild(tr);
    });
    leaderboardStatus.textContent = rows.length ? "" : "Пока нет результатов";
  } catch (error) {
    leaderboardStatus.textContent = "Не удалось загрузить рейтинг";
    console.error(error);
  }
}

async function submitResult() {
  if (!finalResult || resultSubmitted) return;
  const playerName = playerNameInput.value
    .trim()
    .replaceAll("  ", " ")
    .slice(0, 20);
  if (!playerName) {
    submitStatus.textContent = "Введите имя";
    playerNameInput.focus();
    return;
  }
  if (!leaderboardUrl) {
    submitStatus.textContent = "Рейтинг не настроен";
    return;
  }
  submitScoreButton.disabled = true;
  submitStatus.textContent = "Отправка...";
  try {
    const response = await fetch(leaderboardUrl, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        player_name: playerName,
        score: finalResult.score,
        elapsed_seconds: finalResult.seconds,
        mistakes: finalResult.mistakes,
      }),
    });
    if (!response.ok) throw new Error("Не удалось отправить результат");
    resultSubmitted = true;
    submitStatus.textContent = "Результат добавлен";
    submitScoreButton.classList.add("hidden");
    await loadLeaderboard();
  } catch (error) {
    submitScoreButton.disabled = false;
    submitStatus.textContent = "Ошибка отправки. Попробуйте ещё раз.";
    console.error(error);
  }
}

function finishGame() {
  clearInterval(timerInterval);
  const seconds = Math.min(
    240,
    Math.max(1, Math.floor((Date.now() - runStartedAt) / 1000)),
  );
  finalResult = { seconds, mistakes, score: calculateScore(seconds, mistakes) };
  resultSubmitted = false;
  resultPanel.classList.remove("hidden");
  resultSummary.textContent = `${finalResult.score} очков · ${formatElapsedTime(seconds)} · ошибок: ${mistakes}`;
  submitScoreButton.disabled = !leaderboardUrl;
  submitScoreButton.classList.remove("hidden");
  submitStatus.textContent = leaderboardUrl ? "" : "Сначала настройте Supabase";
  loadLeaderboard();
}

submitScoreButton.addEventListener("click", submitResult);

function stopGame(message, color) {
  clearInterval(timerInterval);
  showMessage(message, color);
  document.querySelectorAll(".word-card").forEach((card) => {
    card.draggable = false;
    card.style.cursor = "default";
    if (!card.classList.contains("correct-match")) {
      card.style.opacity = "0.5";
    }
  });
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerElement.textContent = `${minutes}:${seconds}`;
  timerElement.classList.remove(
    "bg-yellow-400",
    "text-yellow-800",
    "bg-red-500",
    "text-white",
    "timer-shake",
  );

  if (timeLeft <= 10) {
    timerElement.classList.add("bg-red-500", "text-white", "timer-shake");
  } else if (timeLeft <= 30) {
    timerElement.classList.add("bg-red-500", "text-white");
  } else if (timeLeft <= 59) {
    timerElement.classList.add("bg-yellow-400", "text-yellow-800");
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 120;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (isFrozen) return; // Таймер тоже может "замерзать" или нет, по желанию. Оставим активным для сложности.
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopGame("Время вышло!", "text-red-500");
    }
  }, 1000);
}

// --- Обработка клика/тапа (альтернатива drag-n-drop для мобилок) ---
function clearSelection() {
  selectedWord?.classList.remove("ring-4", "ring-blue-400");
  selectedNumber?.classList.remove("ring-4", "ring-blue-400");
  selectedWord = null;
  selectedNumber = null;
}

function handleWordSelection(card) {
  if (isFrozen || card.classList.contains("correct-match")) return;
  if (selectedNumber) {
    checkMatch(selectedNumber, card);
    return;
  }
  if (selectedWord === card) {
    clearSelection();
    return;
  }
  clearSelection();
  selectedWord = card;
  selectedWord.classList.add("ring-4", "ring-blue-400");
  playSound(440);
}

function handleNumberSelection(numCard) {
  if (isFrozen || numCard.classList.contains("correct-match")) return;
  if (selectedWord) {
    checkMatch(numCard, selectedWord);
    return;
  }
  if (selectedNumber === numCard) {
    clearSelection();
    return;
  }
  clearSelection();
  selectedNumber = numCard;
  selectedNumber.classList.add("ring-4", "ring-blue-400");
  playSound(440);
}

function checkMatch(numCard, wordCard) {
  const numberValue = numCard.dataset.number;
  const wordValue = wordCard.dataset.word;

  if (numbersData[currentLevel][numberValue] === wordValue) {
    // Успех
    speak(wordValue);
    numCard.classList.add("correct-match");
    wordCard.classList.add("correct-match");
    clearSelection();
    wordCard.draggable = false;
    wordCard.style.visibility = "hidden";
    showMessage("Правильно!", "text-green-500");
    playSound(660, "sine", 0.2, 0.1);
    correctMatches++;
    clearSelection();

    if (correctMatches === Object.keys(numbersData[currentLevel]).length) {
      clearInterval(timerInterval);
      launchConfetti();
      if (currentLevel === 1) {
        showMessage("Уровень 1 пройден!", "text-blue-500");
        nextLevelButton.classList.remove("hidden");
      } else {
        showMessage("Игра пройдена!", "text-purple-500");
        finishGame();
      }
    }
  } else {
    // Ошибка
    mistakes++;
    numCard.classList.add("incorrect-match-animation");
    showMessage("Заморозка!", "text-blue-600");
    clearSelection();
    freezeGame(3000);
    setTimeout(
      () => numCard.classList.remove("incorrect-match-animation"),
      500,
    );
  }
}

// --- Инициализация уровня ---
function setupLevel() {
  initAudio();
  numbersContainer.innerHTML = "";
  wordsContainer.innerHTML = "";
  correctMatches = 0;
  isFrozen = false;
  selectedWord = null;
  selectedNumber = null;
  freezeOverlay.classList.add("hidden");
  nextLevelButton.classList.add("hidden");
  if (currentLevel === 1) {
    runStartedAt = Date.now();
    mistakes = 0;
    finalResult = null;
    resultSubmitted = false;
    resultPanel.classList.add("hidden");
  }

  const currentNumbers = numbersData[currentLevel];
  const numberKeys = Object.keys(currentNumbers);
  const wordValues = shuffleArray(Object.values(currentNumbers));

  // Создаем карточки чисел
  numberKeys.forEach((number) => {
    const card = document.createElement("div");
    card.dataset.number = number;
    card.textContent = number;
    card.className = "number-card bg-blue-100 text-blue-800";

    // Drag events
    card.addEventListener("dragover", (e) => !isFrozen && e.preventDefault());
    card.addEventListener("dragenter", (e) => {
      if (!isFrozen && !card.classList.contains("correct-match"))
        card.classList.add("drop-target");
    });
    card.addEventListener("dragleave", () =>
      card.classList.remove("drop-target"),
    );
    card.addEventListener("drop", (e) => {
      e.preventDefault();
      card.classList.remove("drop-target");
      if (draggedItem) checkMatch(card, draggedItem);
    });

    // Click/Touch events
    card.addEventListener("click", () => handleNumberSelection(card));

    numbersContainer.appendChild(card);
  });

  // Создаем карточки слов
  wordValues.forEach((word) => {
    const card = document.createElement("div");
    card.dataset.word = word;
    card.textContent = word;
    card.draggable = true;
    card.className = "word-card bg-green-100 text-green-800";

    // Drag events
    card.addEventListener("dragstart", (e) => {
      if (isFrozen) {
        e.preventDefault();
        return;
      }
      draggedItem = card;
      setTimeout(() => card.classList.add("dragging"), 0);
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      draggedItem = null;
    });

    // Click/Touch events
    card.addEventListener("click", () => handleWordSelection(card));

    wordsContainer.appendChild(card);
  });

  startTimer();
}

// --- Кнопки ---
restartButton.addEventListener("click", () => {
  if (
    correctMatches === Object.keys(numbersData[currentLevel]).length &&
    currentLevel === 2
  ) {
    currentLevel = 1;
  }
  setupLevel();
});

nextLevelButton.addEventListener("click", () => {
  currentLevel = 2;
  setupLevel();
});

// Запуск
document.body.addEventListener("touchstart", initAudio, { once: true });
document.body.addEventListener("click", initAudio, { once: true });
window.onload = setupLevel;
