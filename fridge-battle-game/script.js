// --- CONFIGURATION & SOUND CONTROL ---
const useImages = false;
let soundEnabled = true;

// Custom sound links (GitHub Pages)[cite: 1]
const audioRight = new Audio(
  "https://george-stone-pax.github.io/my-game-assets/rightanswer-95219.mp3",
);
const audioWrong = new Audio(
  "https://george-stone-pax.github.io/my-game-assets/dodgeball.mp3",
);

const bgMusicList = [
  "https://george-stone-pax.github.io/my-game-assets/Aylex - Back To Life (freetouse.com).mp3",
  "https://george-stone-pax.github.io/my-game-assets/Aylex - Adrenaline Drive (freetouse.com).mp3",
  "https://george-stone-pax.github.io/my-game-assets/Aylex - Off Road (freetouse.com).mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music1.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music2.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music3.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music4.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music5.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music6.mp3",
  "https://george-stone-pax.github.io/gamesnew/My_music7.mp3",
];

let bgAudio = new Audio();
bgAudio.loop = true;
bgAudio.volume = 0.2;

// --- DATABASE OF FOOD & SPECIAL CELLS ---
const foodDatabase = [
  // Drinks (drinks)
  { name: "Milk", category: "drinks", type: "U", icon: "🥛" },
  { name: "Water", category: "drinks", type: "U", icon: "💧" },
  { name: "Juice", category: "drinks", type: "U", icon: "🧃" },
  { name: "Coffee", category: "drinks", type: "U", icon: "☕" },
  { name: "Tea", category: "drinks", type: "U", icon: "🍵" },

  // Prepared Food & Mains (meals)
  { name: "Bread", category: "meals", type: "U", icon: "🍞" },
  { name: "Egg", category: "meals", type: "C", icon: "🥚" },
  { name: "Cheese", category: "meals", type: "U", icon: "🧀" },
  { name: "Burger", category: "meals", type: "C", icon: "🍔" },
  { name: "Meat", category: "meals", type: "U", icon: "🥩" },
  { name: "Rice", category: "meals", type: "U", icon: "🍚" },
  { name: "Pizza", category: "meals", type: "U", icon: "🍕" },
  { name: "Chicken", category: "meals", type: "U", icon: "🍗" },
  { name: "Cake", category: "meals", type: "C", icon: "🍰" },
  { name: "Fish", category: "meals", type: "U", icon: "🐟" },
  { name: "Cookie", category: "meals", type: "C", icon: "🍪" },
  { name: "Ice Cream", category: "meals", type: "U", icon: "🍦" },
  { name: "Chocolate", category: "meals", type: "U", icon: "🍫" },
  { name: "Salad", category: "meals", type: "U", icon: "🥗" },
  { name: "Soup", category: "meals", type: "U", icon: "🥣" },
  { name: "Sandwich", category: "meals", type: "C", icon: "🥪" },
  { name: "Honey", category: "meals", type: "U", icon: "🍯" },

  // Produce (produce)
  { name: "Apple", category: "produce", type: "C", icon: "🍎" },
  { name: "Banana", category: "produce", type: "C", icon: "🍌" },
  { name: "Carrot", category: "produce", type: "C", icon: "🥕" },
  { name: "Tomato", category: "produce", type: "C", icon: "🍅" },
  { name: "Orange", category: "produce", type: "C", icon: "🍊" },
  { name: "Potato", category: "produce", type: "C", icon: "🥔" },
  { name: "Grapes", category: "produce", type: "C", icon: "🍇" },
  { name: "Melon", category: "produce", type: "C", icon: "🍈" },
  { name: "Lemon", category: "produce", type: "C", icon: "🍋" },
  { name: "Corn", category: "produce", type: "U", icon: "🌽" },
  { name: "Strawberry", category: "produce", type: "C", icon: "🍓" },
  { name: "Peach", category: "produce", type: "C", icon: "🍑" },
  { name: "Pear", category: "produce", type: "C", icon: "🍐" },
  { name: "Onion", category: "produce", type: "C", icon: "🧅" },
];

const specialCells = [
  { name: "Steal Item", isSpecial: true, action: "steal", icon: "🥷" },
  { name: "Swap Item", isSpecial: true, action: "swap", icon: "🔄" },
  { name: "Trash Bin", isSpecial: true, action: "trash", icon: "🗑️" },
];

// --- GAME STATE ---
let boardSize = 6; // 4 or 6
let maxTurns = 5; // 3, 5, 10
let isAiMode = false;

let boardState = [];
let turnCount = 1;
let isPlayerTurn = true; // true = Student, false = Teacher
let playerFridge = [];
let teacherFridge = [];
let isAnimating = false;

let selectedSwapMyIndex = null;
let selectedSwapOpponentIndex = null;

// --- INITIALIZATION & DOM EVENTS ---
document.addEventListener("DOMContentLoaded", () => {
  setupSettingsListeners();
  setupGameListeners();
  setupVolumeControl();
  setupFullscreen();
});

function setupSettingsListeners() {
  document.getElementById("mode-p2p")?.addEventListener("click", (e) => {
    setBtnActive(".mode-btn", e.currentTarget);
    isAiMode = false;
    const label = document.getElementById("p2-name-label");
    if (label) label.textContent = "👓 2 Player's Fridge";
  });
  document.getElementById("mode-ai")?.addEventListener("click", (e) => {
    setBtnActive(".mode-btn", e.currentTarget);
    isAiMode = true;
    const label = document.getElementById("p2-name-label");
    if (label) label.textContent = "🤖 Teacher AI's Fridge";
  });

  document.getElementById("size-4")?.addEventListener("click", (e) => {
    setBtnActive(".size-btn", e.currentTarget);
    boardSize = 4;
  });
  document.getElementById("size-6")?.addEventListener("click", (e) => {
    setBtnActive(".size-btn", e.currentTarget);
    boardSize = 6;
  });

  document.getElementById("turns-3")?.addEventListener("click", (e) => {
    setBtnActive(".turns-btn", e.currentTarget);
    maxTurns = 3;
  });
  document.getElementById("turns-5")?.addEventListener("click", (e) => {
    setBtnActive(".turns-btn", e.currentTarget);
    maxTurns = 5;
  });
  document.getElementById("turns-10")?.addEventListener("click", (e) => {
    setBtnActive(".turns-btn", e.currentTarget);
    maxTurns = 10;
  });

  document.getElementById("start-game-btn")?.addEventListener("click", () => {
    document.getElementById("settings-modal")?.classList.add("hidden");
    startRandomBgMusic();
    initGame();
  });
}

function setBtnActive(selector, target) {
  document.querySelectorAll(selector).forEach((btn) => {
    btn.classList.remove(
      "active",
      "bg-indigo-600",
      "text-white",
      "border-indigo-700",
    );
    btn.classList.add("bg-slate-100", "text-slate-700", "border-slate-200");
  });
  target.classList.add(
    "active",
    "bg-indigo-600",
    "text-white",
    "border-indigo-700",
  );
  target.classList.remove("bg-slate-100", "text-slate-700", "border-slate-200");
}

function setupGameListeners() {
  document.getElementById("roll-btn")?.addEventListener("click", playTurn);
  document
    .getElementById("sound-toggle-btn")
    ?.addEventListener("click", toggleSound);

  // Кнопка показать списки
  document
    .getElementById("reveal-answer-btn")
    ?.addEventListener("click", () => {
      document
        .getElementById("final-lists-wrapper")
        ?.classList.remove("hidden");
      document.getElementById("reveal-answer-btn")?.classList.add("hidden");
    });

  // Кнопка Проверить ответы
  document
    .getElementById("check-answers-btn")
    ?.addEventListener("click", checkAnswers);

  document.getElementById("restart-game-btn")?.addEventListener("click", () => {
    const finalModal = document.getElementById("final-modal");
    if (finalModal) {
      finalModal.classList.add("hidden");
      finalModal.classList.remove("flex");
    }
    document.getElementById("settings-modal")?.classList.remove("hidden");
  });
}

// Volume Controls
function setupVolumeControl() {
  const volumeSlider = document.getElementById("volume-slider");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      bgAudio.volume = val;
      soundEnabled = val > 0;
      const soundBtn = document.getElementById("sound-toggle-btn");
      if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
    });
  }
}

// Fullscreen Toggle
function setupFullscreen() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("sound-toggle-btn");
  if (btn) btn.textContent = soundEnabled ? "🔊" : "🔇";

  const volumeSlider = document.getElementById("volume-slider");
  if (soundEnabled) {
    bgAudio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.2;
  } else {
    bgAudio.volume = 0;
  }
}

function startRandomBgMusic() {
  const randomTrack =
    bgMusicList[Math.floor(Math.random() * bgMusicList.length)];
  bgAudio.src = randomTrack;
  if (soundEnabled) {
    bgAudio.play().catch(() => {});
  }
}

function playEffect(audio) {
  if (soundEnabled) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function speakWord(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// --- GAME LOGIC ---
function initGame() {
  const totalCells = boardSize * boardSize;
  const numSpecials = boardSize === 4 ? 3 : 5;

  let shuffledFood = [...foodDatabase].sort(() => 0.5 - Math.random());
  let selectedFood = shuffledFood.slice(0, totalCells - numSpecials);

  let specialsToInsert = [];
  for (let i = 0; i < numSpecials; i++) {
    specialsToInsert.push(specialCells[i % specialCells.length]);
  }

  boardState = [...selectedFood, ...specialsToInsert].sort(
    () => 0.5 - Math.random(),
  );

  turnCount = 1;
  playerFridge = [];
  teacherFridge = [];
  isPlayerTurn = true;
  isAnimating = false;

  const turnCounter = document.getElementById("turn-counter");
  const maxTurnsDisplay = document.getElementById("max-turns-display");
  if (turnCounter) turnCounter.textContent = turnCount;
  if (maxTurnsDisplay) maxTurnsDisplay.textContent = maxTurns;

  renderBoard();
  clearFridgesUI();
  updateTurnIndicator();
}

function clearFridgesUI() {
  document
    .querySelectorAll(".shelf-items")
    .forEach((el) => (el.innerHTML = ""));
}

function renderBoard() {
  const boardEl = document.getElementById("game-board");
  if (!boardEl) return;

  boardEl.innerHTML = "";

  const gridClass = boardSize === 4 ? "grid-cols-4" : "grid-cols-6";
  boardEl.className = `grid ${gridClass} gap-1 md:gap-2 w-full max-w-[92vw] sm:max-w-md md:max-w-lg aspect-square bg-white p-2 md:p-3 rounded-2xl shadow-xl border-2 md:border-4 border-indigo-200 transition-all duration-300`;

  const textSize =
    boardSize === 4 ? "text-[10px] sm:text-xs" : "text-[8px] sm:text-[10px]";
  const iconSize =
    boardSize === 4 ? "text-xl sm:text-3xl" : "text-base sm:text-2xl";

  boardState.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className =
      "cell bg-white border border-indigo-100 rounded-lg md:rounded-xl flex flex-col items-center justify-center p-0.5 md:p-1 cursor-default relative overflow-hidden shadow-sm transition-transform hover:scale-105";
    cell.id = `cell-${index}`;

    const coords = document.createElement("span");
    const row = Math.floor(index / boardSize) + 1;
    const col = (index % boardSize) + 1;
    coords.className =
      "absolute top-0.5 left-1 text-[8px] sm:text-[9px] text-slate-300 font-mono font-bold leading-none";
    coords.textContent = `${row}:${col}`;
    cell.appendChild(coords);

    const contentDiv = document.createElement("div");
    contentDiv.className =
      "flex flex-col items-center justify-center text-center z-10 w-full h-full";

    if (item.isSpecial) {
      contentDiv.innerHTML = `
        <span class="${iconSize}">${item.icon}</span>
        <span class="font-extrabold text-amber-600 truncate w-full ${textSize} mt-0.5">${item.name}</span>
      `;
    } else {
      contentDiv.innerHTML = `
        <span class="${iconSize}">${item.icon}</span>
        <span class="font-bold text-slate-700 truncate w-full ${textSize} mt-0.5">${item.name}</span>
      `;
    }

    cell.appendChild(contentDiv);
    boardEl.appendChild(cell);
  });
}

function playTurn() {
  if (isAnimating) return;
  isAnimating = true;

  const btn = document.getElementById("roll-btn");
  if (btn) {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }

  const rollRow = Math.floor(Math.random() * boardSize) + 1;
  const rollCol = Math.floor(Math.random() * boardSize) + 1;
  const index = (rollRow - 1) * boardSize + (rollCol - 1);
  const selectedItem = boardState[index];

  const diceDisplay = document.getElementById("dice-display");
  const diceCoords = document.getElementById("dice-coords");
  if (diceDisplay) diceDisplay.classList.remove("hidden");

  let frames = 0;
  const maxFrames = 10;

  const animInterval = setInterval(() => {
    const r = Math.floor(Math.random() * boardSize) + 1;
    const c = Math.floor(Math.random() * boardSize) + 1;
    if (diceCoords) diceCoords.textContent = `${r}:${c}`;
    frames++;

    if (frames >= maxFrames) {
      clearInterval(animInterval);
      if (diceCoords) diceCoords.textContent = `${rollRow}:${rollCol}`;
      executeMove(index, selectedItem);
    }
  }, 80);
}

function executeMove(index, selectedItem) {
  const cell = document.getElementById(`cell-${index}`);
  if (cell) cell.classList.add("ring-4", "ring-amber-400", "scale-105", "z-20");

  showToast(selectedItem);
  if (!selectedItem.isSpecial) {
    speakWord(selectedItem.name);
  }

  setTimeout(() => {
    if (cell)
      cell.classList.remove("ring-4", "ring-amber-400", "scale-105", "z-20");
    const diceDisplay = document.getElementById("dice-display");
    if (diceDisplay) diceDisplay.classList.add("hidden");

    if (selectedItem.isSpecial) {
      handleSpecialAction(selectedItem);
    } else {
      animateItemFly(
        cell,
        selectedItem,
        isPlayerTurn ? "student" : "teacher",
        () => {
          addToFridge(selectedItem, isPlayerTurn ? "player" : "teacher");
          finishTurn();
        },
      );
    }
  }, 1200);
}

// Flying Animation
function animateItemFly(sourceEl, item, targetType, callback) {
  if (!sourceEl) {
    if (callback) callback();
    return;
  }
  const sourceRect = sourceEl.getBoundingClientRect();
  let targetEl;

  if (targetType === "trash") {
    targetEl = document.getElementById("trash-bin");
  } else {
    const fridgeId =
      targetType === "student" ? "student-fridge" : "teacher-fridge";
    const shelfContainer = document.querySelector(
      `#${fridgeId} [data-shelf="${item.category}"]`,
    );
    targetEl = shelfContainer || document.getElementById(fridgeId);
  }

  const targetRect = targetEl ? targetEl.getBoundingClientRect() : sourceRect;

  const flyingClone = document.createElement("div");
  flyingClone.className =
    "fixed z-50 flex items-center justify-center bg-white rounded-2xl shadow-2xl border-2 border-indigo-400 p-1 text-2xl md:text-3xl pointer-events-none transition-all duration-700 ease-in-out";
  flyingClone.innerHTML = item.icon;
  flyingClone.style.left = `${sourceRect.left}px`;
  flyingClone.style.top = `${sourceRect.top}px`;
  flyingClone.style.width = `${sourceRect.width}px`;
  flyingClone.style.height = `${sourceRect.height}px`;

  document.body.appendChild(flyingClone);

  requestAnimationFrame(() => {
    flyingClone.style.left = `${targetRect.left + targetRect.width / 2 - 20}px`;
    flyingClone.style.top = `${targetRect.top + targetRect.height / 2 - 20}px`;
    flyingClone.style.width = "40px";
    flyingClone.style.height = "40px";
    flyingClone.style.transform = "rotate(360deg) scale(0.8)";
    flyingClone.style.opacity = "0.9";
  });

  setTimeout(() => {
    flyingClone.remove();
    playEffect(audioRight);
    if (callback) callback();
  }, 700);
}

// Special Actions
function handleSpecialAction(item) {
  const curPlayer = isPlayerTurn
    ? "Student"
    : isAiMode
      ? "Teacher AI"
      : "Teacher";
  const myFridge = isPlayerTurn ? playerFridge : teacherFridge;
  const oppFridge = isPlayerTurn ? teacherFridge : playerFridge;

  if (item.action === "steal") {
    if (oppFridge.length === 0) {
      alert(`${curPlayer} rolled Steal, but opponent fridge is empty!`);
      finishTurn();
      return;
    }
    if (isPlayerTurn || !isAiMode) {
      openActionModal(
        "Steal Item 🥷",
        "Выберите предмет у соперника, который хотите украсть:",
        oppFridge,
        (stolenIndex) => {
          const stolenItem = oppFridge.splice(stolenIndex, 1)[0];
          myFridge.push(stolenItem);
          rebuildFridgesUI();
          finishTurn();
        },
      );
    } else {
      const randomIndex = Math.floor(Math.random() * oppFridge.length);
      const stolenItem = oppFridge.splice(randomIndex, 1)[0];
      myFridge.push(stolenItem);
      rebuildFridgesUI();
      finishTurn();
    }
  } else if (item.action === "trash") {
    if (myFridge.length === 0) {
      alert(`${curPlayer} rolled Trash, but your fridge is empty!`);
      finishTurn();
      return;
    }
    if (isPlayerTurn || !isAiMode) {
      openActionModal(
        "Trash Bin 🗑️",
        "Выберите свой предмет, который нужно выбросить в мусорку:",
        myFridge,
        (trashedIndex) => {
          const trashedItem = myFridge.splice(trashedIndex, 1)[0];
          const trashBin = document.getElementById("trash-bin");
          animateItemFly(trashBin, trashedItem, "trash", () => {
            playEffect(audioWrong);
            rebuildFridgesUI();
            finishTurn();
          });
        },
      );
    } else {
      const randomIndex = Math.floor(Math.random() * myFridge.length);
      const trashedItem = myFridge.splice(randomIndex, 1)[0];
      playEffect(audioWrong);
      rebuildFridgesUI();
      finishTurn();
    }
  } else if (item.action === "swap") {
    if (myFridge.length === 0 || oppFridge.length === 0) {
      alert(`${curPlayer} rolled Swap, but one of the fridges is empty!`);
      finishTurn();
      return;
    }
    if (isPlayerTurn || !isAiMode) {
      openSwapModal(myFridge, oppFridge, (myIndex, oppIndex) => {
        const myItem = myFridge[myIndex];
        const oppItem = oppFridge[oppIndex];
        myFridge[myIndex] = oppItem;
        oppFridge[oppIndex] = myItem;
        rebuildFridgesUI();
        finishTurn();
      });
    } else {
      const myRandIndex = Math.floor(Math.random() * myFridge.length);
      const oppRandIndex = Math.floor(Math.random() * oppFridge.length);
      const myItem = myFridge[myRandIndex];
      const oppItem = oppFridge[oppRandIndex];
      myFridge[myRandIndex] = oppItem;
      oppFridge[oppRandIndex] = myItem;
      rebuildFridgesUI();
      finishTurn();
    }
  }
}

function openActionModal(title, desc, items, onSelectCallback) {
  const modal = document.getElementById("action-modal");
  if (!modal) return;

  document.getElementById("action-modal-title").textContent = title;
  document.getElementById("action-modal-desc").textContent = desc;

  const container = document.getElementById("action-items-container");
  container.innerHTML = "";

  items.forEach((item, idx) => {
    const itemBtn = document.createElement("button");
    itemBtn.className =
      "flex flex-col items-center justify-center bg-white border-2 border-slate-200 hover:border-amber-400 p-2 rounded-xl transition shadow-sm";
    itemBtn.innerHTML = `<span class="text-2xl sm:text-3xl">${item.icon}</span><span class="text-[10px] font-bold text-slate-700 mt-1">${item.name}</span>`;
    itemBtn.onclick = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      onSelectCallback(idx);
    };
    container.appendChild(itemBtn);
  });

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function openSwapModal(myFridge, oppFridge, onSwapCallback) {
  selectedSwapMyIndex = null;
  selectedSwapOpponentIndex = null;

  const modal = document.getElementById("action-modal");
  if (!modal) return;

  document.getElementById("action-modal-title").textContent = "Swap Item 🔄";
  document.getElementById("action-modal-desc").textContent =
    "Выберите один свой предмет и один предмет соперника для обмена:";

  const container = document.getElementById("action-items-container");
  container.innerHTML = "";

  const confirmBtn = document.getElementById("confirm-action-btn");
  if (confirmBtn) confirmBtn.classList.add("hidden");

  const wrapper = document.createElement("div");
  wrapper.className = "col-span-3 flex flex-col gap-3 w-full";

  // My Items
  const myTitle = document.createElement("div");
  myTitle.className = "font-bold text-xs text-emerald-700 uppercase";
  myTitle.textContent = "Мой холодильник:";
  wrapper.appendChild(myTitle);

  const myGrid = document.createElement("div");
  myGrid.className = "grid grid-cols-3 gap-2";
  myFridge.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className =
      "swap-my-btn flex flex-col items-center justify-center bg-white border-2 border-emerald-200 p-2 rounded-xl";
    btn.innerHTML = `<span class="text-2xl">${item.icon}</span><span class="text-[10px] font-bold">${item.name}</span>`;
    btn.onclick = () => {
      document
        .querySelectorAll(".swap-my-btn")
        .forEach((b) =>
          b.classList.remove("border-emerald-500", "bg-emerald-100"),
        );
      btn.classList.add("border-emerald-500", "bg-emerald-100");
      selectedSwapMyIndex = idx;
      checkSwapReady(confirmBtn);
    };
    myGrid.appendChild(btn);
  });
  wrapper.appendChild(myGrid);

  // Opponent Items
  const oppTitle = document.createElement("div");
  oppTitle.className = "font-bold text-xs text-rose-700 uppercase mt-2";
  oppTitle.textContent = "Холодильник соперника:";
  wrapper.appendChild(oppTitle);

  const oppGrid = document.createElement("div");
  oppGrid.className = "grid grid-cols-3 gap-2";
  oppFridge.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className =
      "swap-opp-btn flex flex-col items-center justify-center bg-white border-2 border-rose-200 p-2 rounded-xl";
    btn.innerHTML = `<span class="text-2xl">${item.icon}</span><span class="text-[10px] font-bold">${item.name}</span>`;
    btn.onclick = () => {
      document
        .querySelectorAll(".swap-opp-btn")
        .forEach((b) => b.classList.remove("border-rose-500", "bg-rose-100"));
      btn.classList.add("border-rose-500", "bg-rose-100");
      selectedSwapOpponentIndex = idx;
      checkSwapReady(confirmBtn);
    };
    oppGrid.appendChild(btn);
  });
  wrapper.appendChild(oppGrid);

  container.appendChild(wrapper);

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (selectedSwapMyIndex !== null && selectedSwapOpponentIndex !== null) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        onSwapCallback(selectedSwapMyIndex, selectedSwapOpponentIndex);
      }
    };
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function checkSwapReady(confirmBtn) {
  if (
    confirmBtn &&
    selectedSwapMyIndex !== null &&
    selectedSwapOpponentIndex !== null
  ) {
    confirmBtn.classList.remove("hidden");
  }
}

// --- FRIDGE STORAGE & RENDERING ---
function addToFridge(item, who) {
  if (who === "player") playerFridge.push(item);
  else teacherFridge.push(item);
  rebuildFridgesUI();
}

function rebuildFridgesUI() {
  clearFridgesUI();

  playerFridge.forEach((item) => {
    renderItemInFridge("student-fridge", item);
  });

  teacherFridge.forEach((item) => {
    renderItemInFridge("teacher-fridge", item);
  });
}

function renderItemInFridge(fridgeId, item) {
  const shelfEl = document.querySelector(
    `#${fridgeId} [data-shelf="${item.category}"] .shelf-items`,
  );
  if (!shelfEl) return;

  const itemEl = document.createElement("div");
  itemEl.className =
    "bg-white rounded-lg border border-slate-200 p-1 flex flex-col items-center justify-center shadow-sm h-10 md:h-12 transition-transform hover:scale-105";
  itemEl.innerHTML = `
    <span class="text-sm md:text-base leading-none">${item.icon}</span>
    <span class="font-semibold text-slate-700 truncate w-full text-center text-[8px] md:text-[9px] mt-0.5">${item.name}</span>
  `;
  shelfEl.appendChild(itemEl);
}

// --- TURN CONTROL ---
function finishTurn() {
  if (!isPlayerTurn) {
    turnCount++;
    const turnCounter = document.getElementById("turn-counter");
    if (turnCounter) turnCounter.textContent = Math.min(turnCount, maxTurns);
  }

  if (turnCount > maxTurns && isPlayerTurn === false) {
    endGame();
  } else {
    isPlayerTurn = !isPlayerTurn;
    updateTurnIndicator();
    isAnimating = false;

    if (!isPlayerTurn && isAiMode) {
      setTimeout(() => {
        playTurn();
      }, 1000);
    }
  }
}

function updateTurnIndicator() {
  const btn = document.getElementById("roll-btn");
  const p1Panel = document.getElementById("p1-panel");
  const p2Panel = document.getElementById("p2-panel");
  const p1Status = document.getElementById("p1-status");
  const p2Status = document.getElementById("p2-status");

  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove(
    "opacity-50",
    "cursor-not-allowed",
    "bg-emerald-500",
    "bg-rose-500",
    "hover:bg-emerald-600",
    "hover:bg-rose-600",
    "border-emerald-700",
    "border-rose-700",
  );

  if (isPlayerTurn) {
    btn.textContent = "Student's Turn: Roll! 🎲";
    btn.classList.add(
      "bg-emerald-500",
      "hover:bg-emerald-600",
      "border-emerald-700",
    );
    if (p1Panel) {
      p1Panel.classList.add("bg-emerald-50/50");
      p1Panel.classList.remove("bg-slate-50");
    }
    if (p1Status) p1Status.classList.remove("hidden");
    if (p2Panel) {
      p2Panel.classList.add("bg-slate-50");
      p2Panel.classList.remove("bg-rose-50/50");
    }
    if (p2Status) p2Status.classList.add("hidden");
  } else {
    btn.textContent = isAiMode
      ? "Teacher AI Thinking... 🤖"
      : "Teacher's Turn: Roll! 🎲";
    btn.classList.add("bg-rose-500", "hover:bg-rose-600", "border-rose-700");
    if (p1Panel) {
      p1Panel.classList.add("bg-slate-50");
      p1Panel.classList.remove("bg-emerald-50/50");
    }
    if (p1Status) p1Status.classList.add("hidden");
    if (p2Panel) {
      p2Panel.classList.add("bg-rose-50/50");
      p2Panel.classList.remove("bg-slate-50");
    }
    if (p2Status) p2Status.classList.remove("hidden");
  }
}

function showToast(item) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const iconEl = document.getElementById("toast-icon");
  const titleEl = document.getElementById("toast-title");
  if (iconEl) iconEl.textContent = item.icon;
  if (titleEl) titleEl.textContent = item.name;

  toast.classList.remove("opacity-0", "scale-50");
  toast.classList.add("opacity-100", "scale-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100", "scale-100");
    toast.classList.add("opacity-0", "scale-50");
  }, 1100);
}

// --- GAME OVER & FINAL LISTS / ANSWER CHECKING ---
function endGame() {
  const modal = document.getElementById("final-modal");
  const studentContainer = document.getElementById("final-student-items");
  const teacherContainer = document.getElementById("final-teacher-items");

  if (!modal || !studentContainer || !teacherContainer) return;

  studentContainer.innerHTML = "";
  teacherContainer.innerHTML = "";

  const teacherTitle = document.getElementById("final-teacher-title");
  if (teacherTitle) {
    teacherTitle.textContent = isAiMode
      ? "🤖 Teacher AI's Items"
      : "👓 2 Player's Items";
  }

  document.getElementById("final-lists-wrapper")?.classList.add("hidden");
  document.getElementById("reveal-answer-btn")?.classList.remove("hidden");

  // Сбрасываем блок результатов проверки
  const checkResultDiv = document.getElementById("check-results-container");
  if (checkResultDiv) {
    checkResultDiv.innerHTML = "";
    checkResultDiv.classList.add("hidden");
  }

  if (playerFridge.length === 0) {
    studentContainer.innerHTML =
      '<div class="col-span-3 text-slate-400 italic text-xs">Fridge is empty!</div>';
  } else {
    playerFridge.forEach((item) => {
      studentContainer.appendChild(createFinalItemBadge(item));
    });
  }

  if (teacherFridge.length === 0) {
    teacherContainer.innerHTML =
      '<div class="col-span-3 text-slate-400 italic text-xs">Fridge is empty!</div>';
  } else {
    teacherFridge.forEach((item) => {
      teacherContainer.appendChild(createFinalItemBadge(item));
    });
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function createFinalItemBadge(item) {
  const badge = document.createElement("div");
  badge.className =
    "bg-white rounded-xl border border-slate-200 p-1 flex flex-col items-center justify-center shadow-sm";
  const typeLabel =
    item.type === "C"
      ? '<span class="text-[7px] md:text-[8px] bg-emerald-100 text-emerald-700 px-1 rounded font-bold mt-0.5">Countable</span>'
      : '<span class="text-[7px] md:text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold mt-0.5">Uncountable</span>';

  badge.innerHTML = `
    <span class="text-lg md:text-xl">${item.icon}</span>
    <span class="font-bold text-slate-700 text-[9px] md:text-[10px] mt-0.5 truncate">${item.name}</span>
    ${typeLabel}
  `;
  return badge;
}

// Функция проверки ответов
function checkAnswers() {
  const container = document.getElementById("check-results-container");
  if (!container) return;

  const getStats = (items) => {
    const countable = items.filter((i) => i.type === "C");
    const uncountable = items.filter((i) => i.type === "U");
    return {
      cCount: countable.length,
      uCount: uncountable.length,
      cNames: countable.map((i) => i.name).join(", ") || "None",
      uNames: uncountable.map((i) => i.name).join(", ") || "None",
    };
  };

  const pStats = getStats(playerFridge);
  const tStats = getStats(teacherFridge);

  playEffect(audioRight);

  container.innerHTML = `
    <div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 md:p-4 text-left text-xs md:text-sm text-slate-700 flex flex-col gap-2.5">
      <h4 class="font-extrabold text-indigo-900 text-center text-sm md:text-base border-b border-indigo-200 pb-1.5">📊 Grammar Summary / Проверка Ответов</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <p class="font-bold text-emerald-700 text-xs md:text-sm mb-1">🎓 Student's Fridge:</p>
          <p>• <b>Countable (${pStats.cCount}):</b> ${pStats.cNames}</p>
          <p>• <b>Uncountable (${pStats.uCount}):</b> ${pStats.uNames}</p>
        </div>

        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <p class="font-bold text-rose-700 text-xs md:text-sm mb-1">${isAiMode ? "🤖 Teacher AI's Fridge" : "👓 2 Player's Fridge"}:</p>
          <p>• <b>Countable (${tStats.cCount}):</b> ${tStats.cNames}</p>
          <p>• <b>Uncountable (${tStats.uCount}):</b> ${tStats.uNames}</p>
        </div>
      </div>
    </div>
  `;

  container.classList.remove("hidden");
}
