document.addEventListener("DOMContentLoaded", () => {
  // === ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ===
  const grid = document.getElementById("alphabetGrid");
  const startBtn = document.getElementById("startBtn");
  const checkBtn = document.getElementById("checkBtn");
  const resetBtn = document.getElementById("resetBtn");
  const restartBtn = document.getElementById("restartBtn");
  const winModal = document.getElementById("winModal");

  // Кнопки громкости и полного экрана
  const muteBtn = document.getElementById("muteBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const gameContainer = document.getElementById("gameContainer");

  // Аудиоэлементы
  const bgMusic = document.getElementById("bgMusic");
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  // === ПЕРЕМЕННЫЕ СОСТОЯНИЯ ===
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let currentLetters = [...ALPHABET];
  let draggedIndex = null;
  let selectedIndex = null; // Для клика/тапа на мобильных
  let gameStarted = false;

  // === ИНИЦИАЛИЗАЦИЯ ИГРЫ ===
  function initGame() {
    currentLetters = [...ALPHABET];
    gameStarted = false;
    checkBtn.disabled = true;
    renderGrid();
  }

  // Отображение карточек в сетке
  function renderGrid() {
    grid.innerHTML = "";
    currentLetters.forEach((letter, index) => {
      const tile = document.createElement("div");
      tile.classList.add("letter-tile");
      tile.textContent = letter;
      tile.dataset.index = index;

      if (gameStarted) {
        tile.setAttribute("draggable", "true");
        addDragAndDropEvents(tile);
        addTouchEvents(tile);
      } else {
        tile.removeAttribute("draggable");
      }

      // Выделение выбранной карточки (для управления по клику/тапу)
      if (selectedIndex === index) {
        tile.classList.add("selected");
      }

      grid.appendChild(tile);
    });
  }

  // Перемешивание массива (алгоритм Фишера — Йетса)
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Гарантируем, что после перемешивания хотя бы часть элементов изменит позиции
    return arr;
  }

  // Обмен карточек местами
  function swapTiles(index1, index2) {
    if (index1 === index2 || index1 === null || index2 === null) return;
    const temp = currentLetters[index1];
    currentLetters[index1] = currentLetters[index2];
    currentLetters[index2] = temp;
    selectedIndex = null;
    renderGrid();
  }

  // === DRAG & DROP ДЛЯ ПК ===
  function addDragAndDropEvents(tile) {
    tile.addEventListener("dragstart", (e) => {
      draggedIndex = parseInt(tile.dataset.index, 10);
      tile.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    tile.addEventListener("dragend", () => {
      tile.classList.remove("dragging");
      draggedIndex = null;
    });

    tile.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    tile.addEventListener("dragenter", () => {
      tile.classList.add("hovered");
    });

    tile.addEventListener("dragleave", () => {
      tile.classList.remove("hovered");
    });

    tile.addEventListener("drop", (e) => {
      e.preventDefault();
      tile.classList.remove("hovered");
      const targetIndex = parseInt(tile.dataset.index, 10);
      swapTiles(draggedIndex, targetIndex);
    });
  }

  // === УПРАВЛЕНИЕ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ И КЛИКОВ ===
  function addTouchEvents(tile) {
    tile.addEventListener("click", () => {
      const index = parseInt(tile.dataset.index, 10);
      if (selectedIndex === null) {
        selectedIndex = index;
        renderGrid();
      } else if (selectedIndex === index) {
        selectedIndex = null;
        renderGrid();
      } else {
        swapTiles(selectedIndex, index);
      }
    });
  }

  // === СТАРТ, ПРОВЕРКА И СБРОС ===
  startBtn.addEventListener("click", () => {
    // Перемешиваем буквы
    currentLetters = shuffleArray(ALPHABET);
    gameStarted = true;
    checkBtn.disabled = false;
    selectedIndex = null;
    renderGrid();

    // Запуск фоновой музыки
    playBgMusic();
  });

  resetBtn.addEventListener("click", () => {
    initGame();
  });

  checkBtn.addEventListener("click", () => {
    if (!gameStarted) return;

    // Проверяем совпадение текущего порядка с алфавитным
    let isCorrect = true;
    const tiles = grid.querySelectorAll(".letter-tile");

    currentLetters.forEach((letter, index) => {
      if (letter === ALPHABET[index]) {
        tiles[index].classList.add("correct");
        tiles[index].classList.remove("wrong");
      } else {
        tiles[index].classList.add("wrong");
        tiles[index].classList.remove("correct");
        isCorrect = false;
      }
    });

    if (isCorrect) {
      playSound(correctSound);
      winModal.classList.add("active");
    } else {
      playSound(wrongSound);
    }
  });

  restartBtn.addEventListener("click", () => {
    winModal.classList.remove("active");
    initGame();
  });

  // === АУДИО И ГРОМКОСТЬ ===
  function setVolume(val) {
    bgMusic.volume = val;
    correctSound.volume = val;
    wrongSound.volume = val;
  }

  function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
  }

  function playBgMusic() {
    bgMusic.play().catch(() => {
      // Автовоспроизведение блокируется браузерами до первого клика
    });
  }

  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      muteBtn.textContent = "🔇";
    } else {
      muteBtn.textContent = "🔊";
    }
  });

  muteBtn.addEventListener("click", () => {
    if (bgMusic.volume > 0) {
      bgMusic.dataset.lastVol = volumeSlider.value;
      volumeSlider.value = 0;
      setVolume(0);
      muteBtn.textContent = "🔇";
    } else {
      const restoreVol = bgMusic.dataset.lastVol || 0.05;
      volumeSlider.value = restoreVol;
      setVolume(restoreVol);
      muteBtn.textContent = "🔊";
    }
  });

  // Первоначальная установка громкости
  setVolume(parseFloat(volumeSlider.value));

  // === ПОЛНОЭКРАННЫЙ РЕЖИМ ===
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen().catch((err) => {
        console.error(`Ошибка включения полного экрана: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Старт при загрузке
  initGame();
});
