// --- КОНФИГУРАЦИЯ ---
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// --- СОСТОЯНИЕ ---
let state = {
    selectedLetters: [],
    currentInput: "",
    history: [],
    score: 0,
    timer: 90,
    intervalId: null,
    isPlaying: false,
    settings: {
        letterCount: 10,
        duration: 90,
        volume: 0.5
    }
};

// --- DOM ЭЛЕМЕНТЫ ---
const els = {
    // Экраны
    screens: {
        selection: document.getElementById('selection-screen'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over-screen')
    },
    
    // Настройки
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
    timerSelect: document.getElementById('timer-select'),
    letterCountSelect: document.getElementById('letter-count-select'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeDisplay: document.getElementById('volume-display'),
    
    // Аудио
    audio: {
        bg: document.getElementById('bg-music'),
        correct: document.getElementById('sound-correct'),
        wrong: document.getElementById('sound-wrong')
    },

    // Выбор букв
    grid: document.getElementById('alphabet-grid'),
    counter: document.getElementById('counter'),
    targetCountDisplay: document.getElementById('target-count-display'),
    totalCountUi: document.getElementById('total-count-ui'),
    counterContainer: document.getElementById('counter-container'),
    startBtn: document.getElementById('start-btn'),
    warning: document.getElementById('vowel-warning'),
    
    // Геймплей
    deck: document.getElementById('deck-container'),
    input: document.getElementById('word-input'),
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    history: document.getElementById('word-history'),
    message: document.getElementById('message-area'),
    submitBtn: document.getElementById('submit-btn'),
    clearBtn: document.getElementById('clear-btn'),
    
    // Конец игры
    finalScore: document.getElementById('final-score'),
    finalCount: document.getElementById('final-count'),
    badge: document.getElementById('words-count-badge')
};

// --- ИНИЦИАЛИЗАЦИЯ ---
function init() {
    renderAlphabetGrid();
    setupEventListeners();
    updateSettingsUI();
    setInitialVolume();
}

function setupEventListeners() {
    // Настройки
    els.settingsBtn.onclick = () => els.settingsModal.classList.remove('hidden');
    els.closeSettingsBtn.onclick = () => els.settingsModal.classList.add('hidden');
    
    els.fullscreenToggle.onclick = toggleFullScreen;
    
    els.timerSelect.onchange = (e) => {
        state.settings.duration = parseInt(e.target.value);
        if (!state.isPlaying) {
            state.timer = state.settings.duration;
            els.timer.textContent = state.timer;
        }
    };
    
    els.letterCountSelect.onchange = (e) => {
        state.settings.letterCount = parseInt(e.target.value);
        // Если выбрали меньше букв, чем уже было накликано - обрезаем массив
        if (state.selectedLetters.length > state.settings.letterCount) {
            state.selectedLetters = state.selectedLetters.slice(0, state.settings.letterCount);
        }
        updateSelectionUI();
        updateSettingsUI(); // Обновляем тексты
        
        // Снимаем выделение с лишних кнопок
        Array.from(els.grid.children).forEach(btn => {
            if (!state.selectedLetters.includes(btn.textContent)) {
                btn.classList.remove('selected');
            }
        });
    };
    
    els.volumeSlider.oninput = (e) => {
        const val = parseFloat(e.target.value);
        state.settings.volume = val;
        els.volumeDisplay.textContent = Math.round(val * 100) + '%';
        setInitialVolume(); // Применяем громкость ко всем аудио
    };

    // Игровые события
    els.startBtn.onclick = startGame;
    els.submitBtn.onclick = submitWord;
    els.clearBtn.onclick = clearInput;
    document.addEventListener('keydown', handleGlobalKeydown);
}

// --- ЗВУК И ПОЛНОЭКРАННЫЙ РЕЖИМ ---
function setInitialVolume() {
    els.audio.bg.volume = state.settings.volume;
    els.audio.correct.volume = state.settings.volume;
    els.audio.wrong.volume = state.settings.volume;
}

function playSound(type) {
    if (state.settings.volume > 0) {
        // Сбрасываем время, чтобы звук мог проигрываться быстро подряд
        els.audio[type].currentTime = 0; 
        els.audio[type].play().catch(e => console.log('Audio play error:', e));
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        els.fullscreenToggle.textContent = "Выключить";
        els.fullscreenToggle.classList.replace('bg-slate-700', 'bg-cyan-700');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        els.fullscreenToggle.textContent = "Включить";
        els.fullscreenToggle.classList.replace('bg-cyan-700', 'bg-slate-700');
    }
}

// --- ЭКРАН ВЫБОРА БУКВ ---
function renderAlphabetGrid() {
    els.grid.innerHTML = '';
    ALPHABET.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = `letter-btn h-12 rounded bg-slate-800 text-slate-300 font-tech text-xl font-bold active:scale-95 touch-manipulation`;
        btn.textContent = letter;
        btn.onclick = () => toggleLetterSelection(letter, btn);
        els.grid.appendChild(btn);
    });
}

function toggleLetterSelection(letter, btn) {
    if (state.selectedLetters.includes(letter)) {
        state.selectedLetters = state.selectedLetters.filter(l => l !== letter);
        btn.classList.remove('selected');
    } else {
        if (state.selectedLetters.length < state.settings.letterCount) {
            state.selectedLetters.push(letter);
            btn.classList.add('selected');
        }
    }
    updateSelectionUI();
}

function updateSettingsUI() {
    els.targetCountDisplay.textContent = state.settings.letterCount;
    els.totalCountUi.textContent = state.settings.letterCount;
}

function updateSelectionUI() {
    const count = state.selectedLetters.length;
    const max = state.settings.letterCount;
    
    els.counter.textContent = count;
    els.startBtn.disabled = count !== max;
    
    // Визуальная подсказка о готовности
    if (count === max) {
        els.counterContainer.classList.add('border-cyan-400', 'bg-cyan-900/50');
        els.counter.classList.add('text-white');
    } else {
        els.counterContainer.classList.remove('border-cyan-400', 'bg-cyan-900/50');
        els.counter.classList.remove('text-white');
    }

    // Блокировка остальных кнопок
    Array.from(els.grid.children).forEach(btn => {
        if (!btn.classList.contains('selected')) {
            btn.disabled = count >= max;
        }
    });

    // Проверка на наличие гласных
    const hasVowel = state.selectedLetters.some(l => ['A','E','I','O','U'].includes(l));
    els.warning.style.opacity = (count > 0 && !hasVowel) ? '1' : '0';
}

// --- ИГРОВОЙ ПРОЦЕСС ---
function startGame() {
    state.isPlaying = true;
    state.timer = state.settings.duration;
    els.timer.textContent = state.timer;
    els.timer.classList.remove('text-red-500', 'animate-pulse'); // Сброс стилей таймера, если это рестарт
    
    els.screens.selection.classList.add('hidden');
    els.screens.game.classList.remove('hidden');
    els.screens.game.classList.add('flex');

    // Включаем музыку на фоне
    if (state.settings.volume > 0) {
        els.audio.bg.play().catch(e => console.log('Audio autoplay prevented'));
    }

    renderGameDeck();
    
    state.intervalId = setInterval(() => {
        state.timer--;
        els.timer.textContent = state.timer;
        if (state.timer <= 10 && state.timer > 0) {
            els.timer.classList.add('text-red-500', 'animate-pulse');
        }
        if (state.timer <= 0) endGame();
    }, 1000);
}

function renderGameDeck() {
    els.deck.innerHTML = '';
    // Сортировка по алфавиту для удобства
    const sorted = [...state.selectedLetters].sort();
    
    // Адаптивная сетка в зависимости от количества выбранных букв
    let colsClass = 'grid-cols-5'; // По умолчанию для 10
    if (state.settings.letterCount === 8) colsClass = 'grid-cols-4';
    if (state.settings.letterCount === 12) colsClass = 'grid-cols-4 md:grid-cols-6';
    if (state.settings.letterCount === 15) colsClass = 'grid-cols-5';
    
    els.deck.className = `grid gap-2 md:gap-4 w-full justify-center ${colsClass}`;
    
    sorted.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = "relative w-full h-14 md:h-20 bg-slate-800 border-b-4 border-slate-950 rounded-lg text-2xl md:text-3xl font-tech font-bold text-slate-200 active:border-b-0 active:translate-y-1 transition-all touch-manipulation";
        btn.textContent = letter;
        
        // Декоративная точка на кнопке
        const corner = document.createElement('div');
        corner.className = "absolute top-1 left-1 w-1 h-1 bg-slate-600 rounded-full";
        btn.appendChild(corner);

        btn.onclick = (e) => {
            e.preventDefault(); // Предотвращаем zoom на мобильных при двойном тапе
            inputLetter(letter);
            
            // Легкая анимация нажатия
            btn.style.backgroundColor = '#334155';
            setTimeout(() => btn.style.backgroundColor = '', 100);
        };
        els.deck.appendChild(btn);
    });
}

function inputLetter(char) {
    if (!state.isPlaying || state.currentInput.length >= 15) return;
    state.currentInput += char;
    updateInputUI();
}

function updateInputUI() {
    els.input.value = state.currentInput;
}

function clearInput() {
    state.currentInput = "";
    updateInputUI();
}

function submitWord() {
    const word = state.currentInput;
    if (!word) return;
    
    if (word.length < 2) {
        showMessage("Слишком коротко!", "text-pink-500");
        shakeInput();
        playSound('wrong');
        return;
    }
    
    if (state.history.includes(word)) {
        showMessage("Уже было!", "text-yellow-500");
        shakeInput();
        playSound('wrong');
        return;
    }

    // Успешный ввод
    playSound('correct');
    
    const pts = word.length * 10 + (word.length >= 5 ? 50 : 0);
    state.score += pts;
    state.history.unshift(word);
    
    // Обновление UI
    els.score.textContent = state.score;
    els.badge.textContent = state.history.length;
    
    // Добавление в визуальную историю
    if (state.history.length === 1) els.history.innerHTML = '';
    
    const row = document.createElement('div');
    row.className = "flex justify-between items-center bg-slate-800/50 p-2 rounded animate-[success-pulse_0.3s]";
    row.innerHTML = `<span class="font-tech text-slate-200">${word}</span> <span class="text-cyan-400 text-xs">+${pts}</span>`;
    els.history.prepend(row);

    showFloatingScore(pts);
    
    els.input.classList.add('success-anim');
    setTimeout(() => els.input.classList.remove('success-anim'), 300);
    
    clearInput();
}

// --- УТИЛИТЫ И АНИМАЦИИ ---
function showMessage(txt, color) {
    els.message.textContent = txt;
    // Сбрасываем классы цвета, оставляя базовые
    els.message.className = `h-5 text-center text-xs md:text-sm font-bold mt-2 transition-opacity opacity-100 ${color}`;
    setTimeout(() => {
        els.message.classList.replace('opacity-100', 'opacity-0');
    }, 1500);
}

function shakeInput() {
    els.input.classList.add('shake-anim');
    setTimeout(() => els.input.classList.remove('shake-anim'), 300);
}

function showFloatingScore(pts) {
    const el = document.createElement('div');
    el.textContent = `+${pts}`;
    el.className = 'score-float text-3xl left-1/2 top-1/2 ml-[-20px]'; 
    els.input.parentElement.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// --- УПРАВЛЕНИЕ С КЛАВИАТУРЫ ---
function handleGlobalKeydown(e) {
    // Не обрабатываем глобальные нажатия, если открыты настройки
    if (!els.settingsModal.classList.contains('hidden')) return;
    
    if (!state.isPlaying) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'BACKSPACE') {
        state.currentInput = state.currentInput.slice(0, -1);
        updateInputUI();
        return;
    }
    if (key === 'ENTER') { submitWord(); return; }
    if (key === 'ESCAPE') { clearInput(); return; }

    if (state.selectedLetters.includes(key)) {
        inputLetter(key);
    }
}

// --- ФИНАЛ ---
function endGame() {
    state.isPlaying = false;
    clearInterval(state.intervalId);
    
    // Останавливаем фоновую музыку
    els.audio.bg.pause();
    
    els.finalScore.textContent = state.score;
    els.finalCount.textContent = state.history.length;
    els.screens.gameOver.classList.remove('hidden');
}

// Запуск приложения
init();
