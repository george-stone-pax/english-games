// 1. Регистрируем плагины GSAP
gsap.registerPlugin(ScrollTrigger);

// =========================================
// АНИМАЦИЯ ГАЛЕРЕИ (РАЗНАЯ ДЛЯ ПК И ТЕЛЕФОНОВ)
// =========================================
const container = document.querySelector(".gallery-container");
const track = document.querySelector(".gallery-track");

function getScrollAmount() {
  let trackWidth = track.scrollWidth;
  return -(trackWidth - window.innerWidth);
}

// Создаем медиа-правило GSAP
let mm = gsap.matchMedia();

// ДЕСКТОП: экраны шире 768px (Анимация скролла колесиком)
mm.add("(min-width: 769px)", () => {
  const tween = gsap.to(track, {
    x: getScrollAmount,
    ease: "none",
  });

  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
  });
});

// МОБИЛЬНЫЕ: экраны 768px и меньше (Свайп пальцем)
mm.add("(max-width: 768px)", () => {
  container.style.overflowX = "auto";
  container.style.overflowY = "hidden";
  container.style.scrollbarWidth = "none";
  container.style.msOverflowStyle = "none";
  container.classList.add("hide-scrollbar");
});

// Красивое появление шапки сайта при загрузке
gsap.from("nav", {
  y: -100,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

// =========================================
// БУРГЕР-МЕНЮ
// =========================================
const burgerBtn = document.getElementById("burger-btn");
const menuOverlay = document.getElementById("menu-overlay");
const navLinks = document.querySelectorAll(".nav-links a");

function toggleMenu() {
  document.body.classList.toggle("menu-open");
}

burgerBtn.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (document.body.classList.contains("menu-open")) {
      toggleMenu();
    }
  });
});

// =========================================
// ИНТЕРАКТИВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ФОРМАТОВ И ЦЕН
// =========================================
const formatCheckbox = document.getElementById("checkbox");
const comparisonCard = document.getElementById("comparison-card");

const formatBadge = document.getElementById("format-badge");
const promoBadge = document.getElementById("promo-badge");
const discountBadge = document.getElementById("discount-badge");
const formatHeading = document.getElementById("format-heading");
const formatDynamics = document.getElementById("format-dynamics");
const formatSchedule = document.getElementById("format-schedule");
const formatPros = document.getElementById("format-pros");
const formatDetails = document.getElementById("format-details");

const formatPrice = document.getElementById("format-price");
const formatPriceDesc = document.getElementById("format-price-desc");
const formatBtn = document.getElementById("format-btn");

const formatData = {
  group: {
    badge: "Мини-группа (2–4 человека)",
    showPromo: true,
    showDiscount: false,
    heading: "Живое общение и командный драйв",
    dynamics:
      "Интерактивные игры, парная работа, здоровая соревновательная атмосфера и преодоление языкового барьера.",
    schedule:
      "Фиксированные дни и время (2 раза в неделю по 60 минут), которые отлично дисциплинируют.",
    pros: "Доступная стоимость, постоянная разговорная практика с другими студентами, совместные игровые задания.",
    details:
      "Около 9 занятий в месяц. Выгодное предложение действительно до конца учебного года 2026–2027.",
    price: "4 500 ₽ / месяц",
    priceDesc: "(~500 ₽ за 1 занятие)",
    btnText: "Записаться в мини-группу",
  },
  individual: {
    badge: "Индивидуальный формат (1 на 1)",
    showPromo: false,
    showDiscount: true,
    heading: "Максимальное внимание и персональная программа",
    dynamics:
      "100% времени преподавателя уделяется только вам. Темп урока подстраивается полностью под ваши цели и скорость восприятия.",
    schedule:
      "Гибкий график: количество занятий и дни вы выбираете самостоятельно по своему желанию.",
    pros: "Решение конкретных задач (подготовка к собеседованию, экзаменам), абсолютный комфорт для ученика.",
    details:
      "Количество занятий выбирает сам ученик. Первое индивидуальное занятие со скидкой 50%!",
    price: "1 500 ₽ / урок",
    priceDesc: "(первое пробное занятие всего 750 ₽ со скидкой 50%)",
    btnText: "Записаться индивидуально",
  },
};

function updateComparisonContent(isIndividual) {
  const data = isIndividual ? formatData.individual : formatData.group;

  gsap.to(comparisonCard, {
    opacity: 0,
    y: 10,
    duration: 0.2,
    onComplete: () => {
      formatBadge.textContent = data.badge;

      if (data.showPromo) {
        promoBadge.style.display = "inline-block";
      } else {
        promoBadge.style.display = "none";
      }

      if (data.showDiscount) {
        discountBadge.style.display = "inline-block";
      } else {
        discountBadge.style.display = "none";
      }

      formatHeading.textContent = data.heading;
      formatDynamics.textContent = data.dynamics;
      formatSchedule.textContent = data.schedule;
      formatPros.textContent = data.pros;
      formatDetails.textContent = data.details;

      formatPrice.textContent = data.price;
      formatPriceDesc.textContent = data.priceDesc;
      formatBtn.textContent = data.btnText;

      gsap.to(comparisonCard, {
        opacity: 1,
        y: 0,
        duration: 0.3,
      });
    },
  });
}

if (formatCheckbox) {
  formatCheckbox.addEventListener("change", (e) => {
    updateComparisonContent(e.target.checked);
  });
}

// =========================================
// ЭФФЕКТ ПЕЧАТАЮЩЕГОСЯ ТЕКСТА (ДЛЯ ПОСЛЕДНЕЙ СТРАНИЦЫ)
// =========================================
const typewriterEl = document.getElementById("typewriter-text");
const finalMessage =
  "Индивидуальный дневник помогает отслеживать прогресс, превращая изучение английского в увлекательный квест и мотивирует учеников на новые достижения!";
let typewriterTimeout = null;

function startTypewriter() {
  if (!typewriterEl) return;

  clearTimeout(typewriterTimeout);
  typewriterEl.innerHTML = '<span class="typewriter-cursor"></span>';

  let index = 0;
  const speed = 32; // Скорость появления символов (мс)

  function typeChar() {
    if (index < finalMessage.length) {
      const currentText = finalMessage.slice(0, index + 1);
      typewriterEl.innerHTML =
        currentText + '<span class="typewriter-cursor"></span>';
      index++;
      typewriterTimeout = setTimeout(typeChar, speed);
    } else {
      typewriterEl.textContent = finalMessage;
    }
  }

  // Небольшая задержка, чтобы страница успела завершить анимацию переворота
  typewriterTimeout = setTimeout(typeChar, 400);
}

function resetTypewriter() {
  clearTimeout(typewriterTimeout);
  if (typewriterEl) {
    typewriterEl.innerHTML = "";
  }
}

// =========================================
// ЛОГИКА 3D-КНИГИ
// =========================================
const prevBtn = document.getElementById("book-prev-btn");
const nextBtn = document.getElementById("book-next-btn");
const book = document.getElementById("diary-book");
const pageCounter = document.getElementById("page-counter");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");

let currentLocation = 1;
const numOfPapers = 3;
const maxLocation = numOfPapers + 1;

const pageLabels = [
  "Обложка (0 / 3)",
  "Разворот 1 (1 / 3)",
  "Разворот 2 (2 / 3)",
  "Задняя обложка (3 / 3)",
];

function updateCounter() {
  pageCounter.textContent = pageLabels[currentLocation - 1];
  prevBtn.disabled = currentLocation === 1;
  nextBtn.disabled = currentLocation === maxLocation;
}

function openBook() {
  book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
  if (isAtBeginning) {
    book.style.transform = "translateX(0%)";
  } else {
    book.style.transform = "translateX(100%)";
  }
}

function updatePapersZIndex() {
  if (currentLocation === 1) {
    p1.style.zIndex = "3";
    p2.style.zIndex = "2";
    p3.style.zIndex = "1";
  } else if (currentLocation === 2) {
    p1.style.zIndex = "1";
    p2.style.zIndex = "3";
    p3.style.zIndex = "2";
  } else if (currentLocation === 3) {
    p1.style.zIndex = "1";
    p2.style.zIndex = "2";
    p3.style.zIndex = "3";
  } else if (currentLocation === 4) {
    p1.style.zIndex = "1";
    p2.style.zIndex = "2";
    p3.style.zIndex = "3";
  }
}

function goNextPage() {
  if (currentLocation < maxLocation) {
    switch (currentLocation) {
      case 1:
        openBook();
        p1.classList.add("flipped");
        p1.style.zIndex = "10";
        setTimeout(updatePapersZIndex, 300);
        break;
      case 2:
        p2.classList.add("flipped");
        p2.style.zIndex = "10";
        setTimeout(updatePapersZIndex, 300);
        break;
      case 3:
        p3.classList.add("flipped");
        p3.style.zIndex = "10";
        closeBook(false);
        setTimeout(updatePapersZIndex, 300);
        startTypewriter(); // Запуск печати при открытии задней обложки
        break;
    }
    currentLocation++;
    updateCounter();
  }
}

function goPrevPage() {
  if (currentLocation > 1) {
    switch (currentLocation) {
      case 2:
        closeBook(true);
        p1.style.zIndex = "10";
        p1.classList.remove("flipped");
        setTimeout(updatePapersZIndex, 300);
        break;
      case 3:
        p2.style.zIndex = "10";
        p2.classList.remove("flipped");
        setTimeout(updatePapersZIndex, 300);
        break;
      case 4:
        resetTypewriter(); // Сброс текста при уходе с последней страницы
        openBook();
        p3.style.zIndex = "10";
        p3.classList.remove("flipped");
        setTimeout(updatePapersZIndex, 300);
        break;
    }
    currentLocation--;
    updateCounter();
  }
}

// Первоначальная установка слоев
updatePapersZIndex();

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", goPrevPage);
  nextBtn.addEventListener("click", goNextPage);
  updateCounter();

  if (p1)
    p1.addEventListener("click", () => {
      if (currentLocation === 1) goNextPage();
      else if (currentLocation === 2) goPrevPage();
    });
  if (p2)
    p2.addEventListener("click", () => {
      if (currentLocation === 2) goNextPage();
      else if (currentLocation === 3) goPrevPage();
    });
  if (p3)
    p3.addEventListener("click", () => {
      if (currentLocation === 3) goNextPage();
      else if (currentLocation === 4) goPrevPage();
    });
}
