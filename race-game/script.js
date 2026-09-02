/* === БАЗА ДАННЫХ === */
const questionsData = [
  {
    text: "My car is ____ than yours. (fast)",
    options: ["faster", "fastest", "more fast", "fastly"],
    correct: 0,
  },
  {
    text: "The Bugatti is the ____ car in the world. (fast)",
    options: ["fastest", "faster", "most fast", "fast"],
    correct: 0,
  },
  {
    text: "This is the ____ race of my life! (good)",
    options: ["goodest", "better", "best", "gooder"],
    correct: 2,
  },
  {
    text: "The weather today is ____ than yesterday. (bad)",
    options: ["worst", "worse", "badder", "badly"],
    correct: 1,
  },
  {
    text: "Ferrari is the ____ car here. (beautiful)",
    options: [
      "more beautiful",
      "most beautiful",
      "beautifullest",
      "beautifuler",
    ],
    correct: 1,
  },
  {
    text: "Racing is ____ than walking. (dangerous)",
    options: ["dangerous", "more dangerous", "most dangerous", "dangerouser"],
    correct: 1,
  },
  {
    text: "Today is the ____ day of the summer. (hot)",
    options: ["hoter", "hottest", "hotest", "more hot"],
    correct: 1,
  },
  {
    text: "I am ____ than you! (happy)",
    options: ["happyer", "happiest", "happier", "more happy"],
    correct: 2,
  },
  {
    text: "The engine is the ____ part. (expensive)",
    options: ["most expensive", "more expensive", "expensivest", "expensive"],
    correct: 0,
  },
  {
    text: "A truck is ____ than a bike. (big)",
    options: ["biger", "biggest", "bigger", "more big"],
    correct: 2,
  },
];

let questions = [];

const bgTracks = [
  "https://george-stone-pax.github.io/my-game-assets/Aylex%20-%20Back%20To%20Life%20(freetouse.com).mp3",
  "https://george-stone-pax.github.io/my-game-assets/Aylex%20-%20Adrenaline%20Drive%20(freetouse.com).mp3",
  "https://george-stone-pax.github.io/my-game-assets/Aylex%20-%20Off%20Road%20(freetouse.com).mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music1.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music2.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music3.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music4.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music5.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music6.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music7.mp3",
];

/* === DOM ЭЛЕМЕНТЫ === */
const screens = {
  menu: document.getElementById("main-menu"),
  theory: document.getElementById("theory-screen"),
  start: document.getElementById("start-screen"),
  settings: document.getElementById("settings-screen"),
  end: document.getElementById("end-screen"),
  question: document.getElementById("question-overlay"),
};

const ui = {
  hud: document.getElementById("hud"),
  gameObjects: document.getElementById("game-objects"),
  rank: document.getElementById("rank-val"),
  score: document.getElementById("score-val"),
  progress: document.getElementById("race-progress"),
  speed: document.getElementById("speed-val"),
  feedback: document.getElementById("feedback-text"),
  qText: document.getElementById("q-text"),
  optsContainer: document.getElementById("opts-container"),
  timerBar: document.getElementById("timer-bar"),
  enemyCar: document.getElementById("enemy-car"),
  enemyImg: document.getElementById("enemy-img"),
  playerCar: document.getElementById("player-car"),
};

const audio = {
  correct: document.getElementById("sfx-correct"),
  wrong: document.getElementById("sfx-wrong"),
  bg: document.getElementById("bg-music"),
};

/* === СОСТОЯНИЕ ИГРЫ === */
let currentQIndex = 0,
  score = 0,
  currentRank = 10;
let gameActive = false,
  isPaused = false,
  previousScreen = "menu";
let speedInterval, timerInterval;
let enemyScaleEnd = 0.5,
  enemyScaleOvertake = 1.5;

/* === СОБЫТИЯ === */
document.getElementById("btn-theory").onclick = () => switchScreen("theory");
document.getElementById("btn-close-theory").onclick = () =>
  switchScreen("menu");

document.getElementById("btn-settings").onclick = () => {
  previousScreen = "menu";
  switchScreen("settings");
};

document.getElementById("btn-ingame-settings").onclick = () => {
  previousScreen = "game";
  isPaused = true;
  screens.settings.style.display = "flex";
};

document.getElementById("btn-close-settings").onclick = () => {
  if (previousScreen === "menu") switchScreen("menu");
  else {
    screens.settings.style.display = "none";
    isPaused = false;
  }
};

document.getElementById("btn-fullscreen-toggle").onclick = () => {
  if (!document.fullscreenElement) enableFullScreen();
  else {
    if (document.exitFullscreen) document.exitFullscreen();
    document
      .getElementById("game-container")
      .classList.remove("fullscreen-active");
  }
};

document.getElementById("language-select").onchange = () =>
  alert("Отличный выбор! Язык системы успешно изменен на English.");

document.getElementById("btn-start-menu").onclick = () => switchScreen("start");
document.getElementById("btn-start-game").onclick = () => {
  enableFullScreen();
  startGame();
};

/* === УПРАВЛЕНИЕ ГРОМКОСТЬЮ === */
const volSlider = document.getElementById("volume-slider");
const volDisplay = document.getElementById("volume-display");

if (volSlider && volDisplay) {
  // Устанавливаем начальную громкость при загрузке страницы
  const initialVolume = parseFloat(volSlider.value);
  audio.bg.volume = initialVolume;
  audio.correct.volume = initialVolume;
  audio.wrong.volume = initialVolume;
  volDisplay.innerText = Math.round(initialVolume * 100) + "%";

  // Меняем громкость при движении ползунка
  volSlider.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    volDisplay.innerText = Math.round(v * 100) + "%";
    audio.bg.volume = v;
    audio.correct.volume = v;
    audio.wrong.volume = v;
  });
}

/* === ФУНКЦИИ ИГРЫ === */
function switchScreen(screenName) {
  Object.values(screens).forEach((s) => (s.style.display = "none"));
  if (screens[screenName]) screens[screenName].style.display = "flex";
}

function enableFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  document.getElementById("game-container").classList.add("fullscreen-active");
}

function startGame() {
  const randomTrack = bgTracks[Math.floor(Math.random() * bgTracks.length)];
  audio.bg.src = randomTrack;

  // Убеждаемся, что при старте игры применяется текущая громкость ползунка
  if (volSlider) {
    audio.bg.volume = parseFloat(volSlider.value);
  }

  audio.bg.play().catch(() => {});

  currentQIndex = 0;
  score = 0;
  currentRank = 10;
  gameActive = true;
  isPaused = false;
  questions = [...questionsData].sort(() => Math.random() - 0.5);

  switchScreen("");
  ui.hud.style.display = "flex";
  ui.gameObjects.style.display = "block";

  updateHUD();
  animateSpeedometer();
  resetEnemyCar();
  showNextQuestion();
}

function animateSpeedometer() {
  clearInterval(speedInterval);
  speedInterval = setInterval(() => {
    if (!gameActive || isPaused) return;
    const baseSpeed = currentRank === 1 ? 280 : 200 - currentRank * 5;
    ui.speed.innerText = baseSpeed + (Math.floor(Math.random() * 15) - 5);
  }, 200);
}

function resetEnemyCar() {
  let targetCarIndex = currentRank - 1;
  if (targetCarIndex < 1) targetCarIndex = 1;
  if (targetCarIndex > 9) targetCarIndex = 9;
  ui.enemyImg.src = `https://george-stone-pax.github.io/gamesnew/car${targetCarIndex}.png`;

  if (targetCarIndex === 6 || targetCarIndex === 7) {
    enemyScaleEnd = 0.35;
    enemyScaleOvertake = 1.3;
  } else if (
    targetCarIndex === 1 ||
    targetCarIndex === 2 ||
    targetCarIndex === 5
  ) {
    enemyScaleEnd = 0.8;
    enemyScaleOvertake = 2.0;
  } else {
    enemyScaleEnd = 0.5;
    enemyScaleOvertake = 1.6;
  }

  ui.enemyCar.style.transition = "none";
  ui.enemyCar.style.bottom = "50%";
  ui.enemyCar.style.transform = `translateX(-50%) scale(0.01)`;
  ui.enemyCar.style.opacity = "1";
  ui.enemyCar.style.left = "50%";

  setTimeout(() => {
    if (!gameActive) return;
    ui.enemyCar.style.transition = "bottom 4s ease-out, transform 4s ease-out";
    ui.enemyCar.style.bottom = "30%";
    ui.enemyCar.style.transform = `translateX(-50%) scale(${enemyScaleEnd})`;
  }, 50);
}

function showNextQuestion() {
  if (!gameActive) return;
  if (currentQIndex >= questions.length || currentRank === 1) {
    endGame();
    return;
  }
  const q = questions[currentQIndex];
  ui.qText.innerText = q.text;
  ui.optsContainer.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(idx === q.correct);
    ui.optsContainer.appendChild(btn);
  });
  screens.question.style.display = "block";
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  const timeLimit = parseInt(document.getElementById("timer-input").value) || 0;
  if (timeLimit <= 0) {
    ui.timerBar.style.display = "none";
    return;
  }
  ui.timerBar.style.display = "block";
  ui.timerBar.style.width = "100%";
  ui.timerBar.style.backgroundColor = "var(--neon-green)";
  let currentTime = timeLimit * 1000;
  const tick = 50;
  timerInterval = setInterval(() => {
    if (isPaused) return;
    currentTime -= tick;
    const percent = (currentTime / (timeLimit * 1000)) * 100;
    ui.timerBar.style.width = percent + "%";
    if (percent < 50) ui.timerBar.style.backgroundColor = "yellow";
    if (percent < 20) ui.timerBar.style.backgroundColor = "red";
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      handleAnswer(false);
    }
  }, tick);
}

function handleAnswer(isCorrect) {
  if (!gameActive) return;
  clearInterval(timerInterval);
  screens.question.style.display = "none";
  const road = document.querySelector(".road-surface");

  if (isCorrect) {
    audio.correct.play();
    score++;
    if (currentRank > 1) currentRank--;
    ui.feedback.innerText = "NITRO!";
    ui.feedback.style.color = "var(--neon-green)";
    ui.feedback.style.textShadow = "4px 4px 0 #000, 0 0 20px var(--neon-green)";
    document
      .querySelectorAll(".flame")
      .forEach((f) => (f.style.display = "block"));
    road.style.animationDuration = "0.15s";
    document.getElementById("game-container").classList.add("shake-screen");

    ui.enemyCar.style.transition =
      "bottom 0.8s ease-in, transform 0.8s ease-in, left 0.8s linear";
    ui.enemyCar.style.bottom = "-15%";
    ui.enemyCar.style.transform = `translateX(-50%) scale(${enemyScaleOvertake})`;
    ui.enemyCar.style.left = Math.random() > 0.5 ? "20%" : "80%";
    ui.speed.innerText = 300 + Math.floor(Math.random() * 20);
  } else {
    audio.wrong.play();
    ui.feedback.innerText = "SPIN OUT!";
    ui.feedback.style.color = "#ff003c";
    ui.feedback.style.textShadow = "4px 4px 0 #000, 0 0 20px #ff003c";
    ui.playerCar.style.transition = "transform 0.5s";
    ui.playerCar.style.transform = "translateX(-50%) rotate(360deg)";
    road.style.animationDuration = "1s";
    ui.speed.innerText = 80;

    ui.enemyCar.style.transition = "bottom 1s, transform 1s";
    ui.enemyCar.style.bottom = "50%";
    ui.enemyCar.style.transform = `translateX(-50%) scale(0.01)`;
  }

  ui.feedback.style.display = "block";
  updateHUD();

  setTimeout(() => {
    if (!gameActive) return;
    ui.feedback.style.display = "none";
    document
      .querySelectorAll(".flame")
      .forEach((f) => (f.style.display = "none"));
    road.style.animationDuration = "0.4s";
    document.getElementById("game-container").classList.remove("shake-screen");
    ui.playerCar.style.transform = "translateX(-50%) rotate(0deg)";

    if (currentRank === 1 || currentQIndex >= questions.length - 1) endGame();
    else {
      resetEnemyCar();
      currentQIndex++;
      showNextQuestion();
    }
  }, 1500);
}

function updateHUD() {
  ui.rank.innerText = currentRank;
  ui.score.innerText = score;
  const progressPercent = ((10 - currentRank) / 9) * 100;
  ui.progress.style.width = `${progressPercent}%`;
}

function endGame() {
  document.getElementById("question-overlay").style.display = "none";
  document.getElementById("hud").style.display = "none";

  const endScreen = document.getElementById("end-screen");
  endScreen.style.display = "flex";

  const totalQuestions = questionsData.length;

  if (typeof currentRank !== "undefined") {
    document.getElementById("final-rank").innerText = currentRank;
  }

  const percent =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  document.getElementById("final-percent").innerText = percent;

  const finalMessageElement = document.getElementById("final-grade");
  if (finalMessageElement) {
    let message = "";
    if (score === totalQuestions) {
      message =
        "🏆 Грандиозно! Идеальная гонка без единой ошибки. Поздравляем!";
    } else if (score >= totalQuestions * 0.7) {
      message = `🎉 Отличный дрифт! Поздравляем, пройдено чисто на ${score} из ${totalQuestions}!`;
    } else {
      message = `👍 Хорошая попытка! Твой результат: ${score} из ${totalQuestions}. Давай прокачаем грамматику и попробуем еще раз!`;
    }
    finalMessageElement.innerHTML = message;
  }

  if (typeof startFireworks === "function") {
    startFireworks();
  }
}

function startFireworks() {
  const canvas = document.getElementById("fireworks");
  if (!canvas) return;
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  const container = document.getElementById("game-container");
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  const particles = [];

  function createParticle(x, y) {
    for (let i = 0; i < 40; i++)
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        alpha: 1,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      });
  }

  function animate() {
    if (canvas.style.display === "none") return;
    requestAnimationFrame(animate);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    if (Math.random() < 0.05)
      createParticle(
        Math.random() * canvas.width,
        Math.random() * (canvas.height / 2),
      );
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.alpha -= 0.015;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }
  animate();
}
