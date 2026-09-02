// script.js - The Time Traveler 3.0 Ultimate Edition (Max FPS Version)

// --- CONFIGURATION ---
const TENSE_CONFIG = {
    past_simple: { id: 'past_simple', label: 'Past Simple', hint: 'Yesterday', color: 'bg-orange-100 text-orange-800 border-orange-300', active: true },
    present_continuous: { id: 'present_continuous', label: 'Pr. Continuous', hint: 'Now', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', active: true },
    future_simple: { id: 'future_simple', label: 'Future Simple', hint: 'Tomorrow', color: 'bg-blue-100 text-blue-800 border-blue-300', active: true },
    present_simple: { id: 'present_simple', label: 'Present Simple', hint: 'Every Day', color: 'bg-amber-100 text-amber-800 border-amber-300', active: false },
    present_perfect: { id: 'present_perfect', label: 'Pr. Perfect', hint: 'Already / Just', color: 'bg-purple-100 text-purple-800 border-purple-300', active: false },
    past_continuous: { id: 'past_continuous', label: 'Past Continuous', hint: 'Yesterday at 5', color: 'bg-pink-100 text-pink-800 border-pink-300', active: false }
};

const PRONOUNS = ['I', 'You', 'He', 'She', 'We', 'They'];

const useGsap = typeof gsap !== 'undefined' && gsap !== null && typeof gsap.to === 'function';

// --- DATA FACTORY ---
const createVerb = (verb, emoji, forms) => ({ verb, emoji, forms });

const STANDARD_VERBS_1 = [
    createVerb("Eat pizza", "🍕", { past_simple: "ate pizza", present_continuous: "am eating pizza", future_simple: "will eat pizza", present_simple: "eat pizza", present_perfect: "have eaten pizza", past_continuous: "was eating pizza" }),
    createVerb("Swim", "🏊", { past_simple: "swam", present_continuous: "am swimming", future_simple: "will swim", present_simple: "swim", present_perfect: "have swum", past_continuous: "was swimming" }),
    createVerb("Read a book", "📖", { past_simple: "read a book", present_continuous: "am reading a book", future_simple: "will read a book", present_simple: "read a book", present_perfect: "have read a book", past_continuous: "was reading a book" }),
    createVerb("Sleep", "😴", { past_simple: "slept", present_continuous: "am sleeping", future_simple: "will sleep", present_simple: "sleep", present_perfect: "have slept", past_continuous: "was sleeping" }),
    createVerb("Run", "🏃", { past_simple: "ran", present_continuous: "am running", future_simple: "will run", present_simple: "run", present_perfect: "have run", past_continuous: "was running" }),
    createVerb("Watch TV", "📺", { past_simple: "watched TV", present_continuous: "am watching TV", future_simple: "will watch TV", present_simple: "watch TV", present_perfect: "have watched TV", past_continuous: "was watching TV" }),
    createVerb("Play football", "⚽", { past_simple: "played football", present_continuous: "am playing football", future_simple: "will play football", present_simple: "play football", present_perfect: "have played football", past_continuous: "was playing football" }),
    createVerb("Cook dinner", "🍳", { past_simple: "cooked dinner", present_continuous: "am cooking dinner", future_simple: "will cook dinner", present_simple: "cook dinner", present_perfect: "have cooked dinner", past_continuous: "was cooking dinner" }),
    createVerb("Listen to music", "🎧", { past_simple: "listened to music", present_continuous: "am listening to music", future_simple: "will listen to music", present_simple: "listen to music", present_perfect: "have listened to music", past_continuous: "was listening to music" }),
];
const STANDARD_VERBS_2 = [
    createVerb("Drink water", "🥤", { past_simple: "drank water", present_continuous: "am drinking water", future_simple: "will drink water", present_simple: "drink water", present_perfect: "have drunk water", past_continuous: "was drinking water" }),
    createVerb("Dance", "💃", { past_simple: "danced", present_continuous: "am dancing", future_simple: "will dance", present_simple: "dance", present_perfect: "have danced", past_continuous: "was dancing" }),
    createVerb("Study English", "📚", { past_simple: "studied English", present_continuous: "am studying English", future_simple: "will study English", present_simple: "study English", present_perfect: "have studied English", past_continuous: "was studying English" }),
    createVerb("Buy clothes", "🛍️", { past_simple: "bought clothes", present_continuous: "am buying clothes", future_simple: "will buy clothes", present_simple: "buy clothes", present_perfect: "have bought clothes", past_continuous: "was buying clothes" }),
    createVerb("Write a letter", "✍️", { past_simple: "wrote a letter", present_continuous: "am writing a letter", future_simple: "will write a letter", present_simple: "write a letter", present_perfect: "have written a letter", past_continuous: "was writing a letter" }),
    createVerb("Play guitar", "🎸", { past_simple: "played guitar", present_continuous: "am playing guitar", future_simple: "will play guitar", present_simple: "play guitar", present_perfect: "have played guitar", past_continuous: "was playing guitar" }),
    createVerb("Walk the dog", "🐕", { past_simple: "walked the dog", present_continuous: "am walking the dog", future_simple: "will walk the dog", present_simple: "walk the dog", present_perfect: "have walked the dog", past_continuous: "was walking the dog" }),
    createVerb("Ride a bike", "🚲", { past_simple: "rode a bike", present_continuous: "am riding a bike", future_simple: "will ride a bike", present_simple: "ride a bike", present_perfect: "have ridden a bike", past_continuous: "was riding a bike" }),
    createVerb("Clean the room", "🧹", { past_simple: "cleaned the room", present_continuous: "am cleaning the room", future_simple: "will clean the room", present_simple: "clean the room", present_perfect: "have cleaned the room", past_continuous: "was cleaning the room" }),
    createVerb("Draw a picture", "🎨", { past_simple: "drew a picture", present_continuous: "am drawing a picture", future_simple: "will draw a picture", present_simple: "draw a picture", present_perfect: "have drawn a picture", past_continuous: "was drawing a picture" }),
    createVerb("Sing a song", "🎤", { past_simple: "sang a song", present_continuous: "am singing a song", future_simple: "will sing a song", present_simple: "sing a song", present_perfect: "have sung a song", past_continuous: "was singing a song" }),
    createVerb("Make a cake", "🎂", { past_simple: "made a cake", present_continuous: "am making a cake", future_simple: "will make a cake", present_simple: "make a cake", present_perfect: "have made a cake", past_continuous: "was making a cake" }),
];
const STANDARD_NEW_VERBS = [
    createVerb("Take a shower", "🚿", { past_simple: "took a shower", present_continuous: "am taking a shower", future_simple: "will take a shower", present_simple: "take a shower", present_perfect: "have taken a shower", past_continuous: "was taking a shower" }),
    createVerb("Call a friend", "📱", { past_simple: "called a friend", present_continuous: "am calling a friend", future_simple: "will call a friend", present_simple: "call a friend", present_perfect: "have called a friend", past_continuous: "was calling a friend" }),
    createVerb("Use a computer", "💻", { past_simple: "used a computer", present_continuous: "am using a computer", future_simple: "will use a computer", present_simple: "use a computer", present_perfect: "have used a computer", past_continuous: "was using a computer" }),
    createVerb("Take a photo", "📸", { past_simple: "took a photo", present_continuous: "am taking a photo", future_simple: "will take a photo", present_simple: "take a photo", present_perfect: "have taken a photo", past_continuous: "was taking a photo" }),
    createVerb("Wait for a bus", "🚏", { past_simple: "waited for a bus", present_continuous: "am waiting for a bus", future_simple: "will wait for a bus", present_simple: "wait for a bus", present_perfect: "have waited for a bus", past_continuous: "was waiting for a bus" }),
    createVerb("Open a gift", "🎁", { past_simple: "opened a gift", present_continuous: "am opening a gift", future_simple: "will open a gift", present_simple: "open a gift", present_perfect: "have opened a gift", past_continuous: "was opening a gift" }),
    createVerb("Brush teeth", "🪥", { past_simple: "brushed teeth", present_continuous: "am brushing teeth", future_simple: "will brush teeth", present_simple: "brush teeth", present_perfect: "have brushed teeth", past_continuous: "was brushing teeth" }),
];

const SP_FWD = { verb: "Lucky Day! +2", type: "forward", steps: 2, emoji: "🍀" };
const SP_BCK = { verb: "Storm! Back -2", type: "backward", steps: -2, emoji: "🌪️" };

const DATA_STANDARD = [
    { id: 1, verb: "Start", type: "start", emoji: "🚀" },
    ...[...STANDARD_VERBS_1, SP_FWD, ...STANDARD_NEW_VERBS.slice(0,3), ...STANDARD_VERBS_2, SP_BCK, ...STANDARD_NEW_VERBS.slice(3)].map((a,i) => ({...a, id: i+2})),
    { id: 32, verb: "Finish", type: "finish", emoji: "🏁" }
];

const GOLDEN_VERBS = [
    createVerb("Find treasure", "💎", { past_simple: "found treasure", present_continuous: "am finding treasure", future_simple: "will find treasure", present_simple: "find treasure", present_perfect: "have found treasure", past_continuous: "was finding treasure" }),
    createVerb("Fly a plane", "✈️", { past_simple: "flew a plane", present_continuous: "am flying a plane", future_simple: "will fly a plane", present_simple: "fly a plane", present_perfect: "have flown a plane", past_continuous: "was flying a plane" }),
    createVerb("Meet a King", "👑", { past_simple: "met a King", present_continuous: "am meeting a King", future_simple: "will meet a King", present_simple: "meet a King", present_perfect: "have met a King", past_continuous: "was meeting a King" }),
    createVerb("Buy a castle", "🏰", { past_simple: "bought a castle", present_continuous: "am buying a castle", future_simple: "will buy a castle", present_simple: "buy a castle", present_perfect: "have bought a castle", past_continuous: "was buying a castle" }),
    createVerb("Win a prize", "🏆", { past_simple: "won a prize", present_continuous: "am winning a prize", future_simple: "will win a prize", present_simple: "win a prize", present_perfect: "have won a prize", past_continuous: "was winning a prize" }),
    createVerb("See a dragon", "🐉", { past_simple: "saw a dragon", present_continuous: "am seeing a dragon", future_simple: "will see a dragon", present_simple: "see a dragon", present_perfect: "have seen a dragon", past_continuous: "was seeing a dragon" }),
    createVerb("Ride a horse", "🐎", { past_simple: "rode a horse", present_continuous: "am riding a horse", future_simple: "will ride a horse", present_simple: "ride a horse", present_perfect: "have ridden a horse", past_continuous: "was riding a horse" }),
    createVerb("Climb a mountain", "🏔️", { past_simple: "climbed a mountain", present_continuous: "am climbing a mountain", future_simple: "will climb a mountain", present_simple: "climb a mountain", present_perfect: "have climbed a mountain", past_continuous: "was climbing a mountain" }),
    createVerb("Build a pyramid", "🏗️", { past_simple: "built a pyramid", present_continuous: "am building a pyramid", future_simple: "will build a pyramid", present_simple: "build a pyramid", present_perfect: "have built a pyramid", past_continuous: "was building a pyramid" }),
    createVerb("Catch a fish", "🎣", { past_simple: "caught a fish", present_continuous: "am catching a fish", future_simple: "will catch a fish", present_simple: "catch a fish", present_perfect: "have caught a fish", past_continuous: "was catching a fish" }),
];

const GOLDEN_MIXED = [
    ...GOLDEN_VERBS.slice(0,5), STANDARD_VERBS_1[2], STANDARD_VERBS_1[4], STANDARD_VERBS_2[1], STANDARD_NEW_VERBS[0],
    ...GOLDEN_VERBS.slice(5), STANDARD_VERBS_2[5], STANDARD_NEW_VERBS[3], STANDARD_VERBS_1[1], STANDARD_VERBS_1[7],
    createVerb("Visit a museum", "🏛️", { past_simple: "visited a museum", present_continuous: "am visiting a museum", future_simple: "will visit a museum", present_simple: "visit a museum", present_perfect: "have visited a museum", past_continuous: "was visiting a museum" }),
    createVerb("Go to space", "🪐", { past_simple: "went to space", present_continuous: "am going to space", future_simple: "will go to space", present_simple: "go to space", present_perfect: "have gone to space", past_continuous: "was going to space" }),
    STANDARD_VERBS_2[0], STANDARD_NEW_VERBS[2],
];

const SP_GOLD_FWD = { verb: "Magic Carpet! +3", type: "forward", steps: 3, emoji: "🧞‍♂️" };
const SP_GOLD_BCK = { verb: "Sandstorm! Back -3", type: "backward", steps: -3, emoji: "🏜️" };
const SP_GOLD_TRAP = { verb: "Quicksand! Back -4", type: "backward", steps: -4, emoji: "😵‍💫" };

const DATA_GOLDEN = [
    { id: 1, verb: "Start", type: "start", emoji: "🏛️" },
    ...GOLDEN_MIXED.slice(0, 8).map((a,i) => ({...a, id: i+2})),
    SP_GOLD_FWD,
    ...GOLDEN_MIXED.slice(8, 16).map((a,i) => ({...a, id: i+11})),
    SP_GOLD_BCK,
    ...GOLDEN_MIXED.slice(16).map((a,i) => ({...a, id: i+20})),
    SP_GOLD_TRAP,
    { id: 99, verb: "Treasure!", type: "finish", emoji: "💰" }
].map((item, idx) => ({...item, id: idx + 1}));


// --- ОПТИМИЗАЦИЯ: УДАЛЕНИЕ ТЯЖЕЛЫХ ЭФФЕКТОВ ---
// Эта функция на лету удаляет тяжелое размытие из HTML, которое сажает FPS
function killHeavyBlurForFPS() {
    const classesToRemove = ['backdrop-blur-sm', 'backdrop-blur-md', 'backdrop-blur-lg', 'backdrop-blur-xl', 'backdrop-blur'];
    document.querySelectorAll('*').forEach(el => {
        classesToRemove.forEach(cls => {
            if(el.classList.contains(cls)) {
                el.classList.remove(cls);
                // Добавляем замену - обычный непрозрачный цвет, чтобы интерфейс остался красивым, но не лагал
                if(el.id === 'modal-overlay') el.classList.add('bg-slate-900/80');
                if(el.id === 'modal-content') el.classList.add('bg-white');
                if(el.id === 'header-container') el.classList.add('bg-white');
                if(el.id === 'controls-bar') el.classList.add('bg-white');
            }
        });
    });
}


// --- ПОДГОТОВКА ПОЛНОЭКРАННОГО РЕЖИМА ---
function injectFullscreenButton() {
    const headerFlex = document.querySelector('header .flex.gap-3');
    if (headerFlex && !document.getElementById('fs-btn-wrapper')) {
        const fsBtn = document.createElement('button');
        fsBtn.id = 'fs-btn-wrapper';
        fsBtn.className = "w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all hover:scale-110 hover:shadow-md cursor-pointer";
        fsBtn.innerHTML = '<i id="fs-icon" class="fa-solid fa-expand text-lg"></i>';
        fsBtn.onclick = toggleFullScreen;
        fsBtn.title = "Полноэкранный режим";
        headerFlex.insertBefore(fsBtn, headerFlex.firstChild);
    }
}

function toggleFullScreen() {
    const icon = document.getElementById('fs-icon');
    const elem = document.documentElement; // Используем <html> чтобы фон не чернел

    if (!document.fullscreenElement) {
        elem.requestFullscreen().then(() => {
            // Принудительно синхронизируем фон html с игрой
            elem.style.backgroundColor = document.body.style.backgroundColor || window.getComputedStyle(document.body).backgroundColor;
        }).catch(err => {
            console.warn(`Fullscreen error: ${err.message}`);
        });
        if(icon) { icon.classList.remove('fa-expand'); icon.classList.add('fa-compress'); }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            if(icon) { icon.classList.remove('fa-compress'); icon.classList.add('fa-expand'); }
        }
    }
}


// --- AUDIO MANAGER ---
class AudioManager {
    constructor() {
        this.bgTracks = [];
        for(let i=1; i<=10; i++) {
            const track = document.getElementById(`audio-bg-${i}`);
            if(track) this.bgTracks.push(track);
        }
        this.correctSound = document.getElementById('audio-correct');
        this.wrongSound = document.getElementById('audio-wrong');
        
        this.currentBg = null;
        this.isMusicPlaying = false;
        this.volume = 0.3;
        
        this.initVolume();
    }

    initVolume() {
        this.bgTracks.forEach(track => {
            if(track) track.volume = this.volume;
        });
        if(this.correctSound) this.correctSound.volume = Math.min(1, this.volume + 0.3);
        if(this.wrongSound) this.wrongSound.volume = Math.min(1, this.volume + 0.3);
    }

    setVolume(val) {
        this.volume = val / 100;
        this.initVolume();
    }

    playMusic() {
        if (!this.isMusicPlaying && this.bgTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.bgTracks.length);
            this.currentBg = this.bgTracks[randomIndex];
            this.currentBg.play().then(() => {
                this.isMusicPlaying = true;
            }).catch(e => console.log("Audio autoplay blocked until interaction."));
        }
    }
    
    changeTrack() {
        if(this.currentBg) {
            this.currentBg.pause();
            this.currentBg.currentTime = 0;
        }
        this.isMusicPlaying = false;
        this.playMusic();
    }

    playCorrect() {
        if(this.correctSound) {
            this.correctSound.currentTime = 0;
            this.correctSound.play().catch(e=>{});
        }
    }

    playWrong() {
        if(this.wrongSound) {
            this.wrongSound.currentTime = 0;
            this.wrongSound.play().catch(e=>{});
        }
    }
}


// --- MAIN GAME CLASS ---
class TimeTravelerGame {
    constructor() {
        this.mapType = 'standard'; 
        this.currentData = DATA_STANDARD;
        
        this.players = [
            { id: 0, name: "Учитель", pos: 0, colorClass: "bg-rose-500", avatar: "👨‍🏫" },
            { id: 1, name: "Ученик", pos: 0, colorClass: "bg-indigo-500", avatar: "🧑‍🎓" }
        ];
        this.currentPlayerIdx = 1; 
        this.gameState = 'idle'; 
        this.currentTask = null;
        this.turnStartPos = 0;
        
        this.score = { correct: 0, total: 0 };
        this.audio = new AudioManager();
        
        this.initPlayerElements();
        
        this.initBoard();
        this.updateControls();
        this.renderSettings();
        this.updateActiveModesCount();
        this.updateTheme(); 
        
        injectFullscreenButton();
    }
    
    initPlayerElements() {
        this.playerNodes = {};
        this.players.forEach(p => {
            const token = document.createElement('div');
            token.className = `w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-sm md:text-base text-white ${p.colorClass} transition-all duration-300 relative z-30 ring-2 ring-black/10`;
            token.style.willChange = "transform"; // Подсказка браузеру для ускорения анимации
            token.innerHTML = p.avatar;
            token.title = p.name;
            this.playerNodes[p.id] = token;
        });
    }

    setMap(type) {
        this.mapType = type;
        this.currentData = type === 'golden' ? DATA_GOLDEN : DATA_STANDARD;
        
        document.getElementById('btn-map-standard').classList.remove('ring-4', 'ring-indigo-300', 'bg-indigo-50');
        document.getElementById('btn-map-golden').classList.remove('ring-4', 'ring-yellow-300', 'bg-yellow-50');
        
        if(type === 'golden') {
            document.getElementById('btn-map-golden').classList.add('ring-4', 'ring-yellow-300', 'bg-yellow-50');
        } else {
            document.getElementById('btn-map-standard').classList.add('ring-4', 'ring-indigo-300', 'bg-indigo-50');
        }

        this.updateTheme();
        this.resetGame();
    }

    updateTheme() {
        const body = document.getElementById('app-body');
        const html = document.documentElement; // Для полноэкранного режима
        const header = document.getElementById('header-container');
        const title = document.getElementById('game-title');
        
        const bgColor = this.mapType === 'golden' ? "#fef3c7" : "#f8fafc";
        
        // Меняем цвет и для body, и для html
        if(useGsap) {
            gsap.to(body, { duration: 1, backgroundColor: bgColor });
            gsap.to(html, { duration: 1, backgroundColor: bgColor });
        } else {
            body.style.backgroundColor = bgColor;
            html.style.backgroundColor = bgColor;
        }

        if (this.mapType === 'golden') {
            body.classList.replace('bg-slate-50', 'bg-amber-50');
            header.classList.replace('border-white/50', 'border-amber-200/50');
            header.classList.add('bg-gradient-to-r', 'from-amber-50/90', 'to-yellow-100/90');
            title.classList.replace('from-indigo-700', 'from-amber-600');
            title.classList.replace('to-purple-700', 'to-yellow-600');
        } else {
            body.classList.replace('bg-amber-50', 'bg-slate-50');
            header.classList.replace('border-amber-200/50', 'border-white/50');
            header.classList.remove('bg-gradient-to-r', 'from-amber-50/90', 'to-yellow-100/90');
            title.classList.replace('from-amber-600', 'from-indigo-700');
            title.classList.replace('to-yellow-600', 'to-purple-700');
        }
    }

    initBoard() {
        const board = document.getElementById('game-board');
        if (!board) return;
        board.innerHTML = '';
        
        if (this.mapType === 'golden') {
            board.className = "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4 justify-center p-2";
        } else {
            board.className = "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-5";
        }

        this.currentData.forEach((cell, index) => {
            const el = document.createElement('div');
            
            let baseClasses = "relative aspect-square flex flex-col items-center justify-center transition-transform duration-200 cursor-default hover:-translate-y-1 hover:shadow-md hover:scale-105 z-10 hover:z-20";
            let styleClasses = "";
            
            if (this.mapType === 'golden') {
                baseClasses += " rounded-full border-[3px] shadow-sm p-1 bg-gradient-to-br";
                if (cell.type === 'start') styleClasses = "from-emerald-100 to-emerald-200 border-emerald-400 text-emerald-900 golden-glow";
                else if (cell.type === 'finish') styleClasses = "from-yellow-200 to-amber-300 border-amber-500 text-amber-900 golden-glow ring-4 ring-yellow-100/50";
                else if (cell.type === 'forward') styleClasses = "from-sky-100 to-sky-200 border-sky-400 text-sky-900";
                else if (cell.type === 'backward') styleClasses = "from-rose-100 to-rose-200 border-rose-400 text-rose-900";
                else styleClasses = "from-amber-50 to-amber-200 border-amber-300 text-amber-900";
            } else {
                baseClasses += " rounded-2xl border-2 shadow-sm p-2 bg-white"; 
                if (cell.type === 'start') styleClasses = "bg-emerald-50 border-emerald-300";
                else if (cell.type === 'finish') styleClasses = "bg-yellow-50 border-yellow-400";
                else if (cell.type === 'forward') styleClasses = "bg-blue-50 border-blue-300";
                else if (cell.type === 'backward') styleClasses = "bg-red-50 border-red-300";
                else styleClasses = "border-slate-200 hover:border-indigo-300";
            }

            el.className = `${baseClasses} ${styleClasses}`;
            el.id = `cell-${index}`;
            
            const emojiSize = this.mapType === 'golden' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl';
            const textSize = this.mapType === 'golden' ? 'text-[9px] md:text-[11px]' : 'text-[10px] md:text-xs';

            const content = `
                <span class="absolute top-1 left-2 text-[10px] font-black opacity-30 text-slate-500">${index}</span>
                ${cell.type === 'forward' ? '<i class="fa-solid fa-bolt absolute top-3 right-3 opacity-60 text-sky-500 text-xs"></i>' : ''}
                ${cell.type === 'backward' ? '<i class="fa-solid fa-triangle-exclamation absolute top-3 right-3 opacity-60 text-rose-500 text-xs"></i>' : ''}
                
                <div class="${emojiSize} mb-2 z-10 transition-transform duration-300 group-hover:scale-110">
                    ${cell.emoji}
                </div>

                <div class="text-center ${textSize} font-bold leading-tight px-1 break-words w-full z-10 text-slate-700">
                    ${cell.verb}
                </div>
                
                <div class="absolute bottom-[-10px] left-0 w-full flex justify-center gap-1 z-30 pointer-events-none" id="players-cell-${index}">
                </div>
            `;
            el.innerHTML = content;
            board.appendChild(el);
        });

        this.renderPlayers();
    }

    renderPlayers(animateTarget = null) {
        this.players.forEach(p => {
            if (p.pos >= this.currentData.length) p.pos = this.currentData.length - 1;

            const container = document.getElementById(`players-cell-${p.pos}`);
            if (container) {
                const token = this.playerNodes[p.id];
                container.appendChild(token); 
                
                if(animateTarget && p.id === this.players[this.currentPlayerIdx].id && useGsap) {
                    gsap.fromTo(token, 
                        { y: -20, scale: 1.1 }, 
                        { y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
                    );
                }
            }
        });
    }

    updateControls() {
        const p = this.players[this.currentPlayerIdx];
        const avatarEl = document.getElementById('current-player-avatar');
        const nameEl = document.getElementById('current-player-name');
        const btnRoll = document.getElementById('btn-roll');
        
        if (!avatarEl || !nameEl || !btnRoll) return;

        avatarEl.className = `w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner text-white transition-all duration-500 transform hover:scale-105 z-10 relative ${p.colorClass}`;
        avatarEl.innerHTML = p.avatar;
        
        const glow = avatarEl.nextElementSibling;
        if(glow) glow.className = `absolute inset-0 blur-md opacity-40 rounded-2xl -z-10 animate-pulse ${p.colorClass}`;
        
        nameEl.textContent = p.name;

        if (this.gameState === 'idle') {
            btnRoll.disabled = false;
            btnRoll.classList.remove('bg-slate-300', 'cursor-not-allowed', 'hover:shadow-none', 'active:translate-y-0');
            btnRoll.classList.add('bg-indigo-600', 'hover:bg-indigo-500', 'hover:-translate-y-1', 'active:shadow-md');
            btnRoll.innerHTML = '<span>Roll Dice</span> <i class="fa-solid fa-dice text-2xl"></i>';
        } else {
            btnRoll.disabled = true;
            btnRoll.className = 'h-14 px-8 rounded-2xl font-black text-white shadow-sm flex items-center gap-3 bg-slate-300 cursor-not-allowed text-lg opacity-80';
            btnRoll.innerHTML = this.gameState === 'moving' ? '<i class="fa-solid fa-spinner animate-spin"></i> Moving...' : '<i class="fa-solid fa-hourglass-half"></i> Wait...';
        }
    }

    renderSettings() {
        const list = document.getElementById('tenses-list');
        if(!list) return;
        list.innerHTML = '';
        
        Object.values(TENSE_CONFIG).forEach(cfg => {
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 transition-colors shadow-sm";
            
            div.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-5 h-5 rounded-full ${cfg.color.split(' ')[0]} border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                    <div>
                        <span class="font-extrabold text-slate-700 block leading-tight">${cfg.label}</span>
                        <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">${cfg.hint}</span>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="${cfg.id}" class="sr-only peer" ${cfg.active ? 'checked' : ''} onchange="game.toggleTense('${cfg.id}')">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
                </label>
            `;
            list.appendChild(div);
        });

        const volSlider = document.getElementById('volume-slider');
        const volDisplay = document.getElementById('vol-display');
        if (volSlider && volDisplay) {
            volSlider.value = this.audio.volume * 100;
            volDisplay.textContent = `${volSlider.value}%`;
            
            volSlider.addEventListener('input', (e) => {
                volDisplay.textContent = `${e.target.value}%`;
                this.audio.setVolume(e.target.value);
            });
        }
    }

    toggleTense(id) {
        TENSE_CONFIG[id].active = !TENSE_CONFIG[id].active;
        const activeCount = Object.values(TENSE_CONFIG).filter(c => c.active).length;
        if (activeCount === 0) {
            TENSE_CONFIG[id].active = true;
            this.renderSettings(); 
            alert("At least one tense must be active!");
        }
    }

    toggleSettings() {
        this.showModal('settings');
    }

    saveSettings() {
        this.updateActiveModesCount();
        this.hideModal();
    }

    updateActiveModesCount() {
        const counter = document.getElementById('active-modes-count');
        if (!counter) return;
        const count = Object.values(TENSE_CONFIG).filter(c => c.active).length;
        counter.textContent = `${count} modes active • ${this.mapType === 'golden' ? '👑 Golden Map' : '🏫 Standard Map'}`;
    }

    rollDice() {
        if (this.gameState !== 'idle') return;
        
        this.audio.playMusic();

        this.turnStartPos = this.players[this.currentPlayerIdx].pos;
        this.gameState = 'moving';
        this.updateControls();

        const diceDisplay = document.getElementById('dice-display');
        const diceValue = document.getElementById('dice-value');
        diceDisplay.classList.remove('hidden');
        
        if(useGsap) {
            gsap.fromTo(diceDisplay, 
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.5)" }
            );
        }
        
        diceValue.innerHTML = '<i class="fa-solid fa-dice text-slate-300 animate-spin"></i>';

        const maxRoll = this.currentPlayerIdx === 0 ? 4 : 6;

        setTimeout(() => {
            const roll = Math.floor(Math.random() * maxRoll) + 1;
            diceValue.innerHTML = `<span class="text-indigo-600">${roll}</span>`;
            
            if(useGsap) {
                gsap.fromTo(diceValue, {scale: 0.5}, {scale: 1.2, yoyo: true, repeat: 1, duration: 0.2});
            }
            
            let targetPos = this.players[this.currentPlayerIdx].pos + roll;
            if (targetPos >= this.currentData.length - 1) targetPos = this.currentData.length - 1;

            setTimeout(() => {
                this.moveStepByStep(this.players[this.currentPlayerIdx].pos, targetPos, 'forward');
            }, 400); 
            
        }, 600);
    }

    moveStepByStep(currentPos, targetPos, type) {
        if (currentPos === targetPos) {
            if (type === 'return') {
                setTimeout(() => this.endTurn(), 300);
            } else {
                setTimeout(() => this.handleLanding(targetPos), 200);
            }
            return;
        }

        const direction = targetPos > currentPos ? 1 : -1;
        const nextPos = currentPos + direction;

        this.players[this.currentPlayerIdx].pos = nextPos;
        this.renderPlayers(true);

        setTimeout(() => {
            this.moveStepByStep(nextPos, targetPos, type);
        }, 250); 
    }

    handleLanding(pos) {
        const cell = this.currentData[pos];

        if (cell.type === 'finish') {
            this.showWin();
            return;
        }
        if (cell.type === 'start') {
            this.endTurn();
            return;
        }
        if (cell.type === 'forward' || cell.type === 'backward') {
            this.showModal('special', cell);
            setTimeout(() => {
                this.hideModal();
                let newTarget = pos + cell.steps;
                if (newTarget < 0) newTarget = 0;
                if (newTarget >= this.currentData.length - 1) newTarget = this.currentData.length - 1;
                this.moveStepByStep(pos, newTarget, 'return'); 
            }, 2000); 
            return;
        }

        this.startTask(cell);
    }

    startTask(cell) {
        const activeTenses = Object.values(TENSE_CONFIG).filter(c => c.active);
        const randomTense = activeTenses[Math.floor(Math.random() * activeTenses.length)];
        const randomPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];

        this.currentTask = {
            cell: cell,
            targetTime: randomTense,
            pronoun: randomPronoun
        };
        
        this.gameState = 'task';
        this.showModal('task');
        this.spinTime();
    }

    spinTime() {
        const timeCard = document.getElementById('time-card');
        const timeLabel = document.getElementById('time-label');
        const timeHint = document.getElementById('time-hint');
        const showBtn = document.getElementById('btn-show-answer');
        const spinnerTxt = document.getElementById('time-spinner-text');
        
        showBtn.disabled = true;
        showBtn.classList.add('opacity-50', 'cursor-wait');
        spinnerTxt.classList.remove('hidden');

        let counter = 0;
        const activeTenses = Object.values(TENSE_CONFIG).filter(c => c.active);

        // ОПТИМИЗАЦИЯ: Никаких сложных перестроений классов во время быстрого кручения, только замена базового цвета!
        const interval = setInterval(() => {
            const mode = activeTenses[counter % activeTenses.length];
            timeLabel.textContent = mode.label;
            timeHint.textContent = mode.hint;
            timeCard.className = `flex flex-col items-center justify-center px-8 py-5 rounded-2xl border-4 min-w-[200px] ${mode.color}`;
            counter++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const finalMode = this.currentTask.targetTime;
            
            timeLabel.textContent = finalMode.label;
            timeHint.textContent = finalMode.hint;
            timeCard.className = `flex flex-col items-center justify-center px-8 py-5 rounded-2xl border-4 min-w-[200px] shadow-xl transform scale-105 transition-transform duration-300 ${finalMode.color}`;
            
            showBtn.disabled = false;
            showBtn.classList.remove('opacity-50', 'cursor-wait');
            spinnerTxt.classList.add('hidden');
            
            document.getElementById('loading-icon').classList.add('hidden');
            document.getElementById('waiting-text').textContent = 'Say the sentence out loud...';

        }, 1500); 
    }

    getConjugatedAnswer(tenseId, phrase, pronoun) {
        const isThirdPerson = ['He', 'She', 'It'].includes(pronoun);
        const isSecondPlural = ['You', 'We', 'They'].includes(pronoun);

        let words = phrase.split(' ');
        let firstWord = words[0];
        let rest = words.slice(1).join(' ');

        if (firstWord === 'am') {
            if (isThirdPerson) return `is ${rest}`;
            if (isSecondPlural) return `are ${rest}`;
            return phrase; 
        }
        if (firstWord === 'was') {
            if (isSecondPlural) return `were ${rest}`;
            return phrase; 
        }
        if (firstWord === 'have') {
            if (isThirdPerson) return `has ${rest}`;
            return phrase;
        }

        if (tenseId === 'present_simple' && isThirdPerson) {
             if (firstWord === 'have') return `has ${rest}`;
             if (firstWord === 'go') return `goes ${rest}`;
             if (firstWord === 'do') return `does ${rest}`;
             if (firstWord === 'wash' || firstWord === 'watch' || firstWord === 'brush' || firstWord === 'catch') return `${firstWord}es ${rest}`;
             
             if (firstWord.endsWith('y')) {
                 const vowels = ['a','e','i','o','u'];
                 if (!vowels.includes(firstWord[firstWord.length-2])) {
                     return `${firstWord.substring(0, firstWord.length-1)}ies ${rest}`;
                 }
             }
             return `${firstWord}s ${rest}`;
        }
        return phrase;
    }

    showAnswer() {
        document.getElementById('btn-show-answer').classList.add('hidden');
        const gradingBtns = document.getElementById('grading-buttons');
        gradingBtns.classList.remove('hidden');
        gradingBtns.classList.add('flex');
        
        document.getElementById('answer-waiting').classList.add('hidden');
        document.getElementById('answer-revealed').classList.remove('hidden');
        
        const baseForm = this.currentTask.cell.forms[this.currentTask.targetTime.id];
        const finalPhrase = this.getConjugatedAnswer(this.currentTask.targetTime.id, baseForm, this.currentTask.pronoun);

        document.getElementById('answer-full-text').innerHTML = `${this.currentTask.pronoun} ${finalPhrase}`;
    }

    handleCorrect() {
        this.audio.playCorrect();
        this.score.correct++;
        this.score.total++;
        this.hideModal();
        this.endTurn();
    }

    handleIncorrect() {
        this.audio.playWrong();
        this.score.total++; 
        this.hideModal();
        this.moveStepByStep(this.players[this.currentPlayerIdx].pos, this.turnStartPos, 'return');
    }

    endTurn() {
        this.currentPlayerIdx = this.currentPlayerIdx === 0 ? 1 : 0;
        this.gameState = 'idle';
        this.currentTask = null;
        
        if(useGsap) {
            gsap.to('#dice-display', { scale: 0, opacity: 0, duration: 0.2, onComplete: () => {
                document.getElementById('dice-display').classList.add('hidden');
            }});
        } else {
            document.getElementById('dice-display').classList.add('hidden');
        }
        
        this.updateControls();
    }

    resetGame() {
        this.players.forEach(p => p.pos = 0);
        this.currentPlayerIdx = 1;
        this.gameState = 'idle';
        this.score = { correct: 0, total: 0 };
        this.initBoard(); 
        this.updateControls();
        this.hideModal(); 
        
        const views = ['view-special', 'view-task', 'view-win', 'view-settings', 'view-criteria'];
        views.forEach(v => document.getElementById(v).classList.add('hidden'));

        document.getElementById('dice-display').classList.add('hidden');
        this.audio.changeTrack();
    }

    // --- UI HELPERS ---
    showModal(type, data = null) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        const views = ['view-special', 'view-task', 'view-win', 'view-settings', 'view-criteria'];
        
        views.forEach(v => document.getElementById(v).classList.add('hidden'));

        overlay.classList.remove('hidden');
        document.getElementById('modal-close-btn').classList.add('hidden');

        if(useGsap) {
            gsap.killTweensOf(overlay);
            gsap.killTweensOf(content);
            gsap.set(overlay, { opacity: 1 });
            gsap.set(content, { clearProps: "all" });
            
            gsap.fromTo(content, 
                { scale: 0.9, opacity: 0, y: 20 }, 
                { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        } else {
            overlay.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }

        if (type === 'special') {
            document.getElementById('view-special').classList.remove('hidden');
            
            const emojiEl = document.getElementById('special-emoji');
            emojiEl.textContent = data.emoji;
            document.getElementById('special-title').textContent = data.verb;

            const borderColor = data.type === 'forward' ? 'from-sky-400 to-blue-600' : 'from-rose-400 to-red-600';
            document.getElementById('modal-stripe').className = `absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${borderColor}`;
            
        } else if (type === 'task') {
            document.getElementById('view-task').classList.remove('hidden');
            document.getElementById('task-emoji').textContent = this.currentTask.cell.emoji;
            document.getElementById('task-verb').textContent = this.currentTask.cell.verb;
            document.getElementById('task-pronoun').textContent = this.currentTask.pronoun;
            
            document.getElementById('btn-show-answer').classList.remove('hidden');
            document.getElementById('grading-buttons').classList.add('hidden');
            document.getElementById('grading-buttons').classList.remove('flex');
            document.getElementById('answer-waiting').classList.remove('hidden');
            document.getElementById('answer-revealed').classList.add('hidden');
            document.getElementById('loading-icon').classList.remove('hidden');
            document.getElementById('waiting-text').textContent = 'Determining timeline...';
            
            document.getElementById('modal-stripe').className = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-300 to-slate-400";

        } else if (type === 'win') {
           this.showWin();

        } else if (type === 'settings') {
            document.getElementById('view-settings').classList.remove('hidden');
            document.getElementById('modal-close-btn').classList.remove('hidden');
            document.getElementById('modal-stripe').className = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-700 to-slate-900";
        }
    }

    showWin(fromCriteria = false) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        
        if(fromCriteria) {
            document.getElementById('view-criteria').classList.add('hidden');
            document.getElementById('view-win').classList.remove('hidden');
        } else {
            overlay.classList.remove('hidden');
            
            if(useGsap) {
                gsap.killTweensOf(overlay);
                gsap.set(overlay, { opacity: 1 });
            } else {
                overlay.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
            
            const views = ['view-special', 'view-task', 'view-settings', 'view-criteria'];
            views.forEach(v => document.getElementById(v).classList.add('hidden'));
            document.getElementById('view-win').classList.remove('hidden');
            
            if (typeof confetti === 'function') {
                const duration = 3000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#4f46e5', '#10b981', '#f59e0b'] });
                    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#4f46e5', '#10b981', '#f59e0b'] });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            }
        }

        document.getElementById('modal-stripe').className = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-amber-500";
        
        const winner = this.players[this.currentPlayerIdx];
        const wName = document.getElementById('winner-name');
        wName.textContent = winner.name;
        wName.className = `font-black px-4 py-2 rounded-xl text-white shadow-lg inline-block transform hover:scale-105 transition-transform ${winner.colorClass}`;

        const total = this.score.total > 0 ? this.score.total : 1;
        const percent = Math.round((this.score.correct / total) * 100);
        
        document.getElementById('score-correct').textContent = this.score.correct;
        document.getElementById('score-total').textContent = this.score.total;
        
        const percentEl = document.getElementById('score-percent');
        if(useGsap) {
            gsap.fromTo(percentEl, { innerHTML: 0 }, { 
                innerHTML: percent, 
                duration: 1.5, 
                snap: { innerHTML: 1 },
                onUpdate: function() { percentEl.innerHTML = Math.round(this.targets()[0].innerHTML) + '%'; }
            });
        } else {
            percentEl.textContent = percent + '%';
        }

        let grade = 2;
        let gradeClass = "text-rose-500";
        if (percent >= 85) { grade = 5; gradeClass = "text-emerald-500"; }
        else if (percent >= 70) { grade = 4; gradeClass = "text-blue-500"; }
        else if (percent >= 50) { grade = 3; gradeClass = "text-amber-500"; }
        
        const gradeEl = document.getElementById('final-grade');
        gradeEl.textContent = grade;
        gradeEl.className = `text-7xl font-black mt-2 drop-shadow-md ${gradeClass}`;
    }

    toggleCriteria() {
        document.getElementById('view-win').classList.add('hidden');
        document.getElementById('view-criteria').classList.remove('hidden');
    }

    hideModal() {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        
        if(useGsap) {
            gsap.to(content, { scale: 0.9, opacity: 0, y: 20, duration: 0.2, ease: "power2.in" });
            gsap.to(overlay, { opacity: 0, duration: 0.2, delay: 0.05, onComplete: () => {
                overlay.classList.add('hidden');
                const views = ['view-special', 'view-task', 'view-win', 'view-settings', 'view-criteria'];
                views.forEach(v => document.getElementById(v).classList.add('hidden'));
            }});
        } else {
            overlay.classList.add('opacity-0');
            content.classList.add('scale-95');
            content.classList.remove('scale-100');
            setTimeout(() => {
                overlay.classList.add('hidden');
                const views = ['view-special', 'view-task', 'view-win', 'view-settings', 'view-criteria'];
                views.forEach(v => document.getElementById(v).classList.add('hidden'));
            }, 300);
        }
    }
}

function bootApp() {
    try {
        killHeavyBlurForFPS(); // Включаем режим максимального FPS!
        
        if (!window.game) {
            window.game = new TimeTravelerGame();
        }
    } catch (err) {
        console.error("Critical boot error:", err);
        const counter = document.getElementById('active-modes-count');
        if (counter) counter.textContent = "Error: " + err.message;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
