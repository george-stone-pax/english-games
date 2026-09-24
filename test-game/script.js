// ==========================================
// БАЗА ВОПРОСОВ (По залам / уровням)
// ==========================================
const questData = [
    {
        level: "A1",
        hallName: "Зал 1: Вход (A1)",
        questions: [
            {
                context: "Чтобы открыть первую дверь, выберите верную глагольную форму.",
                text: "She _____ English every day to learn new words.",
                answers: ["study", "studies", "studying", "is study"],
                correct: 1
            },
            {
                context: "Соберите заклинание открывания ворот.",
                text: "[ where / live / do / you / ? ]",
                answers: ["Where you do live?", "Where do you live?", "Do where you live?", "Where live you?"],
                correct: 1
            }
        ]
    },
    {
        level: "A2",
        hallName: "Зал 2: Коридор Времени (A2)",
        questions: [
            {
                context: "Заполните пропуск в древней записи дневника.",
                text: "I _____ this explorer two years ago in Cairo.",
                answers: ["have met", "met", "meet", "was meeting"],
                correct: 1
            },
            {
                context: "Выберите правильный камень для моста.",
                text: "We are meeting at the main gate _____ Friday afternoon.",
                answers: ["in", "at", "on", "to"],
                correct: 2
            }
        ]
    },
    {
        level: "B1",
        hallName: "Зал 3: Лабиринт Тумана (B1)",
        questions: [
            {
                context: "Расшифруйте условие, чтобы пройти сквозь иллюзию.",
                text: "If I _____ more time, I would join your expedition to the mountains.",
                answers: ["have", "had", "will have", "would have"],
                correct: 1
            },
            {
                context: "Выберите правильное действие с факелом.",
                text: "It's getting dark. Please _____ the lamp.",
                answers: ["turn on", "look after", "give up", "put off"],
                correct: 0
            }
        ]
    },
    {
        level: "B2",
        hallName: "Зал 4: Зал Алхимика (B2)",
        questions: [
            {
                context: "Исправьте формулу эликсира.",
                text: "The manuscript is missing. It _____ stolen during the night.",
                answers: ["must be", "must have been", "should be", "was to be"],
                correct: 1
            },
            {
                context: "Расставьте элементы цепи в верном порядке.",
                text: "Hardly _____ inside the room when the door slammed shut.",
                answers: ["I had stepped", "had I stepped", "I stepped", "did I step"],
                correct: 1
            }
        ]
    },
    {
        level: "C1",
        hallName: "Зал 5: Вершина Мудрости (C1)",
        questions: [
            {
                context: "Расшифруйте тайный скрижаль Хранителя.",
                text: "The researcher's findings were criticized for being based on _____ evidence rather than solid facts.",
                answers: ["Anecdotal", "Unanimous", "Empirical", "Substantial"],
                correct: 0
            },
            {
                context: "Завершите ритуал активации главного ядра.",
                text: "Were it not for your assistance, we _____ the secret code in time.",
                answers: ["will not crack", "would not have cracked", "didn't crack", "had not cracked"],
                correct: 1
            }
        ]
    }
];

// ==========================================
// ПЕРЕМЕННЫЕ СОСТОЯНИЯ ИГРЫ
// ==========================================
let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let hp = 3;
let xp = 0;
let timeLeft = 15;
let timerInterval;
let isMuted = false;

// ==========================================
// DOM ЭЛЕМЕНТЫ
// ==========================================
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    hpContainer: document.getElementById('hp-container'),
    xpScore: document.getElementById('xp-score'),
    timerDisplay: document.getElementById('timer-display'),
    currentHall: document.getElementById('current-hall'),
    questionContext: document.getElementById('question-context'),
    questionText: document.getElementById('question-text'),
    answersContainer: document.getElementById('answers-container'),
    feedbackOverlay: document.getElementById('feedback-overlay'),
    feedbackText: document.getElementById('feedback-text'),
    feedbackBonus: document.getElementById('feedback-bonus'),
    finalXp: document.getElementById('final-xp'),
    finalLevel: document.getElementById('final-level'),
    analysisList: document.getElementById('analysis-list')
};

const audio = {
    bgMusic: document.getElementById('bg-music'),
    correct: document.getElementById('sound-correct'),
    wrong: document.getElementById('sound-wrong')
};

// ==========================================
// ИНИЦИАЛИЗАЦИЯ И СЛУШАТЕЛИ СОБЫТИЙ
// ==========================================
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
document.getElementById('mute-btn').addEventListener('click', toggleMute);
document.getElementById('volume-slider').addEventListener('input', updateVolume);

// Устанавливаем начальную громкость
updateVolume();

// ==========================================
// ОСНОВНАЯ ЛОГИКА
// ==========================================

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        setTimeout(() => screen.classList.add('hidden'), 600);
    });
    
    setTimeout(() => {
        screens[screenName].classList.remove('hidden');
        // Небольшая задержка для срабатывания CSS-перехода
        setTimeout(() => screens[screenName].classList.add('active'), 50);
    }, 600);
}

function startGame() {
    currentLevelIndex = 0;
    currentQuestionIndex = 0;
    hp = 3;
    xp = 0;
    
    updateHPUI();
    ui.xpScore.textContent = xp;
    
    if (!isMuted) {
        audio.bgMusic.currentTime = 0;
        audio.bgMusic.play().catch(e => console.log("Автовоспроизведение заблокировано браузером"));
    }
    
    switchScreen('game');
    setTimeout(loadQuestion, 650);
}

function loadQuestion() {
    clearInterval(timerInterval);
    const levelData = questData[currentLevelIndex];
    const question = levelData.questions[currentQuestionIndex];
    
    ui.currentHall.textContent = levelData.hallName;
    ui.questionContext.textContent = question.context;
    ui.questionText.textContent = question.text;
    
    ui.answersContainer.innerHTML = '';
    
    question.answers.forEach((ans, index) => {
        const btn = document.createElement('button');
        btn.classList.add('answer-btn');
        btn.textContent = ans;
        btn.onclick = () => handleAnswer(index, btn);
        ui.answersContainer.appendChild(btn);
    });

    timeLeft = 15;
    updateTimerUI();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer(-1, null); // -1 означает тайм-аут
        }
    }, 1000);
}

function updateTimerUI() {
    ui.timerDisplay.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 5) {
        ui.timerDisplay.classList.add('warning');
    } else {
        ui.timerDisplay.classList.remove('warning');
    }
}

function updateHPUI() {
    const hearts = ui.hpContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index < hp) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

function handleAnswer(selectedIndex, buttonElement) {
    clearInterval(timerInterval);
    
    // Блокируем повторные нажатия
    const buttons = ui.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    const question = questData[currentLevelIndex].questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        if (!isMuted) {
            audio.correct.currentTime = 0;
            audio.correct.play();
        }
        
        let earnedXp = 100;
        let bonusText = "+ 100 XP";
        
        // Бонус за скорость (Ответ быстрее 5 секунд)
        if (timeLeft >= 10) {
            earnedXp = 200;
            bonusText = "SPEED BONUS! + 200 XP";
        }
        
        xp += earnedXp;
        ui.xpScore.textContent = xp;
        
        if (buttonElement) buttonElement.classList.add('correct');
        showFeedback(true, "Верно!", bonusText);
        
    } else {
        if (!isMuted) {
            audio.wrong.currentTime = 0;
            audio.wrong.play();
        }
        
        hp--;
        updateHPUI();
        
        if (buttonElement) buttonElement.classList.add('wrong');
        
        // Подсвечиваем правильный ответ
        if (buttons[question.correct]) {
            buttons[question.correct].classList.add('correct');
        }
        
        const errorMsg = timeLeft <= 0 ? "Время вышло!" : "Ошибка!";
        showFeedback(false, errorMsg, "-1 HP");
    }
    
    setTimeout(() => {
        ui.feedbackOverlay.classList.add('hidden');
        ui.feedbackOverlay.classList.remove('success', 'error');
        proceedToNext();
    }, 2000);
}

function showFeedback(isSuccess, mainText, subText) {
    ui.feedbackOverlay.classList.remove('hidden');
    ui.feedbackOverlay.classList.remove('success', 'error');
    
    ui.feedbackOverlay.classList.add(isSuccess ? 'success' : 'error');
    ui.feedbackText.textContent = mainText;
    ui.feedbackBonus.textContent = subText;
}

function proceedToNext() {
    if (hp <= 0) {
        endGame();
        return;
    }
    
    currentQuestionIndex++;
    
    // Если вопросы в текущем зале закончились, переходим в следующий
    if (currentQuestionIndex >= questData[currentLevelIndex].questions.length) {
        currentLevelIndex++;
        currentQuestionIndex = 0;
        
        if (currentLevelIndex >= questData.length) {
            endGame(); // Игра пройдена до конца
            return;
        }
    }
    
    loadQuestion();
}

function endGame() {
    audio.bgMusic.pause();
    
    let finalLvlText = "A1 (Beginner)";
    let analysisHtml = "";
    
    // Формируем аналитику в зависимости от того, на каком уровне остановился игрок
    if (currentLevelIndex === 0) {
        finalLvlText = "A1 (Beginner)";
        analysisHtml = "<li>Начните с повторения базовых времен (Present Simple) и порядка слов в вопросах.</li>";
    } else if (currentLevelIndex === 1) {
        finalLvlText = "A2 (Elementary)";
        analysisHtml = "<li>Хорошее понимание базы.</li><li>Точки роста: Past Simple vs Present Perfect и предлоги.</li>";
    } else if (currentLevelIndex === 2) {
        finalLvlText = "B1 (Intermediate)";
        analysisHtml = "<li>Уверенная грамматика повседневного общения.</li><li>Точки роста: Условные предложения (Conditionals) и фразовые глаголы.</li>";
    } else if (currentLevelIndex === 3) {
        finalLvlText = "B2 (Upper-Intermediate)";
        analysisHtml = "<li>Высокий уровень владения языком.</li><li>Точки роста: Страдательный залог (Passive Voice) и сложные времена.</li>";
    } else {
        finalLvlText = "C1 (Advanced)";
        analysisHtml = "<li>Отличное чувство языка и богатый словарный запас.</li><li>Точки роста: Идиомы и тонкости инверсии.</li>";
    }
    
    ui.finalXp.textContent = xp;
    ui.finalLevel.textContent = finalLvlText;
    ui.analysisList.innerHTML = analysisHtml;
    
    switchScreen('result');
}

// ==========================================
// УПРАВЛЕНИЕ МУЛЬТИМЕДИА И ЭКРАНОМ
// ==========================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Ошибка перехода в полноэкранный режим: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    
    if (isMuted) {
        audio.bgMusic.pause();
        muteBtn.textContent = '🔇';
        muteBtn.style.color = '#e74c3c';
    } else {
        if (screens.game.classList.contains('active')) {
            audio.bgMusic.play();
        }
        muteBtn.textContent = '🔊';
        muteBtn.style.color = 'var(--accent-glow)';
    }
}

function updateVolume() {
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = parseFloat(volumeSlider.value);
    
    audio.bgMusic.volume = volumeValue;
    audio.correct.volume = volumeValue;
    audio.wrong.volume = volumeValue;
    
    // Автоматически снимаем mute, если ползунок сдвинули больше 0
    if (volumeValue > 0 && isMuted) {
        toggleMute();
    } else if (volumeValue === 0 && !isMuted) {
        toggleMute();
    }
}
