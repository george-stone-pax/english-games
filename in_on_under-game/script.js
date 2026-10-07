// --- AUDIO SYSTEM ---
// Интегрированы пользовательские звуки и фоновая музыка
const audioAssets = {
    wrong: new Audio('https://george-stone-pax.github.io/my-game-assets/dodgeball.mp3'),
    right: new Audio('https://george-stone-pax.github.io/my-game-assets/rightanswer-95219.mp3'),
    bgMusic: [
        'https://george-stone-pax.github.io/my-game-assets/Aylex - Back To Life (freetouse.com).mp3',
        'https://george-stone-pax.github.io/my-game-assets/Aylex - Adrenaline Drive (freetouse.com).mp3',
        'https://george-stone-pax.github.io/my-game-assets/Aylex - Off Road (freetouse.com).mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music1.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music2.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music3.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music4.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music5.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music6.mp3',
        'https://george-stone-pax.github.io/gamesnew/My_music7.mp3'
    ]
};

let currentBgMusic = null;

function initAudio() {
    if (!currentBgMusic) {
        const randomTrack = audioAssets.bgMusic[Math.floor(Math.random() * audioAssets.bgMusic.length)];
        currentBgMusic = new Audio(randomTrack);
        currentBgMusic.loop = true;
    }
    updateVolume(document.getElementById('start-volume').value);
}

function playSound(type) {
    const sound = audioAssets[type];
    if(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play blocked by browser"));
    }
}

function updateVolume(val) {
    const v = parseFloat(val);
    if (currentBgMusic) currentBgMusic.volume = v;
    audioAssets.right.volume = v;
    audioAssets.wrong.volume = v;
    
    // Синхронизация ползунков
    document.getElementById('start-volume').value = v;
    document.getElementById('game-volume').value = v;
}

// --- FULLSCREEN & SETTINGS LOGIC ---
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const prepCheckboxes = document.querySelectorAll('.prep-checkbox');
const prepWarning = document.getElementById('prep-warning');
const fullscreenToggle = document.getElementById('fullscreen-toggle');

let selectedPrepositions = ["ON", "UNDER", "IN", "NEXT TO", "BETWEEN", "BEHIND", "IN FRONT OF"];

// Полноэкранный режим
fullscreenToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        }
    } else {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});

// Синхронизация чекбокса если вышли через Esc
document.addEventListener('fullscreenchange', () => {
    fullscreenToggle.checked = !!document.fullscreenElement;
});

// Модальное окно настроек
openSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

saveSettingsBtn.addEventListener('click', () => {
    const checked = Array.from(prepCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    if (checked.length === 0) {
        prepWarning.classList.remove('hidden');
        return;
    }
    prepWarning.classList.add('hidden');
    selectedPrepositions = checked;
    settingsModal.classList.add('hidden');
});

// --- ZONES DATA ---
const allZones = {
    // Table
    table_on: { x: 74, y: 57, type: 'front' },     
    table_under: { x: 74, y: 80, type: 'behind' }, 
    table_front: { x: 74, y: 96, type: 'front' },
    table_behind: { x: 83, y: 62, type: 'behind' },
    
    // Chair
    chair_on: { x: 20, y: 67, type: 'front' },     
    chair_under: { x: 22, y: 77, type: 'behind' }, 
    chair_behind: { x: 18, y: 55, type: 'behind' },
    
    // Box
    box_in: { x: 90, y: 88, type: 'behind' },      
    box_next: { x: 82, y: 90, type: 'front' },     
    
    // Rug
    rug_on: { x: 45, y: 78, type: 'front' },       
    rug_between: { x: 45, y: 60, type: 'front' },  
    
    // Shelf
    shelf_under: { x: 20, y: 42, type: 'front' },
    shelf_behind: { x: 14, y: 35, type: 'behind' }
};

const zoneDescriptions = {
    table_on: "На столе",
    table_under: "Под столом",
    table_front: "Перед столом",
    table_behind: "За столом",
    chair_on: "На стуле",
    chair_under: "Под стулом",
    chair_behind: "За стулом",
    box_in: "В коробке",
    box_next: "Рядом с коробкой",
    rug_on: "На ковре",
    rug_between: "Между стулом и столом",
    shelf_under: "Под полкой",
    shelf_behind: "За полкой"
};

// --- LEVELS DATA (Привязано к предлогам для фильтрации) ---
const allLevels = [
    { id: 1, text: "The cat is <b class='text-purple-600'>ON</b> the table.", targetZone: 'table_on', prep: 'ON' },
    { id: 2, text: "The cat is <b class='text-purple-600'>UNDER</b> the table.", targetZone: 'table_under', prep: 'UNDER' },
    { id: 3, text: "The cat is <b class='text-purple-600'>ON</b> the chair.", targetZone: 'chair_on', prep: 'ON' },
    { id: 4, text: "The cat is <b class='text-purple-600'>NEXT TO</b> the box.", targetZone: 'box_next', prep: 'NEXT TO' },
    { id: 5, text: "The cat is <b class='text-purple-600'>IN</b> the box.", targetZone: 'box_in', prep: 'IN' },
    { id: 6, text: "The cat is <b class='text-purple-600'>BETWEEN</b> the chair and the table.", targetZone: 'rug_between', prep: 'BETWEEN' },
    { id: 7, text: "The cat is <b class='text-purple-600'>BEHIND</b> the chair.", targetZone: 'chair_behind', prep: 'BEHIND' },
    { id: 8, text: "The cat is <b class='text-purple-600'>UNDER</b> the shelf.", targetZone: 'shelf_under', prep: 'UNDER' },
    { id: 9, text: "The cat is <b class='text-purple-600'>ON</b> the rug.", targetZone: 'rug_on', prep: 'ON' },
    { id: 10, text: "The cat is <b class='text-purple-600'>IN FRONT OF</b> the table.", targetZone: 'table_front', prep: 'IN FRONT OF' },
    { id: 11, text: "The cat is <b class='text-purple-600'>BEHIND</b> the table.", targetZone: 'table_behind', prep: 'BEHIND' },
    { id: 12, text: "The cat is <b class='text-purple-600'>BEHIND</b> the shelf.", targetZone: 'shelf_behind', prep: 'BEHIND' },
    { id: 13, text: "The cat is <b class='text-purple-600'>UNDER</b> the chair.", targetZone: 'chair_under', prep: 'UNDER' }
];

// --- GAME STATE ---
let activeLevels = [];
let currentLevelIndex = 0;
let score = 0;
let isDragging = false;
let gameActive = false;
let totalQuestions = 0;

const cat = document.getElementById('hero-cat');
const gameArea = document.getElementById('game-area');
const zonesContainer = document.getElementById('zones-container');
const locationIndicator = document.getElementById('location-indicator');
const locationText = document.getElementById('location-text');

// --- CORE GAME FUNCTIONS ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createVisualZones() {
    zonesContainer.innerHTML = '';
    for (const [key, val] of Object.entries(allZones)) {
        const z = document.createElement('div');
        z.className = 'drop-zone';
        z.dataset.id = key;
        z.style.left = val.x + '%';
        z.style.top = val.y + '%';
        zonesContainer.appendChild(z);
    }
}

function startGame() {
    // Фильтруем уровни на основе выбранных в настройках предлогов
    activeLevels = allLevels.filter(lvl => selectedPrepositions.includes(lvl.prep));
    
    // Защита от пустых настроек (на всякий случай)
    if(activeLevels.length === 0) activeLevels = [...allLevels]; 
    
    totalQuestions = activeLevels.length;

    initAudio();
    currentBgMusic.play().catch(e => console.log("Music blocked by browser policy"));
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    document.getElementById('instruction-panel').classList.remove('hidden');
    document.getElementById('location-indicator').classList.remove('hidden');

    createVisualZones();
    shuffleArray(activeLevels);
    currentLevelIndex = 0;
    score = 0;
    gameActive = true;
    
    updateScoreUI();
    loadLevel();
}

document.getElementById('start-game-btn').addEventListener('click', startGame);
document.getElementById('restart-game-btn').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
});

function loadLevel() {
    if (currentLevelIndex >= totalQuestions) {
        endGame();
        return;
    }

    const level = activeLevels[currentLevelIndex];
    document.getElementById('question-text').innerHTML = level.text;
    
    // Возвращаем кота в центр
    cat.style.left = '50%';
    cat.style.top = '50%';
    cat.style.transform = 'translate(-50%, -50%)';
    cat.className = 'absolute w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-6xl md:text-7xl select-none touch-none';
    cat.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s ease, left 0.3s ease';
    
    locationIndicator.classList.add('opacity-0');
}

function updateScoreUI() {
    document.getElementById('score-display').innerText = `${score}/${totalQuestions}`;
}

// --- DRAG AND DROP LOGIC (Mouse & Touch Adapted) ---
function handleStart(e) {
    if (!gameActive) return;
    isDragging = true;
    
    const evt = e.type.includes('touch') ? e.touches[0] : e;
    
    cat.classList.add('dragging');
    gameArea.classList.add('show-zones'); 
    moveCatToInput(evt.clientX, evt.clientY);
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault(); // Предотвращаем скролл на мобильных устройствах
    const evt = e.type.includes('touch') ? e.touches[0] : e;
    
    moveCatToInput(evt.clientX, evt.clientY);
    checkHoverZones(evt.clientX, evt.clientY);
}

function moveCatToInput(inputX, inputY) {
    const rect = gameArea.getBoundingClientRect();
    let x = inputX - rect.left;
    let y = inputY - rect.top;
    
    // Ограничители, чтобы кот не улетал за экран
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    cat.style.left = x + 'px';
    cat.style.top = y + 'px';
}

function checkHoverZones(inputX, inputY) {
    const zones = document.querySelectorAll('.drop-zone');
    let closest = null;
    let minDist = 60; // Радиус притяжения (можно менять)

    zones.forEach(z => {
        z.classList.remove('hovered');
        const rect = z.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(inputX - centerX, inputY - centerY);
        
        if (dist < minDist) {
            closest = z;
            minDist = dist;
        }
    });

    if (closest) {
        closest.classList.add('hovered');
        const zoneId = closest.dataset.id;
        
        // Показ текста локации
        locationText.innerText = zoneDescriptions[zoneId];
        locationIndicator.classList.remove('opacity-0');

        // LIVE BEHIND PREVIEW (затемнение если прячется за объект)
        if (allZones[zoneId].type === 'behind') {
            cat.classList.add('behind-object');
        } else {
            cat.classList.remove('behind-object');
        }
    } else {
        cat.classList.remove('behind-object');
        locationIndicator.classList.add('opacity-0');
    }
}

function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    cat.classList.remove('dragging');
    gameArea.classList.remove('show-zones');
    cat.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s ease, left 0.3s ease';
    
    locationIndicator.classList.add('opacity-0');

    const hoveredZone = document.querySelector('.drop-zone.hovered');
    
    if (hoveredZone) {
        checkAnswer(hoveredZone.dataset.id);
    } else {
        // Возвращаем на центр если бросили в пустоту
        cat.style.left = '50%';
        cat.style.top = '50%';
        cat.style.transform = 'translate(-50%, -50%)';
        cat.classList.remove('behind-object');
    }
}

function checkAnswer(droppedZoneId) {
    const currentLevel = activeLevels[currentLevelIndex];
    const correctZoneId = currentLevel.targetZone;
    const zoneData = allZones[droppedZoneId];
    
    // Примагничивание к зоне в процентах для резиновости
    cat.style.left = zoneData.x + '%';
    cat.style.top = zoneData.y + '%';
    
    if (zoneData.type === 'behind') {
        cat.classList.add('behind-object');
    } else {
        cat.classList.remove('behind-object');
    }

    if (droppedZoneId === correctZoneId) {
        playSound('right');
        score++;
        spawnConfetti(zoneData.x, zoneData.y);
        showFeedback(true);
    } else {
        playSound('wrong');
        cat.classList.add('animate-bounce-in');
        setTimeout(() => cat.classList.remove('animate-bounce-in'), 500);
        showFeedback(false);
    }

    updateScoreUI();
    currentLevelIndex++;
    setTimeout(loadLevel, 1500);
}

function showFeedback(isCorrect) {
    const panel = document.getElementById('instruction-panel');
    const glass = panel.children[0];
    
    if (isCorrect) {
        glass.classList.add('bg-green-100', 'border-green-500');
        document.getElementById('question-text').innerText = "Correct! 🎉";
    } else {
        glass.classList.add('bg-red-100', 'border-red-500');
        document.getElementById('question-text').innerText = "Wrong place! 😅";
    }

    setTimeout(() => {
        glass.className = "glass-panel p-3 md:p-4 text-center border-b-4 border-purple-500 shadow-xl transition-all duration-300 pointer-events-auto";
    }, 1200);
}

function spawnConfetti(xPercent, yPercent) {
    const rect = gameArea.getBoundingClientRect();
    const x = (xPercent / 100) * rect.width;
    const y = (yPercent / 100) * rect.height;

    for(let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle text-xl md:text-2xl absolute pointer-events-none z-[101]';
        p.style.animation = 'pop 0.6s ease-out forwards';
        p.innerText = ['⭐', '✨', '🎈', '🐱'][Math.floor(Math.random()*4)];
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.setProperty('--tx', (Math.random()*200 - 100) + 'px');
        p.style.setProperty('--ty', (Math.random()*200 - 100) + 'px');
        gameArea.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function endGame() {
    gameActive = false;
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('instruction-panel').classList.add('hidden');
    document.getElementById('location-indicator').classList.add('hidden');
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    document.getElementById('final-score').innerText = percentage + "%";

    let grade = "2";
    if (percentage >= 85) grade = "5";
    else if (percentage >= 70) grade = "4";
    else if (percentage >= 50) grade = "3";

    const gradeEl = document.getElementById('final-grade');
    gradeEl.innerText = grade;
    
    if(grade === "5") gradeEl.className = "text-4xl md:text-5xl font-bold ml-2 text-green-600";
    else if(grade === "4") gradeEl.className = "text-4xl md:text-5xl font-bold ml-2 text-blue-600";
    else if(grade === "3") gradeEl.className = "text-4xl md:text-5xl font-bold ml-2 text-yellow-600";
    else gradeEl.className = "text-4xl md:text-5xl font-bold ml-2 text-red-600";
}

// --- EVENT LISTENERS ---
cat.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);

cat.addEventListener('touchstart', handleStart, {passive: false});
window.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('touchend', handleEnd);

document.getElementById('start-volume').addEventListener('input', (e) => updateVolume(e.target.value));
document.getElementById('game-volume').addEventListener('input', (e) => updateVolume(e.target.value));

const modal = document.getElementById('criteria-modal');
document.getElementById('criteria-btn').onclick = () => modal.classList.remove('hidden');
document.getElementById('close-criteria').onclick = () => modal.classList.add('hidden');
modal.onclick = (e) => { if(e.target === modal) modal.classList.add('hidden'); };
