/* ==========================================
   MONSTER MAKER - GAME LOGIC & CANVAS
   ========================================== */

/* 
===========================================================================
ИНСТРУКЦИЯ ПО ВСТАВКЕ КАРТИНОК ИЗ GITHUB PAGES:
Если вы хотите использовать свои собственные картинки (например, подготовленные 
заранее элементы монстра) вместо эмодзи, замените содержимое свойства "icon" 
на HTML-тег <img> с вашей ссылкой.

ПРИМЕР:
Вместо: icon: "👁️"
Напишите: icon: "<img src='https://george-stone-pax.github.io/my-game-assets/eye1.png' class='w-8 h-8 object-contain'>"
===========================================================================
*/

const partsData = {
    eyes: [
        { id: 1, text: "One big eye", desc: "one big eye", icon: "👁️" },
        { id: 2, text: "Two blue eyes", desc: "two blue eyes", icon: "👀" },
        { id: 3, text: "Three red eyes", desc: "three red eyes", icon: "🔴" },
        { id: 4, text: "Four small eyes", desc: "four small eyes", icon: "👓" },
        { id: 5, text: "Angry eyes", desc: "angry eyes", icon: "😠" },
        { id: 6, text: "Sunglasses", desc: "sunglasses", icon: "😎" }
    ],
    mouth: [
        { id: 1, text: "Big smile", desc: "a big smile", icon: "😃" },
        { id: 2, text: "Sharp teeth", desc: "sharp teeth", icon: "🦷" },
        { id: 3, text: "Blue tongue", desc: "a blue tongue", icon: "👅" },
        { id: 4, text: "Sad mouth", desc: "a sad mouth", icon: "☹️" },
        { id: 5, text: "Vampire fangs", desc: "vampire fangs", icon: "🧛" },
        { id: 6, text: "Bird beak", desc: "a bird beak", icon: "🦅" }
    ],
    nose: [
        { id: 1, text: "Long nose", desc: "a long nose", icon: "🤥" },
        { id: 2, text: "Pig nose", desc: "a pig nose", icon: "🐽" },
        { id: 3, text: "Red nose", desc: "a red clown nose", icon: "🤡" },
        { id: 4, text: "No nose", desc: "no nose", icon: "🚫" },
        { id: 5, text: "Green wart", desc: "a green wart", icon: "🦠" },
        { id: 6, text: "Trunk", desc: "an elephant trunk", icon: "🐘" }
    ],
    ears: [
        { id: 1, text: "Rabbit ears", desc: "long rabbit ears", icon: "🐰" },
        { id: 2, text: "Tiny ears", desc: "tiny ears", icon: "👂" },
        { id: 3, text: "One ear", desc: "only one ear", icon: "🧏" },
        { id: 4, text: "Elephant ears", desc: "big elephant ears", icon: "🐘" },
        { id: 5, text: "Cat ears", desc: "pointy cat ears", icon: "🐱" },
        { id: 6, text: "Headphones", desc: "headphones", icon: "🎧" }
    ],
    arms: [
        { id: 1, text: "Long arms", desc: "long arms", icon: "📏" },
        { id: 2, text: "Short arms", desc: "short T-Rex arms", icon: "🦖" },
        { id: 3, text: "Robot arms", desc: "robot arms", icon: "🤖" },
        { id: 4, text: "Tentacles", desc: "tentacles", icon: "🐙" },
        { id: 5, text: "Four arms", desc: "four arms", icon: "💪" },
        { id: 6, text: "Wings", desc: "wings", icon: "🪽" }
    ],
    legs: [
        { id: 1, text: "Chicken legs", desc: "chicken legs", icon: "🐔" },
        { id: 2, text: "Spider legs", desc: "many spider legs", icon: "🕷️" },
        { id: 3, text: "One big foot", desc: "one big foot", icon: "🦶" },
        { id: 4, text: "Wheels", desc: "wheels", icon: "🚲" },
        { id: 5, text: "Boots", desc: "big boots", icon: "👢" },
        { id: 6, text: "A tail", desc: "a tail", icon: "🐍" }
    ]
};

const categories = ['eyes', 'mouth', 'nose', 'ears', 'arms', 'legs'];
let currentStep = 0; // 0 to 5
let isGameFinished = false;

// ==========================================
// AUDIO SETUP & VOLUME CONTROL
// ==========================================
const bgMusic = document.getElementById('bg-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const volumeSlider = document.getElementById('volume-slider');
const musicToggleBtn = document.getElementById('music-toggle');
let isMusicPlaying = false;

function updateVolume() {
    const vol = volumeSlider.value;
    bgMusic.volume = vol;
    correctSound.volume = vol;
    wrongSound.volume = vol;
}

volumeSlider.addEventListener('input', updateVolume);

musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggleBtn.innerHTML = '<i class="fas fa-music text-gray-400"></i>';
    } else {
        bgMusic.play().catch(e => console.log("Autoplay blocked until user interaction"));
        musicToggleBtn.innerHTML = '<i class="fas fa-music text-green-600"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

function playSound(type) {
    if (type === 'correct') {
        correctSound.currentTime = 0;
        correctSound.play().catch(e => console.log(e));
    } else if (type === 'wrong') {
        wrongSound.currentTime = 0;
        wrongSound.play().catch(e => console.log(e));
    }
}

document.body.addEventListener('click', function initAudio() {
    if (!isMusicPlaying) {
        updateVolume();
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggleBtn.innerHTML = '<i class="fas fa-music text-green-600"></i>';
        }).catch(e => console.log(e));
    }
    document.body.removeEventListener('click', initAudio);
}, { once: true });


// ==========================================
// DOM ELEMENTS
// ==========================================
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-game-btn');
const diceContainer = document.getElementById('dice-container');
const instructionText = document.getElementById('instruction-text');
const gridBody = document.getElementById('grid-body');

// ==========================================
// INITIALIZATION
// ==========================================
function initGrid() {
    gridBody.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const tr = document.createElement('tr');
        tr.className = "border-b border-green-100 hover:bg-green-50 transition-colors";
        
        let html = `<td class="p-2 sm:p-3 font-bold text-gray-500 bg-gray-50 border-r border-green-100">${i}</td>`;
        
        categories.forEach(cat => {
            const item = partsData[cat].find(p => p.id === i);
            html += `<td id="cell-${cat}-${i}" class="p-2 sm:p-3 border-r border-green-100 text-xs sm:text-sm">
                <div class="text-xl sm:text-2xl mb-1 flex justify-center items-center h-8">${item.icon}</div>
                <div class="leading-tight text-gray-700">${item.text}</div>
            </td>`;
        });
        
        tr.innerHTML = html;
        gridBody.appendChild(tr);
    }
    updateVolume();
}

// ==========================================
// GAME LOGIC
// ==========================================
function rollDice() {
    if (isGameFinished) return;

    rollBtn.disabled = true;
    diceContainer.classList.add('dice-animation');

    setTimeout(() => {
        diceContainer.classList.remove('dice-animation');
        
        const roll = Math.floor(Math.random() * 6) + 1;
        updateDiceVisual(roll);
        
        const currentCategory = categories[currentStep];
        handleRollResult(currentCategory, roll);

        rollBtn.disabled = false;
    }, 600);
}

function updateDiceVisual(num) {
    const icons = ['fa-dice-one', 'fa-dice-two', 'fa-dice-three', 'fa-dice-four', 'fa-dice-five', 'fa-dice-six'];
    diceContainer.innerHTML = `<i class="fas ${icons[num-1]}"></i>`;
}

function handleRollResult(category, roll) {
    const cellId = `cell-${category}-${roll}`;
    const cell = document.getElementById(cellId);
    
    cell.classList.add('cell-active');
    
    const gridContainer = document.querySelector('.parts-grid');
    if (gridContainer && window.innerWidth < 1024) {
        const scrollLeft = cell.offsetLeft - (gridContainer.clientWidth / 2) + (cell.clientWidth / 2);
        gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    } else {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const part = partsData[category].find(p => p.id === roll);
    
    instructionText.innerText = `Draw: ${part.text}!`;
    instructionText.classList.add('text-green-600', 'scale-110');
    playSound('correct');
    
    setTimeout(() => instructionText.classList.remove('text-green-600', 'scale-110'), 300);

    currentStep++;
    if (currentStep >= categories.length) {
        finishGame();
    }
}

function finishGame() {
    isGameFinished = true;
    rollBtn.innerText = "DONE! 🎉";
    rollBtn.classList.replace('bg-purple-600', 'bg-green-600');
    rollBtn.classList.replace('hover:bg-purple-700', 'hover:bg-green-700');
    rollBtn.disabled = true;
    instructionText.innerText = "Great Monster! You can download it now.";
    
    diceContainer.classList.add('celebrate-animation');
    playSound('correct'); 
    setTimeout(() => diceContainer.classList.remove('celebrate-animation'), 1000);
}

function resetGame() {
    currentStep = 0;
    isGameFinished = false;
    
    rollBtn.innerText = "ROLL DICE! 🎲";
    rollBtn.classList.replace('bg-green-600', 'bg-purple-600');
    rollBtn.classList.replace('hover:bg-green-700', 'hover:bg-purple-700');
    rollBtn.disabled = false;
    instructionText.innerText = "Press ROLL to start!";
    updateDiceVisual(6);

    document.querySelectorAll('.cell-active').forEach(el => {
        el.classList.remove('cell-active');
    });
    
    const gridContainer = document.querySelector('.parts-grid');
    if (gridContainer) gridContainer.scrollTo({ left: 0, behavior: 'smooth' });
    
    clearCanvas(false); 
}

// ==========================================
// CANVAS LOGIC & UNDO SYSTEM
// ==========================================
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const container = document.getElementById('canvas-container');
const placeholder = document.getElementById('canvas-placeholder');
const undoBtn = document.getElementById('undo-btn');
        
let painting = false;
let eraserMode = false;
let brushColor = '#000000';
let brushSize = 5;
let hasDrawn = false;

// История для отмены
let undoStack = [];
const MAX_UNDO_STEPS = 5;

// Инициализация кнопки "Отменить"
if (undoBtn) undoBtn.disabled = true;

function initCanvasBackground() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveCanvasState() {
    // Сохраняем текущее состояние холста в массив
    if (undoStack.length >= MAX_UNDO_STEPS) {
        undoStack.shift(); // Удаляем самый старый шаг, если превышен лимит
    }
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoBtn) undoBtn.disabled = false;
}

function undoLastAction() {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
        
        // Скрываем плейсхолдер, так как на холсте есть рисунок (или фон)
        hasDrawn = true;
        placeholder.style.opacity = '0';
        setTimeout(() => placeholder.style.display = 'none', 300);

        if (undoStack.length === 0 && undoBtn) {
            undoBtn.disabled = true;
        }
    }
}

// Привязка кнопки "Отменить"
if (undoBtn) {
    undoBtn.addEventListener('click', undoLastAction);
}

function resizeCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    if (hasDrawn) tempCtx.drawImage(canvas, 0, 0);

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    initCanvasBackground();
    if (hasDrawn) ctx.drawImage(tempCanvas, 0, 0);
    
    // Очищаем историю при изменении размера экрана, чтобы избежать графических артефактов
    undoStack = [];
    if (undoBtn) undoBtn.disabled = true;
}

function startPosition(e) {
    // Если касание двумя или более пальцами - отменяем рисование (для зума)
    if (e.touches && e.touches.length >= 2) {
        painting = false;
        ctx.beginPath();
        return;
    }

    saveCanvasState(); // Сохраняем состояние перед новым штрихом
    painting = true;
    hasDrawn = true;
    placeholder.style.opacity = '0';
    setTimeout(() => placeholder.style.display = 'none', 300);
    draw(e);
}

function finishedPosition() {
    painting = false;
    ctx.beginPath();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function draw(e) {
    // Если в процессе рисования приложили второй палец - прерываем линию
    if (e.touches && e.touches.length >= 2) {
        painting = false;
        ctx.beginPath();
        return;
    }

    if (!painting) return;
    
    // Предотвращаем скроллинг страницы только при рисовании одним пальцем
    if (e.type.includes('touch')) {
        e.preventDefault();
    }

    const pos = getMousePos(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = eraserMode ? '#ffffff' : brushColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function clearCanvas(playAudio = true) {
    saveCanvasState(); // Позволяет отменить случайную очистку холста!
    initCanvasBackground();
    hasDrawn = false;
    placeholder.style.display = 'flex';
    setTimeout(() => placeholder.style.opacity = '1', 10);
    if (playAudio) playSound('wrong');
}

function saveCanvas() {
    if (!hasDrawn) return;
    const link = document.createElement('a');
    link.download = 'My_Monster.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
    playSound('correct');
}

// Canvas Event Listeners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', finishedPosition);

// Touch events with passive: false to allow e.preventDefault()
canvas.addEventListener('touchstart', startPosition, { passive: false });
canvas.addEventListener('touchend', finishedPosition);
canvas.addEventListener('touchcancel', finishedPosition);
canvas.addEventListener('touchmove', draw, { passive: false });

// Tools Event Listeners
document.getElementById('color-picker').addEventListener('input', (e) => {
    brushColor = e.target.value;
    eraserMode = false;
});

document.getElementById('brush-size').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('eraser-btn').addEventListener('click', () => {
    eraserMode = true;
});

document.getElementById('clear-canvas-btn').addEventListener('click', clearCanvas);
document.getElementById('save-canvas-btn').addEventListener('click', saveCanvas);

document.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
        brushColor = btn.dataset.color;
        document.getElementById('color-picker').value = brushColor;
        eraserMode = false;
    });
});

// App Init
initGrid();
rollBtn.addEventListener('click', rollDice);
resetBtn.addEventListener('click', resetGame);
setTimeout(resizeCanvas, 100);
  
