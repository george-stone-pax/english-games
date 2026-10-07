const questPrompts = [
  { prompt: 'Choose the correct sentence: "Я уже закончил домашнее задание."', options: ["I already finished my homework.", "I have already finished my homework.", "I has already finish my homework.", "I am already finish my homework."], answer: 1, note: "Present Perfect связывает результат с настоящим: have + третья форма глагола." },
  { prompt: 'What does "borrow" mean?', options: ["Отдавать", "Покупать", "Брать взаймы", "Находить"], answer: 2, note: "Borrow значит взять что-то на время и вернуть позже." },
  { prompt: 'Complete: "If it rains, we ___ at home."', options: ["stay", "will stay", "stayed", "would stayed"], answer: 1, note: "В First Conditional после if используем Present Simple, а в главной части will + глагол." },
  { prompt: 'Which word is the opposite of "careful"?', options: ["Helpful", "Careless", "Quiet", "Kind"], answer: 1, note: "Суффикс -less означает отсутствие качества: careless значит неосторожный." },
  { prompt: 'Choose the right preposition: "She is good ___ drawing."', options: ["in", "at", "on", "for"], answer: 1, note: "Устойчивое сочетание: be good at something." },
  { prompt: 'What is the past form of "teach"?', options: ["Teached", "Taught", "Tought", "Teaching"], answer: 1, note: "Teach is irregular: teach, taught, taught." },
  { prompt: 'Complete: "There isn\'t ___ milk in the fridge."', options: ["many", "a few", "much", "several"], answer: 2, note: "Milk неисчисляемое, поэтому в отрицании используем much." },
  { prompt: 'Which phrase means "мне всё равно"?', options: ["I don\'t mind.", "I don\'t care of.", "I not matter.", "I don\'t matters."], answer: 0, note: "I don\'t mind означает «я не против» или «мне всё равно» в зависимости от контекста." },
];

const questRoot = document.getElementById("daily-quest");
if (questRoot) {
  const promptNode = document.getElementById("quest-prompt");
  const optionsNode = document.getElementById("quest-options");
  const feedbackNode = document.getElementById("quest-feedback");
  const streakNode = document.getElementById("quest-streak");
  const dateNode = document.getElementById("quest-date");
  const progressNode = document.getElementById("quest-progress-bar");
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterdayDate = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  const storageKey = "english-os-daily-quest-v1";
  const challenge = questPrompts[Math.floor(Date.now() / 86400000) % questPrompts.length];
  let progress = {};

  try {
    progress = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (_) {
    progress = {};
  }

  const answeredToday = progress.lastDate === today;
  const activeStreak = answeredToday || progress.lastDate === yesterdayDate ? (progress.streak || 0) : 0;
  const streakLabel = (value) => `${value} ${value === 1 ? "день" : value > 1 && value < 5 ? "дня" : "дней"}`;
  dateNode.textContent = `ЗАДАНИЕ НА СЕГОДНЯ · ${now.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }).toUpperCase()}`;
  promptNode.textContent = challenge.prompt;
  streakNode.textContent = `🔥 Серия: ${streakLabel(activeStreak)}`;

  challenge.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quest-answer";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (button.disabled || answeredToday) return;
      if (index !== challenge.answer) {
        button.classList.add("is-wrong");
        feedbackNode.textContent = "Почти! Попробуй ещё раз.";
        feedbackNode.classList.add("is-wrong");
        window.setTimeout(() => button.classList.remove("is-wrong"), 700);
        return;
      }

      button.classList.add("is-correct");
      optionsNode.querySelectorAll("button").forEach((answerButton) => { answerButton.disabled = true; });
      const streak = progress.lastDate === yesterdayDate ? (progress.streak || 0) + 1 : 1;
      progress = { lastDate: today, streak };
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (_) {}
      streakNode.textContent = `🔥 Серия: ${streakLabel(streak)}`;
      feedbackNode.classList.remove("is-wrong");
      feedbackNode.textContent = `Верно! ${challenge.note} Возвращайся за новым заданием завтра.`;
      progressNode.style.width = "100%";
      document.getElementById("quest-title").textContent = "Отличная работа!";
    });
    optionsNode.appendChild(button);
  });

  if (answeredToday) {
    optionsNode.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    optionsNode.querySelectorAll("button")[challenge.answer]?.classList.add("is-correct");
    feedbackNode.textContent = "Сегодняшнее задание уже выполнено. Загляни завтра за новым!";
    progressNode.style.width = "100%";
    document.getElementById("quest-title").textContent = "Ты уже в деле!";
  }
}
