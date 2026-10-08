const questPrompts = [
  {
    prompt: 'Choose the correct sentence: "Я уже закончил домашнее задание."',
    options: [
      "I already finished my homework.",
      "I have already finished my homework.",
      "I has already finish my homework.",
      "I am already finish my homework.",
    ],
    answer: 1,
    note: "Present Perfect связывает результат с настоящим: have + третья форма глагола.",
  },
  {
    prompt: 'What does "borrow" mean?',
    options: ["Отдавать", "Покупать", "Брать взаймы", "Находить"],
    answer: 2,
    note: "Borrow значит взять что-то на время и вернуть позже.",
  },
  {
    prompt: 'Complete: "If it rains, we ___ at home."',
    options: ["stay", "will stay", "stayed", "would stayed"],
    answer: 1,
    note: "В First Conditional после if используем Present Simple, а в главной части will + глагол.",
  },
  {
    prompt: 'Which word is the opposite of "careful"?',
    options: ["Helpful", "Careless", "Quiet", "Kind"],
    answer: 1,
    note: "Суффикс -less означает отсутствие качества: careless значит неосторожный.",
  },
  {
    prompt: 'Choose the right preposition: "She is good ___ drawing."',
    options: ["in", "at", "on", "for"],
    answer: 1,
    note: "Устойчивое сочетание: be good at something.",
  },
  {
    prompt: 'What is the past form of "teach"?',
    options: ["Teached", "Taught", "Tought", "Teaching"],
    answer: 1,
    note: "Teach — неправильный глагол: teach, taught, taught.",
  },
  {
    prompt: 'Complete: "There isn\'t ___ milk in the fridge."',
    options: ["many", "a few", "much", "several"],
    answer: 2,
    note: "Milk неисчисляемое, поэтому в отрицании используем much.",
  },
  {
    prompt: 'Which phrase means "мне всё равно"?',
    options: [
      "I don\'t mind.",
      "I don\'t care of.",
      "I not matter.",
      "I don\'t matters.",
    ],
    answer: 1,
    note: "I don\'t care означает «я не против» или «мне всё равно».",
  },
  {
    prompt: 'Choose the right preposition: "She is interested ___ art."',
    options: ["in", "at", "on", "with"],
    answer: 0,
    note: "Устойчивое сочетание: be interested in something.",
  },
  {
    prompt: 'Complete: "She is ___ than her brother."',
    options: ["taller", "more tall", "tallest", "as tall"],
    answer: 0,
    note: "Для коротких прилагательных сравнительная степень образуется суффиксом -er: taller.",
  },
  {
    prompt: 'What is the past form of "buy"?',
    options: ["Buyed", "Bought", "Brought", "Buying"],
    answer: 1,
    note: "Buy — неправильный глагол: buy, bought, bought.",
  },
  {
    prompt: 'Complete: "How ___ apples did you buy?"',
    options: ["many", "much", "little", "any"],
    answer: 0,
    note: "Apples — исчисляемое существительное во множественном числе, поэтому используем many.",
  },
  {
    prompt: 'What does "lend" mean?',
    options: ["Брать взаймы", "Одалживать", "Продавать", "Искать"],
    answer: 1,
    note: "Lend означает давать что-то во временное пользование (в отличие от borrow — брать).",
  },
  {
    prompt: 'Choose the correct article: "He is ___ English teacher."',
    options: ["a", "an", "the", "-"],
    answer: 1,
    note: "Перед словами, начинающимися с гласного звука (English), используется неопределенный артикль an.",
  },
  {
    prompt: 'Complete: "Look! It ___ outside."',
    options: ["rains", "rain", "is raining", "rained"],
    answer: 2,
    note: "Слово Look указывает на действие, происходящее прямо сейчас (Present Continuous).",
  },
  {
    prompt: 'Choose the right preposition: "We usually meet ___ Monday."',
    options: ["in", "on", "at", "for"],
    answer: 1,
    note: "С днями недели всегда используется предлог on.",
  },
  {
    prompt: 'Complete: "You ___ study hard if you want to pass the exam."',
    options: ["should", "would", "had", "are"],
    answer: 0,
    note: "Should используется для дачи советов и рекомендаций.",
  },
  {
    prompt: 'What is the past form of "go"?',
    options: ["Goed", "Gone", "Went", "Going"],
    answer: 2,
    note: "Вторая форма глагола go — went (Past Simple).",
  },
  {
    prompt: 'What does the phrasal verb "look for" mean?',
    options: ["Смотреть на", "Искать", "Ухаживать за", "Проверять"],
    answer: 1,
    note: "Phrasal verb: look for = пытаться найти что-то.",
  },
  {
    prompt: 'Choose the right preposition: "It depends ___ the weather."',
    options: ["from", "in", "on", "of"],
    answer: 2,
    note: "Глагол depend сочетается с предлогом on (зависеть от).",
  },
  {
    prompt: 'Which word is the opposite of "expensive"?',
    options: ["Cheap", "Fast", "Heavy", "Small"],
    answer: 0,
    note: "Cheap означает «дешевый», что противоположно expensive («дорогой»).",
  },
  {
    prompt: 'Complete: "This hat is not yours, it is ___."',
    options: ["my", "mine", "me", "myself"],
    answer: 1,
    note: "Абсолютная форма притяжательного местоимения в конце предложения — mine.",
  },
  {
    prompt: 'Complete: "They have lived here ___ 2010."',
    options: ["for", "since", "from", "during"],
    answer: 1,
    note: "Since указывает на точку отсчета во времени (начиная с какого-то года).",
  },
  {
    prompt: 'Complete: "You like playing football, ___?"',
    options: ["don't you", "aren't you", "doesn't you", "not you"],
    answer: 0,
    note: "В разделительном вопросе (tag question) с Present Simple используем don't/doesn't.",
  },
  {
    prompt: 'Which phrase means "Не за что"?',
    options: [
      "You\'re welcome.",
      "No problem to you.",
      "Not at all please.",
      "Don\'t mind it.",
    ],
    answer: 0,
    note: "You're welcome — стандартный вежливый ответ на спасибо.",
  },
  {
    prompt: 'What is the 3rd form (past participle) of "write"?',
    options: ["Wrote", "Writed", "Writing", "Written"],
    answer: 3,
    note: "Формы глагола write: write, wrote, written.",
  },
  {
    prompt: 'Choose the correct verb: "___ homework"',
    options: ["Make", "Do", "Create", "Work"],
    answer: 1,
    note: "Устойчивое выражение: do homework (выполнять домашнюю работу).",
  },
  {
    prompt: 'What is the plural form of "child"?',
    options: ["Childs", "Childrens", "Children", "Childes"],
    answer: 2,
    note: "Child — исключение во множественном числе: children.",
  },
  {
    prompt: 'Choose the right adjective: "I am ___ in history."',
    options: ["interested", "interesting", "interest", "interests"],
    answer: 0,
    note: "Окончание -ed описывает чувства человека (interested), а -ing — свойства предмета (interesting).",
  },
  {
    prompt: 'Choose the right preposition: "I usually go to bed ___ night."',
    options: ["in", "at", "on", "by"],
    answer: 1,
    note: "С временем суток night используется предлог at (at night), в отличие от in the morning/evening.",
  },
  {
    prompt: 'Complete: "___ you speak French?"',
    options: ["Can", "Are", "Does", "Have"],
    answer: 0,
    note: "Модальный глагол Can используется для выражения умений и навыков.",
  },
  {
    prompt: 'Complete: "If she ___ hard, she will succeed."',
    options: ["work", "works", "worked", "will work"],
    answer: 1,
    note: "В First Conditional в придаточном условии (после if) с she глагол получает окончание -s (Present Simple).",
  },
  {
    prompt: 'Which word is the opposite of "heavy"?',
    options: ["Dark", "Hard", "Light", "Weak"],
    answer: 2,
    note: "Light означает «легкий», противоположно heavy («тяжелый»).",
  },
  {
    prompt:
      'Choose the right preposition: "Don\'t spend all your money ___ sweets."',
    options: ["for", "on", "in", "to"],
    answer: 1,
    note: "Глагол spend (тратить) употребляется с предлогом on.",
  },
  {
    prompt: 'What is the past form of "think"?',
    options: ["Thinked", "Thought", "Taught", "Thanked"],
    answer: 1,
    note: "Think — неправильный глагол: think, thought, thought.",
  },
  {
    prompt: 'Complete: "I have ___ friends who live in London."',
    options: ["a few", "a little", "much", "any"],
    answer: 0,
    note: "A few используется с исчисляемыми существительными во множественном числе в значении «несколько».",
  },
  {
    prompt:
      'Choose the correct form: "Mount Everest is the ___ mountain in the world."',
    options: ["high", "higher", "highest", "most high"],
    answer: 2,
    note: "Превосходная степень односложных прилагательных образуется с помощью артикля the и суффикса -est.",
  },
  {
    prompt:
      'Choose the right preposition: "We arrived ___ the train station on time."',
    options: ["at", "to", "in", "on"],
    answer: 0,
    note: "Arrive at используется для зданий и локальных мест (station, airport, hotel).",
  },
  {
    prompt: 'Which phrase means "Как насчет...?"',
    options: [
      "What do you...",
      "How about...?",
      "Where is...?",
      "Why not to...?",
    ],
    answer: 1,
    note: "How about + существительное/инфинитив с -ing используется для предложений и идей.",
  },
  {
    prompt: 'What is the past form of "catch"?',
    options: ["Caught", "Catched", "Cot", "Catching"],
    answer: 0,
    note: "Catch — неправильный глагол: catch, caught, caught.",
  },
  {
    prompt: 'Complete: "There isn\'t ___ in the house."',
    options: ["somebody", "nobody", "anybody", "some"],
    answer: 2,
    note: "В отрицательных предложениях используются местоимения с any (anybody).",
  },
  {
    prompt: 'What does "give up" mean?',
    options: ["Продолжать", "Сдаваться", "Дарить", "Поднимать"],
    answer: 1,
    note: "Phrasal verb: give up = прекращать попытки, сдаваться.",
  },
  {
    prompt: 'Complete: "I enjoy ___ books in the evening."',
    options: ["to read", "read", "reading", "reads"],
    answer: 2,
    note: "После глагола enjoy всегда используется герундий (глагол с суффиксом -ing).",
  },
  {
    prompt: 'Choose the right preposition: "He is afraid ___ dogs."',
    options: ["of", "from", "with", "about"],
    answer: 0,
    note: "Устойчивое сочетание: be afraid of something/someone.",
  },
  {
    prompt: 'Which word is the opposite of "polite"?',
    options: ["Unpolite", "Impolite", "Dispolite", "Nonpolite"],
    answer: 1,
    note: "Прилагательное polite образует противоположное значение с помощью приставки im- (impolite).",
  },
  {
    prompt: 'What is the past form of "see"?',
    options: ["Saw", "Seen", "Seed", "Seeing"],
    answer: 0,
    note: "Вторая форма глагола see — saw (Past Simple).",
  },
  {
    prompt: 'Complete: "I saw him two days ___."',
    options: ["before", "since", "ago", "for"],
    answer: 2,
    note: "Ago указывает на отрезок времени назад от текущего момента.",
  },
  {
    prompt: 'Choose the correct verb: "___ a decision"',
    options: ["Make", "Do", "Build", "Perform"],
    answer: 0,
    note: "Устойчивое сочетание: make a decision (принимать решение).",
  },
  {
    prompt: 'Complete: "The email was ___ yesterday."',
    options: ["send", "sent", "sending", "sended"],
    answer: 1,
    note: "В Passive Voice используется третья форма глагола: was sent.",
  },
  {
    prompt: 'Which phrase means "На твоем месте..."?',
    options: [
      "If I were you...",
      "If I am you...",
      "On your place...",
      "In your side...",
    ],
    answer: 0,
    note: "Устойчивая конструкция второго типа условных предложений для советов: If I were you...",
  },
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
  const yesterdayDate = new Date(now.getTime() - 86400000)
    .toISOString()
    .slice(0, 10);
  const storageKey = "english-os-daily-quest-v1";
  const challenge =
    questPrompts[Math.floor(Date.now() / 86400000) % questPrompts.length];
  let progress = {};

  try {
    progress = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (_) {
    progress = {};
  }

  const answeredToday = progress.lastDate === today;
  const activeStreak =
    answeredToday || progress.lastDate === yesterdayDate
      ? progress.streak || 0
      : 0;
  const streakLabel = (value) =>
    `${value} ${value === 1 ? "день" : value > 1 && value < 5 ? "дня" : "дней"}`;
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
      optionsNode.querySelectorAll("button").forEach((answerButton) => {
        answerButton.disabled = true;
      });
      const streak =
        progress.lastDate === yesterdayDate ? (progress.streak || 0) + 1 : 1;
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
    optionsNode.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    optionsNode
      .querySelectorAll("button")
      [challenge.answer]?.classList.add("is-correct");
    feedbackNode.textContent =
      "Сегодняшнее задание уже выполнено. Загляни завтра за новым!";
    progressNode.style.width = "100%";
    document.getElementById("quest-title").textContent = "Ты уже в деле!";
  }
}
