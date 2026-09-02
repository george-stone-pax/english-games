import * as THREE from 'three';

// --- НАСТРОЙКИ ИГРЫ: БАЗА ИЗ 30 ВОПРОСОВ (СЛОВА ДО 7 СИМВОЛОВ) ---
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
    { words: ["he", "Did", "wash", "his", "car", "?"] }
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
    ["Did", "he", "wash", "his", "car", "?"]
];

let gameSentences = [];
let gameCorrectAnswers = [];
let currentSentenceIndex = 0;
const totalQuestions = 10;
let isReversing = false; // Флаг для движения конвейера назад

// Выбор 10 случайных вопросов
function initGameData() {
    let indices = Array.from({ length: 30 }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    let selectedIndices = indices.slice(0, totalQuestions);
    
    gameSentences = selectedIndices.map(i => allSentences[i]);
    gameCorrectAnswers = selectedIndices.map(i => allCorrectAnswers[i]);
    currentSentenceIndex = 0;
    updateCounter();
}

function updateCounter() {
    const counterEl = document.getElementById('question-counter');
    if (counterEl) {
        counterEl.textContent = `Question: ${currentSentenceIndex + 1} / ${totalQuestions}`;
    }
}

// --- АУДИО СИСТЕМА ---
const bgMusic = document.getElementById('bg-music');
const soundRight = document.getElementById('sound-right');
const soundWrong = document.getElementById('sound-wrong');
const volumeSlider = document.getElementById('volume-slider');
let musicStarted = false;

function updateVolume() {
    const vol = volumeSlider.value;
    bgMusic.volume = vol;
    soundRight.volume = vol;
    soundWrong.volume = vol;
}

volumeSlider.addEventListener('input', updateVolume);

window.addEventListener('pointerdown', () => {
    if (!musicStarted) {
        updateVolume();
        bgMusic.play().catch(e => console.log("Браузер заблокировал автовоспроизведение"));
        musicStarted = true;
    }
}, { once: true });

// --- ОСНОВНЫЕ ПЕРЕМЕННЫЕ THREE.JS ---
let scene, camera, renderer;
let raycaster, mouse;
let conveyor, dropZonesGroup, dropZones = [], wordBoxes = [];
let draggedObject = null;

// --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
const messageEl = document.getElementById('message');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');
const restartButton = document.getElementById('restart-button');
const endScreen = document.getElementById('end-screen');
const canvasContainer = document.getElementById('canvas-container');
const fullscreenBtn = document.getElementById('fullscreen-btn');
        
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Ошибка включения полноэкранного режима: ${err.message}`);
        });
        fullscreenBtn.textContent = 'Выйти из полного экрана';
    } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = 'Войти в полный экран';
    }
});
// Логика кнопки "Назад" (удержание)
backButton.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isReversing = true;
});
backButton.addEventListener('pointerup', (e) => {
    e.preventDefault();
    isReversing = false;
});
backButton.addEventListener('pointerleave', (e) => {
    e.preventDefault();
    isReversing = false;
});

// Перезапуск игры
restartButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    initGameData();
    loadSentence();
    checkButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    messageEl.classList.remove('show');
});

// --- ИНИЦИАЛИЗАЦИЯ ---
function init() {
    initGameData();

    scene = new THREE.Scene();

    const backgroundUrl = 'https://george-stone-pax.github.io/my-game-assets2/logistic-warehouse-interior-with-box-and-pallet-vector-49010067.jpg';
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(backgroundUrl, (texture) => {
        scene.background = texture;
    });

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 45);
    camera.lookAt(0, 10, 0);

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
    renderer.setPixelRatio(window.devicePixelRatio);
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

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    
    checkButton.addEventListener('click', checkAnswer);
    nextButton.addEventListener('click', loadNextSentence);
    
    updateVolume();
}

// --- СОЗДАНИЕ ИГРОВЫХ ОБЪЕКТОВ ---
function createConveyor() {
    const conveyorWidth = 130; 
    const conveyorHeight = 18;
    const conveyorThickness = 2.0; 
    
    const textureUrl = 'https://media.istockphoto.com/id/489228919/vector/metal-plate-background-with-screws.jpg?s=612x612&w=0&k=20&c=LpOM6RjYp3yAbCg_s2s_yP9i-D2a_hODg2vjmc9Vz-M=';
    const textureLoader = new THREE.TextureLoader();
    const conveyorTexture = textureLoader.load(textureUrl);
    conveyorTexture.wrapS = THREE.RepeatWrapping;
    conveyorTexture.wrapT = THREE.RepeatWrapping;
    conveyorTexture.repeat.set(conveyorWidth / 8, 1);

    const conveyorMaterial = new THREE.MeshStandardMaterial({ 
        map: conveyorTexture,
        roughness: 0.7,
        metalness: 0.3
    });
    
    const conveyorGeometry = new THREE.BoxGeometry(conveyorWidth, conveyorThickness, conveyorHeight);
    conveyor = new THREE.Mesh(conveyorGeometry, conveyorMaterial);
    conveyor.position.y = 15;
    conveyor.receiveShadow = true;
    scene.add(conveyor);

    dropZonesGroup = new THREE.Group();
    dropZonesGroup.position.y = 15;
    scene.add(dropZonesGroup);
}

function createDropZones(numZones) {
    dropZones.forEach(zone => {
        dropZonesGroup.remove(zone);
        zone.geometry.dispose();
        zone.material.map.dispose();
        zone.material.dispose();
    });
    dropZones = [];

    const zoneSpacing = 18; 
    const zoneSize = 7.5;

    for (let i = 0; i < numZones; i++) {
        const zoneCanvas = document.createElement('canvas');
        const zoneCtx = zoneCanvas.getContext('2d');
        zoneCanvas.width = 256; zoneCanvas.height = 256;
        
        zoneCtx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        zoneCtx.fillRect(0,0,256,256);
        zoneCtx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        zoneCtx.lineWidth = 12;
        zoneCtx.setLineDash([20, 15]);
        zoneCtx.strokeRect(10, 10, 236, 236);
        
        zoneCtx.textAlign = 'center';
        zoneCtx.font = 'bold 120px Arial';
        zoneCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        zoneCtx.fillText(i + 1, 128, 170);

        const zoneTexture = new THREE.CanvasTexture(zoneCanvas);
        const zoneMaterial = new THREE.MeshBasicMaterial({
            map: zoneTexture,
            transparent: true
        });
        
        const zone = new THREE.Mesh(new THREE.PlaneGeometry(zoneSize, zoneSize), zoneMaterial);
        zone.position.set((i - (numZones - 1) / 2) * zoneSpacing, 1.02, 0);
        zone.rotation.x = -Math.PI / 2;
        zone.userData.isDropZone = true;
        zone.userData.index = i;
        zone.userData.occupiedBy = null;
        dropZones.push(zone);
        dropZonesGroup.add(zone);
    }
}

function createWordBox(word, position) {
    const wordCanvas = document.createElement('canvas');
    const wordCtx = wordCanvas.getContext('2d');
    wordCanvas.width = 256; wordCanvas.height = 256;
    
    // --- ЦВЕТ КЛАССИЧЕСКОГО КРАФТА ---
    wordCtx.fillStyle = '#c49a6c';
    wordCtx.fillRect(0, 0, 256, 256);
    wordCtx.strokeStyle = '#8b5a2b';
    wordCtx.lineWidth = 8;
    wordCtx.strokeRect(0, 0, 256, 256);
    
    wordCtx.font = 'bold 65px Arial'; 
    wordCtx.fillStyle = '#1e293b';
    wordCtx.textAlign = 'center';
    wordCtx.textBaseline = 'middle';
    wordCtx.fillText(word, 128, 128);
    
    const wordTexture = new THREE.CanvasTexture(wordCanvas);
    const textMaterial = new THREE.MeshStandardMaterial({ map: wordTexture, roughness: 0.7 });
    const bottomMaterial = new THREE.MeshStandardMaterial({ color: '#a8794c', roughness: 0.8 });

    const materials = [textMaterial, textMaterial, textMaterial, bottomMaterial, textMaterial, textMaterial];

    const boxSize = 4.0;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const box = new THREE.Mesh(boxGeometry, materials);
    
    box.position.copy(position);
    box.castShadow = true;
    box.receiveShadow = true;
    
    box.userData.isWordBox = true;
    box.userData.word = word;
    box.userData.originalPosition = position.clone();
    box.userData.targetPosition = null;
    box.userData.targetRotation = null;
    
    wordBoxes.push(box);
    scene.add(box);
}

function clearSentence() {
    wordBoxes.forEach(box => {
        scene.remove(box);
        dropZonesGroup.remove(box);
        box.geometry.dispose();
        if (Array.isArray(box.material)) {
            box.material.forEach(m => {
                if (m.map) m.map.dispose();
                m.dispose();
            });
        }
    });
    wordBoxes = [];
    dropZones.forEach(zone => zone.userData.occupiedBy = null);
}

function loadSentence() {
    clearSentence();
    dropZonesGroup.position.x = 0;

    const sentenceData = gameSentences[currentSentenceIndex];
    const words = [...sentenceData.words].sort(() => Math.random() - 0.5);
    const numWords = words.length;
    
    createDropZones(numWords);

    const spacing = 8.0;
    const startX = -((numWords - 1) * spacing) / 2;
    
    for (let i = 0; i < numWords; i++) {
        const pos = new THREE.Vector3(startX + i * spacing, 24, 25 + (Math.random() * 2 - 1));
        createWordBox(words[i], pos);
    }
}

function loadNextSentence() {
    currentSentenceIndex++;
    updateCounter();
    loadSentence();
    
    messageEl.classList.remove('show');
    checkButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    checkButton.disabled = false;
}

// --- ЛОГИКА ВЗАИМОДЕЙСТВИЯ ---
function onPointerDown(event) {
    updateMouse(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(wordBoxes);

    if (intersects.length > 0) {
        draggedObject = intersects[0].object;
        
        if (draggedObject.parent === dropZonesGroup) {
            scene.attach(draggedObject);
        }
        
        draggedObject.userData.targetPosition = new THREE.Vector3(
            draggedObject.position.x, 
            draggedObject.position.y + 3, 
            draggedObject.position.z
        );
        
        draggedObject.userData.targetRotation = new THREE.Euler(
            Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1
        );
        
        const zone = findZoneWithBox(draggedObject);
        if (zone) zone.userData.occupiedBy = null;
    }
}

function onPointerMove(event) {
    if (draggedObject) {
        updateMouse(event);
        
        const dropPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dropZonesGroup.position.y);
        const intersectionPoint = new THREE.Vector3();
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(dropPlane, intersectionPoint);
        
        if (intersectionPoint) {
            draggedObject.userData.targetPosition.set(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
        }
    }
}

function onPointerUp(event) {
    if (draggedObject) {
        let closestZone = null;
        let minDistance = Infinity;
        const magnetThreshold = 15.0; 

        const draggedPos = new THREE.Vector3();
        draggedObject.getWorldPosition(draggedPos);

        dropZones.forEach(zone => {
            if (!zone.userData.occupiedBy) {
                const zoneWorldPos = new THREE.Vector3();
                zone.getWorldPosition(zoneWorldPos);
                const distance = draggedPos.distanceTo(zoneWorldPos);
                
                if (distance < minDistance && distance < magnetThreshold) {
                    minDistance = distance;
                    closestZone = zone;
                }
            }
        });

        if (closestZone) {
            dropZonesGroup.attach(draggedObject);
            const boxY = closestZone.position.y + (4.0 / 2);
            draggedObject.userData.targetPosition = closestZone.position.clone().setY(boxY);
            draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
            closestZone.userData.occupiedBy = draggedObject;
        } else {
            draggedObject.userData.targetPosition = draggedObject.userData.originalPosition.clone();
            draggedObject.userData.targetRotation = new THREE.Euler(0, 0, 0);
        }

        draggedObject = null;
    }
}

function checkAnswer() {
    const userAnswer = [];
    const sortedZones = [...dropZones].sort((a, b) => a.userData.index - b.userData.index);
    
    sortedZones.forEach(zone => {
         if (zone.userData.occupiedBy) {
            userAnswer.push(zone.userData.occupiedBy.userData.word);
        }
    });
    
    const correctAnswer = gameCorrectAnswers[currentSentenceIndex];
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

    if (isCorrect) {
        soundRight.currentTime = 0;
        soundRight.play();
        
        messageEl.textContent = 'Correct! Отличная работа! 🎉';
        messageEl.style.color = '#4ade80';
        checkButton.style.display = 'none';
        
        if (currentSentenceIndex >= totalQuestions - 1) {
            setTimeout(() => {
                endScreen.style.display = 'flex';
            }, 1500);
        } else {
            nextButton.style.display = 'inline-block';
        }
        
    } else {
        soundWrong.currentTime = 0;
        soundWrong.play();
        
        messageEl.textContent = 'Oops! Попробуй еще раз.';
        messageEl.style.color = '#f87171';
        
        setTimeout(() => { 
           messageEl.classList.remove('show');
        }, 2000);
    }
    
    messageEl.classList.add('show');
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function updateMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function findZoneWithBox(box) {
    return dropZones.find(zone => zone.userData.occupiedBy === box);
}

// --- ЦИКЛ АНИМАЦИИ ---
function animate() {
    requestAnimationFrame(animate);

    const speed = 0.05; 
    const reverseSpeed = 0.25;
    
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
    
    wordBoxes.forEach(box => {
        if (box.userData.targetPosition) {
            box.position.lerp(box.userData.targetPosition, 0.15);
        }
        if (box.userData.targetRotation) {
            box.quaternion.slerp(new THREE.Quaternion().setFromEuler(box.userData.targetRotation), 0.15);
        }
    });

    renderer.render(scene, camera);
}

// --- ЗАПУСК ---
init();
