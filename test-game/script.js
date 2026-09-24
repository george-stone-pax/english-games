// ==========================================
// БАЗА ВОПРОСОВ (6 Уровней, по 5 вопросов с разными механиками)
// Механики: 'choice' (выбор), 'builder' (сборка), 'input' (ввод текста)
// ==========================================
const questData = [
  {
    level: "A0",
    hallName: "Зал 0: Врата Пробуждения (A0)",
    themeClass: "theme-a0",
    musicId: "bg-music-a0",
    questions: [
      {
        type: "choice",
        context: "Выберите правильное приветствие.",
        text: "How _____ you?",
        answers: ["am", "is", "are", "be"],
        correct: 2,
      },
      {
        type: "input",
        context: "Напишите цифру прописью по-английски.",
        text: "Цифра: 3",
        correct: "three",
      },
      {
        type: "choice",
        context: "Выберите правильный цвет неба.",
        text: "The sky is _____.",
        answers: ["blue", "red", "green", "yellow"],
        correct: 0,
      },
      {
        type: "builder",
        context: "Соберите простейшее предложение.",
        text: "Соберите фразу: 'Я кот'",
        words: ["I", "a", "am", "cat"],
        correctOrder: ["I", "am", "a", "cat"],
      },
      {
        type: "choice",
        context: "Укажите местоимение для девочки.",
        text: "_____ is a girl.",
        answers: ["He", "She", "It", "They"],
        correct: 1,
      },
    ],
  },
  {
    level: "A1",
    hallName: "Зал 1: Вход (A1)",
    themeClass: "theme-a1",
    musicId: "bg-music-a1",
    questions: [
      {
        type: "choice",
        context: "Выберите верную форму глагола (Present Simple).",
        text: "She _____ English every day.",
        answers: ["study", "studies", "studying", "is study"],
        correct: 1,
      },
      {
        type: "builder",
        context: "Соберите вопрос.",
        text: "Соберите фразу: 'Где ты живешь?'",
        words: ["where", "do", "you", "live", "?"],
        correctOrder: ["where", "do", "you", "live", "?"],
      },
      {
        type: "input",
        context: "Заполните пропуск (артикль).",
        text: "I have _____ apple.",
        correct: "an",
      },
      {
        type: "choice",
        context: "Укажите правильный день недели.",
        text: "After Monday comes _____.",
        answers: ["Sunday", "Tuesday", "Friday", "Thursday"],
        correct: 1,
      },
      {
        type: "choice",
        context: "Выберите отрицательную форму.",
        text: "They _____ like coffee.",
        answers: ["don't", "doesn't", "isn't", "aren't"],
        correct: 0,
      },
    ],
  },
  {
    level: "A2",
    hallName: "Зал 2: Коридор Времени (A2)",
    themeClass: "theme-a2",
    musicId: "bg-music-a2",
    questions: [
      {
        type: "choice",
        context: "Выберите время Past Simple.",
        text: "I _____ this explorer two years ago.",
        answers: ["have met", "met", "meet", "was meeting"],
        correct: 1,
      },
      {
        type: "choice",
        context: "Выберите правильный предлог времени.",
        text: "We are meeting _____ Friday afternoon.",
        answers: ["in", "at", "on", "to"],
        correct: 2,
      },
      {
        type: "input",
        context: "Напишите сравнительную степень слова 'big'.",
        text: "Elephant is _____ than a dog.",
        correct: "bigger",
      },
      {
        type: "builder",
        context: "Соберите фразу о планах на будущее.",
        text: "Соберите фразу: 'Я собираюсь путешествовать'",
        words: ["I", "am", "going", "to", "travel"],
        correctOrder: ["I", "am", "going", "to", "travel"],
      },
      {
        type: "choice",
        context: "Выберите модальный глагол разрешения.",
        text: "_____ I use your phone, please?",
        answers: ["Must", "Can", "Should", "Will"],
        correct: 1,
      },
    ],
  },
  {
    level: "B1",
    hallName: "Зал 3: Лабиринт Тумана (B1)",
    themeClass: "theme-b1",
    musicId: "bg-music-b1",
    questions: [
      {
        type: "choice",
        context: "Условные предложения (Second Conditional).",
        text: "If I _____ more time, I would travel.",
        answers: ["have", "had", "will have", "would have"],
        correct: 1,
      },
      {
        type: "choice",
        context: "Фразовый глагол для освещения.",
        text: "It's getting dark. Please _____ the lamp.",
        answers: ["turn on", "look after", "give up", "put off"],
        correct: 0,
      },
      {
        type: "input",
        context:
          "Напишите причастие прошедшего времени (3-ю форму) для глагола 'go'.",
        text: "He has _____ to London.",
        correct: "gone",
      },
      {
        type: "builder",
        context: "Соберите пассивную конструкцию.",
        text: "Соберите фразу: 'Письмо было отправлено'",
        words: ["The", "letter", "was", "sent"],
        correctOrder: ["The", "letter", "was", "sent"],
      },
      {
        type: "choice",
        context: "Косвенная речь.",
        text: "He said that he _____ busy.",
        answers: ["is", "was", "has been", "will be"],
        correct: 1,
      },
    ],
  },
  {
    level: "B2",
    hallName: "Зал 4: Зал Алхимика (B2)",
    themeClass: "theme-b2",
    musicId: "bg-music-b2",
    questions: [
      {
        type: "choice",
        context: "Модальные глаголы в прошедшем времени с догадкой.",
        text: "The manuscript is missing. It _____ stolen during the night.",
        answers: ["must be", "must have been", "should be", "was to be"],
        correct: 1,
      },
      {
        type: "choice",
        context: "Инверсия с отрицательными наречиями.",
        text: "Hardly _____ inside the room when the door slammed shut.",
        answers: ["I had stepped", "had I stepped", "I stepped", "did I step"],
        correct: 1,
      },
      {
        type: "input",
        context: "Подберите синоним к слову 'tired' (на букву e).",
        text: "It means very tired:",
        correct: "exhausted", // или exhausted / exhausted в общем зачете
      },
      {
        type: "builder",
        context: "Соберите сложную структуру с герундием.",
        text: "Соберите фразу: 'Я с нетерпением жду встречи'",
        words: ["I", "look", "forward", "to", "meeting", "you"],
        correctOrder: ["I", "look", "forward", "to", "meeting", "you"],
      },
      {
        type: "choice",
        context: "Смешанные условные (Mixed Conditionals).",
        text: "If I had listened to you, I _____ in trouble now.",
        answers: ["am not", "would not be", "will not be", "had not been"],
        correct: 1,
      },
    ],
  },
  {
    level: "C1",
    hallName: "Зал 5: Вершина Мудрости (C1)",
    themeClass: "theme-c1",
    musicId: "bg-music-c1",
    questions: [
      {
        type: "choice",
        context: "Продвинутая лексика и нюансы.",
        text: "The findings were based on _____ evidence rather than facts.",
        answers: ["Anecdotal", "Unanimous", "Empirical", "Substantial"],
        correct: 0,
      },
      {
        type: "choice",
        context: "Subjunctive Mood / Сослагательное наклонение.",
        text: "Were it not for your assistance, we _____ the code in time.",
        answers: [
          "will not crack",
          "would not have cracked",
          "didn't crack",
          "had not cracked",
        ],
        correct: 1,
      },
      {
        type: "input",
        context: "Вставьте подходящее слово (идиома/выражение).",
        text: "To cost an arm and a _____.",
        correct: "leg",
      },
      {
        type: "builder",
        context: "Соберите инверсионную конструкцию.",
        text: "Соберите фразу: 'Ни в коем случае не открывай дверь'",
        words: ["Under", "no", "circumstances", "should", "you", "open", "it"],
        correctOrder: [
          "Under",
          "no",
          "circumstances",
          "should",
          "you",
          "open",
          "it",
        ],
      },
      {
        type: "choice",
        context: "Сложные союзные конструкции.",
        text: "_____ the weather was terrible, we enjoyed the hike.",
        answers: ["Despite", "Although", "In spite of", "However"],
        correct: 1,
      },
    ],
  },
];

// ==========================================
// СОСТОЯНИЕ ИГРЫ
// ==========================================
let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let hp = 2; // 2 жизни = 1 право на ошибку
let xp = 0;
let timeLeft = 45;
let timerInterval;
let isMuted = false;
let currentActiveMusic = null;

// ==========================================
// DOM ЭЛЕМЕНТЫ
// ==========================================
const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  result: document.getElementById("result-screen"),
};

const ui = {
  hpContainer: document.getElementById("hp-container"),
  xpScore: document.getElementById("xp-score"),
  timerDisplay: document.getElementById("timer-display"),
  currentHall: document.getElementById("current-hall"),
  questionContext: document.getElementById("question-context"),
  questionText: document.getElementById("question-text"),
  interactiveArea: document.getElementById("interactive-area"),
  feedbackOverlay: document.getElementById("feedback-overlay"),
  feedbackText: document.getElementById("feedback-text"),
  feedbackBonus: document.getElementById("feedback-bonus"),
  finalXp: document.getElementById("final-xp"),
  finalLevel: document.getElementById("final-level"),
  analysisList: document.getElementById("analysis-list"),
};

const audio = {
  correct: document.getElementById("sound-correct"),
  wrong: document.getElementById("sound-wrong"),
  menu: document.getElementById("bg-music-menu"),
};

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
document
  .getElementById("fullscreen-btn")
  .addEventListener("click", toggleFullscreen);
document.getElementById("mute-btn").addEventListener("click", toggleMute);
document
  .getElementById("volume-slider")
  .addEventListener("input", updateVolume);

updateVolume();
playMusic(audio.menu);

// ==========================================
// МУЗЫКАЛЬНЫЙ МЕНЕДЖЕР
// ==========================================
function playMusic(newMusicElement) {
  if (currentActiveMusic && currentActiveMusic !== newMusicElement) {
    currentActiveMusic.pause();
    currentActiveMusic.currentTime = 0;
  }
  currentActiveMusic = newMusicElement;
  if (!isMuted && currentActiveMusic) {
    currentActiveMusic
      .play()
      .catch((e) => console.log("Автозапуск заблокирован"));
  }
}

// ==========================================
// ЛОГИКА ЭКРАНОВ И ТЕМ
// ==========================================
function setTheme(themeClassName) {
  document.body.className = ""; // Сбрасываем все классы тем
  if (themeClassName) {
    document.body.classList.add(themeClassName);
  } else {
    document.body.classList.add("theme-menu");
  }
}

function switchScreen(screenName) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
    setTimeout(() => screen.classList.add("hidden"), 600);
  });

  setTimeout(() => {
    screens[screenName].classList.remove("hidden");
    setTimeout(() => screens[screenName].classList.add("active"), 50);
  }, 600);
}

function startGame() {
  currentLevelIndex = 0;
  currentQuestionIndex = 0;
  hp = 2;
  xp = 0;

  updateHPUI();
  ui.xpScore.textContent = xp;

  const levelData = questData[currentLevelIndex];
  setTheme(levelData.themeClass);
  playMusic(document.getElementById(levelData.musicId));

  switchScreen("game");
  setTimeout(loadQuestion, 650);
}

// ==========================================
// ЗАГРУЗКА И РЕНДЕРИНГ ВОПРОСОВ (5 МЕХАНИК)
// ==========================================
function loadQuestion() {
  clearInterval(timerInterval);
  const levelData = questData[currentLevelIndex];
  const question = levelData.questions[currentQuestionIndex];

  ui.currentHall.textContent = levelData.hallName;
  ui.questionContext.textContent = question.context;
  ui.questionText.textContent = question.text;
  ui.interactiveArea.innerHTML = "";

  // Рендер в зависимости от типа механики
  if (question.type === "choice") {
    renderChoiceMechanic(question);
  } else if (question.type === "builder") {
    renderBuilderMechanic(question);
  } else if (question.type === "input") {
    renderInputMechanic(question);
  }

  // Таймер 45 секунд
  timeLeft = 45;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(false, null); // Тайм-аут = ошибка
    }
  }, 1000);
}

// Механика 1: Выбор вариантов
function renderChoiceMechanic(question) {
  const grid = document.createElement("div");
  grid.className = "mechanic-grid";

  question.answers.forEach((ans, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = ans;
    btn.onclick = () => {
      const isCorrect = index === question.correct;
      handleAnswer(isCorrect, btn);
    };
    grid.appendChild(btn);
  });
  ui.interactiveArea.appendChild(grid);
}

// Механика 2: Сборка предложения из блоков
function renderBuilderMechanic(question) {
  const container = document.createElement("div");
  container.className = "mechanic-input";

  const dropZone = document.createElement("div");
  dropZone.className = "mechanic-builder";

  const wordsPool = document.createElement("div");
  wordsPool.className = "mechanic-builder";
  wordsPool.style.borderStyle = "solid";

  let currentSelectedWords = [];
  let availableWords = [...question.words].sort(() => Math.random() - 0.5);

  function updatePools() {
    dropZone.innerHTML = "";
    wordsPool.innerHTML = "";

    currentSelectedWords.forEach((word, idx) => {
      const wBtn = document.createElement("span");
      wBtn.className = "word-block";
      wBtn.textContent = word;
      wBtn.onclick = () => {
        currentSelectedWords.splice(idx, 1);
        availableWords.push(word);
        updatePools();
      };
      dropZone.appendChild(wBtn);
    });

    availableWords.forEach((word, idx) => {
      const wBtn = document.createElement("span");
      wBtn.className = "word-block";
      wBtn.textContent = word;
      wBtn.onclick = () => {
        availableWords.splice(idx, 1);
        currentSelectedWords.push(word);
        updatePools();
      };
      wordsPool.appendChild(wBtn);
    });
  }

  updatePools();

  const submitBtn = document.createElement("button");
  submitBtn.className = "magic-btn";
  submitBtn.textContent = "Проверить ответ";
  submitBtn.style.padding = "10px 20px";
  submitBtn.style.fontSize = "1rem";

  submitBtn.onclick = () => {
    const isCorrect =
      JSON.stringify(currentSelectedWords) ===
      JSON.stringify(question.correctOrder);
    handleAnswer(isCorrect, submitBtn);
  };

  container.appendChild(dropZone);
  container.appendChild(wordsPool);
  container.appendChild(submitBtn);
  ui.interactiveArea.appendChild(container);
}

// Механика 3: Ввод текста с клавиатуры
function renderInputMechanic(question) {
  const container = document.createElement("div");
  container.className = "mechanic-input";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "magic-input";
  input.placeholder = "Введите ответ...";

  const submitBtn = document.createElement("button");
  submitBtn.className = "magic-btn";
  submitBtn.textContent = "Отправить";
  submitBtn.style.padding = "10px 20px";
  submitBtn.style.fontSize = "1rem";

  const checkAction = () => {
    const userVal = input.value.trim().toLowerCase();
    const correctVal = question.correct.toLowerCase();
    const isCorrect = userVal === correctVal;
    handleAnswer(isCorrect, submitBtn);
  };

  submitBtn.onclick = checkAction;
  input.onkeydown = (e) => {
    if (e.key === "Enter") checkAction();
  };

  container.appendChild(input);
  container.appendChild(submitBtn);
  ui.interactiveArea.appendChild(container);
  input.focus();
}

// ==========================================
// ОБРАБОТКА ОТВЕТОВ И УРОНА
// ==========================================
function updateTimerUI() {
  ui.timerDisplay.textContent = `⏱ ${timeLeft}s`;
  // Красный пульс когда остается 15 секунд или меньше
  if (timeLeft <= 15) {
    ui.timerDisplay.classList.add("warning");
  } else {
    ui.timerDisplay.classList.remove("warning");
  }
}

function updateHPUI() {
  const hearts = ui.hpContainer.querySelectorAll(".heart");
  hearts.forEach((heart, index) => {
    if (index < hp) {
      heart.classList.remove("lost");
    } else {
      heart.classList.add("lost");
    }
  });
}

function handleAnswer(isCorrect, element) {
  clearInterval((timerIntent = null));
  clearInterval(timerInterval);

  // Блокируем интерфейс от повторных кликов
  const allInteractive = ui.interactiveArea.querySelectorAll("button, input");
  allInteractive.forEach((el) => (el.style.pointerEvents = "none"));

  if (isCorrect) {
    if (!isMuted) {
      audio.correct.currentTime = 0;
      audio.correct.play();
    }

    let earnedXp = timeLeft >= 30 ? 200 : 100;
    let bonusText = earnedXp === 200 ? "SPEED BONUS! +200 XP" : "+100 XP";

    xp += earnedXp;
    ui.xpScore.textContent = xp;

    if (element && element.classList.contains("answer-btn"))
      element.classList.add("correct");
    showFeedback(true, "Верно!", bonusText);

    setTimeout(proceedToNext, 1800);
  } else {
    if (!isMuted) {
      audio.wrong.currentTime = 0;
      audio.wrong.play();
    }

    hp--;
    updateHPUI();

    // Срабатывание анимации потери жизни (тряска экрана + красная вспышка)
    document.body.classList.add("damage-flash", "screen-shake");
    setTimeout(() => {
      document.body.classList.remove("damage-flash", "screen-shake");
    }, 800);

    if (element && element.classList.contains("answer-btn"))
      element.classList.add("wrong");

    const errorMsg = timeLeft <= 0 ? "Время вышло!" : "Ошибка!";
    showFeedback(
      false,
      errorMsg,
      hp > 0 ? "Осталась 1 жизнь!" : "Право на ошибку исчерпано!",
    );

    setTimeout(() => {
      if (hp <= 0) {
        endGame();
      } else {
        proceedToNext();
      }
    }, 2000);
  }
}

function showFeedback(isSuccess, mainText, subText) {
  ui.feedbackOverlay.classList.remove("hidden", "success", "error");
  ui.feedbackOverlay.classList.add(isSuccess ? "success" : "error");
  ui.feedbackText.textContent = mainText;
  ui.feedbackBonus.textContent = subText;
}

function proceedToNext() {
  ui.feedbackOverlay.classList.add("hidden");
  currentQuestionIndex++;

  // Переход на следующий уровень, если в текущем кончились вопросы (5 вопросов)
  const currentLevel = questData[currentLevelIndex];
  if (currentQuestionIndex >= currentLevel.questions.length) {
    currentLevelIndex++;
    currentQuestionIndex = 0;

    if (currentLevelIndex >= questData.length) {
      endGame(true); // Победа, пройдены все уровни до C1
      return;
    }

    // Меняем тему и музыку для нового зала
    const nextLevelData = questData[currentLevelIndex];
    setTheme(nextLevelData.themeClass);
    playMusic(document.getElementById(nextLevelData.musicId));
  }

  loadQuestion();
}

function endGame(isVictory = false) {
  setTheme(null); // Возврат к теме меню
  playMusic(audio.menu);

  let finalLvlText =
    questData[Math.max(0, currentLevelIndex - (isVictory ? 0 : 1))].level;
  if (isVictory) finalLvlText = "C1 (Advanced)";

  ui.finalXp.textContent = xp;
  ui.finalLevel.textContent = finalLvlText;

  let analysisHtml = "";
  if (currentLevelIndex === 0 && !isVictory) {
    analysisHtml =
      "<li>Базовый уровень (A0). Обратите внимание на самые простые правила и алфавит.</li>";
  } else if (currentLevelIndex <= 2) {
    analysisHtml =
      "<li>Начальный уровень (A1-A2). Повторите базовые времена и предлоги.</li>";
  } else if (currentLevelIndex <= 4) {
    analysisHtml =
      "<li>Средний уровень (B1-B2). Уделите внимание условным предложениям и пассивному залогу.</li>";
  } else {
    analysisHtml =
      "<li>Продвинутый уровень! Отличный результат, вы дошли до вершин цитадели.</li>";
  }

  ui.analysisList.innerHTML = analysisHtml;
  switchScreen("result");
}

// ==========================================
// УПРАВЛЕНИЕ ОКНОМ И ЗВУКОМ
// ==========================================
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .catch((err) => console.log(err));
  } else {
    document.exitFullscreen();
  }
}

function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById("mute-btn");
  if (isMuted) {
    if (currentActiveMusic) currentActiveMusic.pause();
    muteBtn.textContent = "🔇";
    muteBtn.style.color = "#ff3b3b";
  } else {
    if (currentActiveMusic) currentActiveMusic.play();
    muteBtn.textContent = "🔊";
    muteBtn.style.color = "var(--accent-glow)";
  }
}

function updateVolume() {
  const volumeSlider = document.getElementById("volume-slider");
  const vol = parseFloat(volumeSlider.value);

  audio.correct.volume = vol;
  audio.wrong.volume = vol;

  // Установка громкости для всех фоновых треков
  document.querySelectorAll('audio[id^="bg-music"]').forEach((el) => {
    el.volume = vol;
  });

  if (vol > 0 && isMuted) toggleMute();
  else if (vol === 0 && !isMuted) toggleMute();
}
