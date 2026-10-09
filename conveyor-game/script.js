import * as THREE from "three";

// --- НАСТРОЙКИ ИГРЫ: БАЗА ИЗ 30 ВОПРОСОВ ---
const allSentences = [
  { words: ["you", "Did", "see", "the", "cat", "?"] },
  { words: ["he", "call", "you", "Did", "?"] },
  { words: ["bed", "to", "they", "go", "Did", "?"] },
  { words: ["she", "buy", "car", "new", "a", "Did", "?"] },
  { words: ["Did", "play", "tennis", "he", "?"] },
  { words: ["they", "Did", "win", "the", "game", "?"] },
  { words: ["Did", "you", "like", "the", "film", "?"] },
  { words: ["on", "Did", "rain", "it", "Monday", "?"] },
  { words: ["you", "Did", "sleep", "well", "?"] },
  { words: ["Did", "he", "find", "his", "bag", "?"] },
  { words: ["they", "eat", "cake", "the", "Did", "?"] },
  { words: ["she", "Did", "drink", "her", "tea", "?"] },
  { words: ["Did", "you", "hear", "the", "song", "?"] },
  { words: ["he", "Did", "take", "a", "photo", "?"] },
  { words: ["they", "run", "fast", "Did", "?"] },
  { words: ["she", "Did", "write", "a", "text", "?"] },
  { words: ["you", "Did", "meet", "him", "?"] },
  { words: ["he", "Did", "break", "the", "cup", "?"] },
  { words: ["they", "Did", "build", "a", "tent", "?"] },
  { words: ["she", "Did", "drive", "the", "bus", "?"] },
  { words: ["you", "Did", "lose", "your", "pen", "?"] },
  { words: ["he", "Did", "pay", "the", "bill", "?"] },
  { words: ["they", "Did", "fly", "to", "Rome", "?"] },
  { words: ["she", "wear", "hat", "a", "Did", "?"] },
  { words: ["in", "you", "sea", "the", "swim", "Did", "?"] },
  { words: ["he", "jump", "high", "Did", "?"] },
  { words: ["they", "walk", "home", "Did", "?"] },
  { words: ["she", "Did", "read", "the", "book", "?"] },
  { words: ["you", "Did", "hide", "the", "toy", "?"] },
  { words: ["he", "Did", "wash", "his", "car", "?"] },
];

const allCorrectAnswers = [
  ["Did", "you", "see", "the", "cat", "?"],
  ["Did", "he", "call", "you", "?"],
  ["Did", "they", "go", "to", "bed", "?"],
  ["Did", "she", "buy", "a", "new", "car", "?"],
  ["Did", "he", "play", "tennis", "?"],
  ["Did", "they", "win", "the", "game", "?"],
  ["Did", "you", "like", "the", "film", "?"],
  ["Did", "it", "rain", "on", "Monday", "?"],
  ["Did", "you", "sleep", "well", "?"],
  ["Did", "he", "find", "his", "bag", "?"],
  ["Did", "they", "eat", "the", "cake", "?"],
  ["Did", "she", "drink", "her", "tea", "?"],
  ["Did", "you", "hear", "the", "song", "?"],
  ["Did", "he", "take", "a", "photo", "?"],
  ["Did", "they", "run", "fast", "?"],
  ["Did", "she", "write", "a", "text", "?"],
  ["Did", "you", "meet", "him", "?"],
  ["Did", "he", "break", "the", "cup", "?"],
  ["Did", "they", "build", "a", "tent", "?"],
  ["Did", "she", "drive", "the", "bus", "?"],
  ["Did", "you", "lose", "your", "pen", "?"],
  ["Did", "he", "pay", "the", "bill", "?"],
  ["Did", "they", "fly", "to", "Rome", "?"],
  ["Did", "she", "wear", "a", "hat", "?"],
  ["Did", "you", "swim", "in", "the", "sea", "?"],
  ["Did", "he", "jump", "high", "?"],
  ["Did", "they", "walk", "home", "?"],
  ["Did", "she", "read", "the", "book", "?"],
  ["Did", "you", "hide", "the", "toy", "?"],
  ["Did", "he", "wash", "his", "car", "?"],
];

let gameSentences = [];
let gameCorrectAnswers = [];
let currentSentenceIndex = 0;
const totalQuestions = 10;
let isReversing = false;

// Инициализация случайных 10 вопросов
function initGameData() {
  let indices = Array.from({ length: 30 }, (_, i) => i);
  indices.sort(() => Math.random() - 0.5);
  let selectedIndices = indices.slice(0, totalQuestions);

  gameSentences = selectedIndices.map((i) => allSentences[i]);
  gameCorrectAnswers = selectedIndices.map((i) => allCorrectAnswers[i]);
  currentSentenceIndex = 0;
  updateCounter();
}

function updateCounter() {
  const counterEl = document.getElementById("question-counter");
  if (counterEl) {
    counterEl.textContent = `Question: ${currentSentenceIndex + 1} / ${totalQuestions}`;
  }
}

// --- АУДИО СИСТЕМА ---
const bgMusic = document.getElementById("bg-music");
const soundRight = document.getElementById("sound-right");
const soundWrong = document.getElementById("sound-wrong");
const volumeSlider = document.getElementById("volume-slider");
let musicStarted = false;

function updateVolume() {
  if (!volumeSlider) return;
  const vol = parseFloat(volumeSlider.value);
  bgMusic.volume = vol;
  soundRight.volume = vol;
  soundWrong.volume = vol;
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", updateVolume);
}

window.addEventListener(
  "pointerdown",
  () => {
    if (!musicStarted) {
      updateVolume();
      bgMusic
        .play()
        .catch((e) => console.log("Браузер заблокировал автовоспроизведение"));
      musicStarted = true;
    }
  },
  { once: true },
);

// --- THREE.JS ПЕРЕМЕННЫЕ ---
let scene, camera, renderer;
let raycaster, mouse;
let conveyor,
  dropZonesGroup,
  dropZones = [],
  wordBoxes = [];
let draggedObject = null;
let dragPlane = new THREE.Plane();
let planeIntersect = new THREE.Vector3();
// Переменные для распознавания клика/тапа и возврата коробок
let pointerDownTime = 0;
let pointerDownPos = { x: 0, y: 0 };
let wasInZoneOnDown = null;

// --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
const messageEl = document.getElementById("message");
const checkButton = document.getElementById("check-button");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");
const restartButton = document.getElementById("restart-button");
const endScreen = document.getElementById("end-screen");
const canvasContainer = document.getElementById("canvas-container");

// Настройки и модальное окно
const settingsBtn = document.getElementById("settings-btn");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const settingsModal = document.getElementById("settings-modal");
const fullscreenBtn = document.getElementById("fullscreen-btn");

if (settingsBtn && settingsModal) {
  settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "flex";
  });
}

if (closeSettingsBtn && settingsModal) {
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Ошибка включения полноэкранного режима: ${err.message}`);
      });
      fullscreenBtn.textContent = "Выйти из полного экрана";
    } else {
      document.exitFullscreen();
      fullscreenBtn.textContent = "Войти в полный экран";
    }
  });
}

// Удержание кнопки "Назад"
if (backButton) {
  backButton.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isReversing = true;
  });
  backButton.addEventListener("pointerup", (e) => {
    e.preventDefault();
    isReversing = false;
  });
  backButton.addEventListener("pointerleave", (e) => {
    e.preventDefault();
    isReversing = false;
  });
}

// Перезапуск игры
if (restartButton) {
  restartButton.addEventListener("click", () => {
    endScreen.style.display = "none";
    initGameData();
    loadSentence();
    checkButton.style.display = "inline-block";
    nextButton.style.display = "none";
    messageEl.classList.remove("show");
  });
}

// --- ИНИЦИАЛИЗАЦИЯ 3D СЦЕНЫ ---
function init() {
  initGameData();

  scene = new THREE.Scene();

  const backgroundUrl =
    "https://george-stone-pax.github.io/my-game-assets2/logistic-warehouse-interior-with-box-and-pallet-vector-49010067.jpg";
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(backgroundUrl, (texture) => {
    scene.background = texture;
  });

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  adjustCameraForScreen();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 30, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  canvasContainer.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  createConveyor();
  loadSentence();
  animate();

  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointercancel", onPointerUp);

  if (checkButton) checkButton.addEventListener("click", checkAnswer);
  if (nextButton) nextButton.addEventListener("click", loadNextSentence);

  updateVolume();
}

// Адаптация положения камеры под телефон/планшет/ПК
// Адаптация положения и угла обзора камеры под экраны смартфонов, планшетов и ПК
function adjustCameraForScreen() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;

  if (aspect < 0.55) {
    // Узкие экраны смартфонов: приближаем камеру и фокус
    camera.fov = 68;
    camera.position.set(0, 48, 44);
    camera.lookAt(0, 12, 0);
  } else if (aspect < 0.75) {
    // Обычные смартфоны в вертикальном режиме
    camera.fov = 62;
    camera.position.set(0, 52, 48);
    camera.lookAt(0, 11, 0);
  } else if (aspect < 1.2) {
    // Планшеты
    camera.fov = 58;
    camera.position.set(0, 58, 52);
    camera.lookAt(0, 10, 0);
  } else {
    // ПК
    camera.fov = 50;
    camera.position.set(0, 50, 45);
    camera.lookAt(0, 10, 0);
  }

  camera.updateProjectionMatrix();
}

// --- СОЗДАНИЕ ОБЪЕКТОВ ---
function createConveyor() {
  const conveyorWidth = 130;
  const conveyorHeight = 18;
  const conveyorThickness = 2.0;

  const textureUrl =
    "https://media.istockphoto.com/id/489228919/vector/metal-plate-background-with-screws.jpg?s=612x612&w=0&k=20&c=LpOM6RjYp3yAbCg_s2s_yP9i-D2a_hODg2vjmc9Vz-M=";
  const textureLoader = new THREE.TextureLoader();
  const conveyorTexture = textureLoader.load(textureUrl);
  conveyorTexture.wrapS = THREE.RepeatWrapping;
  conveyorTexture.wrapT = THREE.RepeatWrapping;
  conveyorTexture.repeat.set(conveyorWidth / 8, 1);

  const conveyorMaterial = new THREE.MeshStandardMaterial({
    map: conveyorTexture,
    roughness: 0.7,
    metalness: 0.3,
  });

  const conveyorGeometry = new THREE.BoxGeometry(
    conveyorWidth,
    conveyorThickness,
    conveyorHeight,
  );
  conveyor = new THREE.Mesh(conveyorGeometry, conveyorMaterial);
  conveyor.position.y = 15;
  conveyor.receiveShadow = true;
  scene.add(conveyor);

  dropZonesGroup = new THREE.Group();
  dropZonesGroup.position.y = 15;
  scene.add(dropZonesGroup);
}

function createDropZones(numZones) {
  dropZones.forEach((zone) => {
    dropZonesGroup.remove(zone);
    zone.geometry.dispose();
    zone.material.map.dispose();
    zone.material.dispose();
  });
  dropZones = [];

  const aspect = window.innerWidth / window.innerHeight;
  // Динамически уменьшаем шаг между ячейками, если экран узкий или предложению нужно много слов
  let zoneSpacing = 18;
  if (aspect < 0.75) {
    zoneSpacing = Math.min(14.5, 85 / Math.max(numZones - 1, 1));
  }
  const zoneSize = 7.5;

  for (let i = 0; i < numZones; i++) {
    const zoneCanvas = document.createElement("canvas");
    const zoneCtx = zoneCanvas.getContext("2d");
    zoneCanvas.width = 256;
    zoneCanvas.height = 256;

    zoneCtx.fillStyle = "rgba(56, 189, 248, 0.2)";
    zoneCtx.fillRect(0, 0, 256, 256);
    zoneCtx.strokeStyle = "rgba(56, 189, 248, 0.8)";
    zoneCtx.lineWidth = 12;
    zoneCtx.setLineDash([20, 15]);
    zoneCtx.strokeRect(10, 10, 236, 236);

    zoneCtx.textAlign = "center";
    zoneCtx.font = "bold 120px Arial";
    zoneCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
    zoneCtx.fillText(i + 1, 128, 170);

    const zoneTexture = new THREE.CanvasTexture(zoneCanvas);
    const zoneMaterial = new THREE.MeshBasicMaterial({
      map: zoneTexture,
      transparent: true,
    });

    const zone = new THREE.Mesh(
      new THREE.PlaneGeometry(zoneSize, zoneSize),
      zoneMaterial,
    );
    zone.position.set((i - (numZones - 1) / 2) * zoneSpacing, 1.02, 0);
    zone.rotation.x = -Math.PI / 2;
    zone.userData.isDropZone = true;
    zone.userData.index = i;
    zone.userData.occupiedBy = null;
    dropZones.push(zone);
    dropZonesGroup.add(zone);
  }
}

function createWordBox(word, position, boxSize = 4.0) {
  const wordCanvas = document.createElement("canvas");
  const wordCtx = wordCanvas.getContext("2d");
  wordCanvas.width = 256;
  wordCanvas.height = 256;

  wordCtx.fillStyle = "#c49a6c";
  wordCtx.fillRect(0, 0, 256, 256);
  wordCtx.strokeStyle = "#8b5a2b";
  wordCtx.lineWidth = 8;
  wordCtx.strokeRect(0, 0, 256, 256);

  wordCtx.font = "bold 65px Arial";
  wordCtx.fillStyle = "#1e293b";
  wordCtx.textAlign = "center";
  wordCtx.textBaseline = "middle";
  wordCtx.fillText(word, 128, 128);

  const wordTexture = new THREE.CanvasTexture(wordCanvas);
  const textMaterial = new THREE.MeshStandardMaterial({
    map: wordTexture,
    roughness: 0.7,
  });
  const bottomMaterial = new THREE.MeshStandardMaterial({
    color: "#a8794c",
    roughness: 0.8,
  });

  const materials = [
    textMaterial,
    textMaterial,
    textMaterial,
    bottomMaterial,
    textMaterial,
    textMaterial,
  ];

  const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const box = new THREE.Mesh(boxGeometry, materials);

  box.position.copy(position);
  box.castShadow = true;
  box.receiveShadow = true;

  box.userData.isWordBox = true;
  box.userData.word = word;
  box.userData.boxSize = boxSize; // Сохраняем размер коробки
  box.userData.originalPosition = position.clone();
  box.userData.targetPosition = null;
  box.userData.targetRotation = null;

  wordBoxes.push(box);
  scene.add(box);
}

function clearSentence() {
  wordBoxes.forEach((box) => {
    scene.remove(box);
    dropZonesGroup.remove(box);
    box.geometry.dispose();
    if (Array.isArray(box.material)) {
      box.material.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
  wordBoxes = [];
  dropZones.forEach((zone) => (zone.userData.occupiedBy = null));
}

function loadSentence() {
  clearSentence();
  dropZonesGroup.position.x = 0;

  const sentenceData = gameSentences[currentSentenceIndex];
  const words = [...sentenceData.words].sort(() => Math.random() - 0.5);
  const numWords = words.length;

  createDropZones(numWords);

  const aspect = window.innerWidth / window.innerHeight;

  if (aspect < 0.75) {
    // --- КРУПНАЯ ДВУХРЯДНАЯ РАСКЛАДКА ДЛЯ СМАРТФОНОВ ---
    const boxSize = 5; // Увеличенные коробки
    const itemsPerRow = Math.ceil(numWords / 2);
    const spacingX = 6.0; // Интервал между коробками

    // Позиции рядов по высоте (Y) и глубине (Z)
    const rows = [
      { z: 18, y: 14 }, // Верхний ряд
      { z: 24, y: 9 }, // Нижний ряд (крупно на переднем плане)
    ];

    for (let i = 0; i < numWords; i++) {
      const rowIndex = Math.floor(i / itemsPerRow);
      const colIndex = i % itemsPerRow;

      const countInThisRow =
        rowIndex === 0 ? itemsPerRow : numWords - itemsPerRow;

      const startX = -((countInThisRow - 1) * spacingX) / 2;
      const posX = startX + colIndex * spacingX;
      const rowConfig = rows[rowIndex] || rows[1];

      const pos = new THREE.Vector3(
        posX,
        rowConfig.y,
        rowConfig.z + (Math.random() * 0.4 - 0.2),
      );

      createWordBox(words[i], pos, boxSize);
    }
  } else {
    // --- ОДНОРЯДНАЯ РАСКЛАДКА ДЛЯ ПК И ПЛАНШЕТОВ ---
    const boxSize = 4.0;
    const spacing = 8.0;
    const startX = -((numWords - 1) * spacing) / 2;

    for (let i = 0; i < numWords; i++) {
      const pos = new THREE.Vector3(
        startX + i * spacing,
        24,
        25 + (Math.random() * 2 - 1),
      );
      createWordBox(words[i], pos, boxSize);
    }
  }
}

function loadNextSentence() {
  currentSentenceIndex++;
  updateCounter();
  loadSentence();

  messageEl.classList.remove("show");
  checkButton.style.display = "inline-block";
  nextButton.style.display = "none";
  checkButton.disabled = false;
}

// --- УЛУЧШЕННОЕ ПЕРЕТАСКИВАНИЕ ДЛЯ МОБИЛЬНЫХ ЭКРАНОВ ---
function onPointerDown(event) {
  if (event.target && event.target.setPointerCapture) {
    try {
      event.target.setPointerCapture(event.pointerId);
    } catch (e) {}
  }

  updateMouse(event);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(wordBoxes);

  if (intersects.length > 0) {
    draggedObject = intersects[0].object;

    // Фиксируем время и координаты нажатия для определения короткого тапа
    pointerDownTime = Date.now();
    pointerDownPos = { x: event.clientX, y: event.clientY };

    // Проверяем, стояла ли коробка на конвейере
    wasInZoneOnDown = findZoneWithBox(draggedObject);

    if (draggedObject.parent === dropZonesGroup) {
      scene.attach(draggedObject);
    }

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.setFromNormalAndCoplanarPoint(
      camDir.negate(),
      draggedObject.position,
    );

    draggedObject.userData.targetPosition = new THREE.Vector3(
      draggedObject.position.x,
      draggedObject.position.y + 3,
      draggedObject.position.z,
    );

    draggedObject.userData.targetRotation = new THREE.Euler(
      Math.random() * 0.2 - 0.1,
      Math.random() * 0.2 - 0.1,
      Math.random() * 0.2 - 0.1,
    );

    if (wasInZoneOnDown) {
      wasInZoneOnDown.userData.occupiedBy = null;
    }
  }
}

function onPointerMove(event) {
  if (draggedObject) {
    updateMouse(event);
    raycaster.setFromCamera(mouse, camera);

    if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
      draggedObject.userData.targetPosition.copy(planeIntersect);
    }
  }
}

function onPointerUp(event) {
  if (event && event.target && event.target.releasePointerCapture) {
    try {
      event.target.releasePointerCapture(event.pointerId);
    } catch (e) {}
  }

  if (draggedObject) {
    // Вычисляем смещение и время клика
    const moveDist = Math.hypot(
      event.clientX - pointerDownPos.x,
      event.clientY - pointerDownPos.y,
    );
    const isTap = moveDist < 12 && Date.now() - pointerDownTime < 300;

    if (isTap) {
      // --- РЕЖИМ БЫСТРОГО ТАПА / КЛИКА ---
      if (wasInZoneOnDown) {
        // 1. Если коробка стояла на платформе — при клике ВОЗВРАЩАЕМ её на место внизу
        draggedObject.userData.targetPosition =
          draggedObject.userData.originalPosition.clone();
        draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
      } else {
        // 2. Если коробка стояла внизу — при клике АВТОМАТИЧЕСКИ ставим в первый свободный слот
        const firstEmptyZone = dropZones
          .slice()
          .sort((a, b) => a.userData.index - b.userData.index)
          .find((z) => !z.userData.occupiedBy);

        if (firstEmptyZone) {
          dropZonesGroup.attach(draggedObject);
          const boxSize = draggedObject.userData.boxSize || 4.0;
          const boxY = firstEmptyZone.position.y + boxSize / 2;
          draggedObject.userData.targetPosition = firstEmptyZone.position
            .clone()
            .setY(boxY);
          draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
          firstEmptyZone.userData.occupiedBy = draggedObject;
        } else {
          draggedObject.userData.targetPosition =
            draggedObject.userData.originalPosition.clone();
          draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
        }
      }
    } else {
      // --- РЕЖИМ ПЕРЕТАСКИВАНИЯ (DRAG & DROP) ---
      let closestZone = null;
      let minDistance = Infinity;
      const magnetThreshold = 22.0;

      const draggedPos = new THREE.Vector3();
      draggedObject.getWorldPosition(draggedPos);

      dropZones.forEach((zone) => {
        if (!zone.userData.occupiedBy) {
          const zoneWorldPos = new THREE.Vector3();
          zone.getWorldPosition(zoneWorldPos);

          const dx = draggedPos.x - zoneWorldPos.x;
          const dy = (draggedPos.y - zoneWorldPos.y) * 0.5;
          const dz = draggedPos.z - zoneWorldPos.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < minDistance && distance < magnetThreshold) {
            minDistance = distance;
            closestZone = zone;
          }
        }
      });

      if (closestZone) {
        dropZonesGroup.attach(draggedObject);
        const boxSize = draggedObject.userData.boxSize || 4.0;
        const boxY = closestZone.position.y + boxSize / 2;
        draggedObject.userData.targetPosition = closestZone.position
          .clone()
          .setY(boxY);
        draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
        closestZone.userData.occupiedBy = draggedObject;
      } else {
        // 3. При перетаскивании мимо платформ — возвращаем на исходное место
        draggedObject.userData.targetPosition =
          draggedObject.userData.originalPosition.clone();
        draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
      }
    }

    draggedObject = null;
    wasInZoneOnDown = null;
  }
}
function checkAnswer() {
  const userAnswer = [];
  const sortedZones = [...dropZones].sort(
    (a, b) => a.userData.index - b.userData.index,
  );

  sortedZones.forEach((zone) => {
    if (zone.userData.occupiedBy) {
      userAnswer.push(zone.userData.occupiedBy.userData.word);
    }
  });

  const correctAnswer = gameCorrectAnswers[currentSentenceIndex];
  const isCorrect =
    JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

  if (isCorrect) {
    soundRight.currentTime = 0;
    soundRight.play();

    messageEl.textContent = "Correct! Отличная работа! 🎉";
    messageEl.style.color = "#4ade80";
    checkButton.style.display = "none";

    if (currentSentenceIndex >= totalQuestions - 1) {
      setTimeout(() => {
        endScreen.style.display = "flex";
      }, 1500);
    } else {
      nextButton.style.display = "inline-block";
    }
  } else {
    soundWrong.currentTime = 0;
    soundWrong.play();

    messageEl.textContent = "Oops! Попробуй еще раз.";
    messageEl.style.color = "#f87171";

    setTimeout(() => {
      messageEl.classList.remove("show");
    }, 2000);
  }

  messageEl.classList.add("show");
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function updateMouse(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  adjustCameraForScreen();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function findZoneWithBox(box) {
  return dropZones.find((zone) => zone.userData.occupiedBy === box);
}

// --- ЦИКЛ АНИМАЦИИ ---
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.04;
  const reverseSpeed = 0.2;

  if (conveyor && conveyor.material.map) {
    if (isReversing) {
      conveyor.material.map.offset.x += reverseSpeed * 0.05;
    } else {
      conveyor.material.map.offset.x -= speed * 0.05;
    }
  }

  if (dropZonesGroup) {
    const loopWidth = 130;
    const endX = loopWidth / 2;
    const startX = -loopWidth / 2;

    if (isReversing) {
      dropZonesGroup.position.x -= reverseSpeed;
      if (dropZonesGroup.position.x < startX) {
        dropZonesGroup.position.x = endX;
      }
    } else {
      dropZonesGroup.position.x += speed;
      if (dropZonesGroup.position.x > endX) {
        dropZonesGroup.position.x = startX;
      }
    }
  }

  wordBoxes.forEach((box) => {
    if (box.userData.targetPosition) {
      box.position.lerp(box.userData.targetPosition, 0.2);
    }
    if (box.userData.targetRotation) {
      box.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(box.userData.targetRotation),
        0.2,
      );
    }
  });

  renderer.render(scene, camera);
}

// --- ЗАПУСК ---
init();
