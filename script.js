// Регистрируем плагины GSAP для существующих переходов и анимаций.
gsap.registerPlugin(ScrollTrigger);

// На странице используется обычная адаптивная сетка игр, поэтому каталог
// не перехватывает прокрутку страницы и не превращается в горизонтальный слайдер.
const container = document.querySelector(".gallery-container");
const track = document.querySelector(".gallery-track");

// Красивое появление шапки сайта при загрузке.
gsap.from("nav", {
  y: -24,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out",
});

// =========================================
// ПОИСК ИГР ПО НАЗВАНИЮ, ТЕМЕ И ОПИСАНИЮ
// =========================================
const searchInput = document.getElementById("game-search");
const searchResults = document.getElementById("search-results");
const searchClear = document.getElementById("search-clear");
const gameCards = [...document.querySelectorAll(".gallery-card")];

function normalizeSearch(value) {
  return value.toLocaleLowerCase("ru-RU").trim();
}

function renderSearchResults(value) {
  const query = normalizeSearch(value);
  const matches = gameCards.filter((card) => {
    const text = normalizeSearch(
      `${card.dataset.search || ""} ${card.textContent}`,
    );
    return !query || text.includes(query);
  });

  gameCards.forEach((card) =>
    card.classList.toggle(
      "is-hidden",
      Boolean(query) && !matches.includes(card),
    ),
  );
  searchClear.classList.toggle("is-visible", Boolean(query));
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.classList.remove("is-visible");
    return;
  }

  if (!matches.length) {
    searchResults.innerHTML =
      '<div class="search-empty">Ничего не нашли. Попробуйте «времена», «алфавит» или «Past Simple».</div>';
  } else {
    matches.slice(0, 5).forEach((card) => {
      const result = document.createElement("a");
      result.className = "search-result";
      result.href = card.href;
      result.setAttribute("role", "option");
      result.innerHTML = `<img src="${card.querySelector("img").src}" alt=""><span><strong>${card.querySelector("h3").textContent}</strong><small>${card.querySelector("p").textContent}</small></span>`;
      searchResults.appendChild(result);
    });
  }
  searchResults.classList.add("is-visible");
}

if (searchInput) {
  searchInput.addEventListener("input", () =>
    renderSearchResults(searchInput.value),
  );
  searchInput.addEventListener("focus", () => {
    if (searchInput.value) renderSearchResults(searchInput.value);
  });
}
if (searchClear) {
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    renderSearchResults("");
    searchInput.focus();
  });
}
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-search"))
    searchResults?.classList.remove("is-visible");
});

// Управление нижней лентой игр: стрелки листают её на ширину одной карточки.
const gamesViewport = document.querySelector(".gallery-viewport");
const gamesPrev = document.getElementById("games-prev");
const gamesNext = document.getElementById("games-next");

function moveGames(direction) {
  if (!gamesViewport) return;
  const card = gamesViewport.querySelector(".gallery-card");
  const gap = 18;
  gamesViewport.scrollBy({
    left: direction * ((card?.offsetWidth || 246) + gap),
    behavior: "smooth",
  });
}

gamesPrev?.addEventListener("click", () => moveGames(-1));
gamesNext?.addEventListener("click", () => moveGames(1));

gamesViewport?.addEventListener(
  "wheel",
  (event) => {
    if (
      window.matchMedia("(hover: hover)").matches &&
      Math.abs(event.deltaY) > Math.abs(event.deltaX)
    ) {
      const maxScroll = gamesViewport.scrollWidth - gamesViewport.clientWidth;
      const nextScroll = Math.max(
        0,
        Math.min(maxScroll, gamesViewport.scrollLeft + event.deltaY),
      );
      if (nextScroll !== gamesViewport.scrollLeft) {
        event.preventDefault();
        gamesViewport.scrollLeft = nextScroll;
      }
    }
  },
  { passive: false },
);

// Боковые рейлы реагируют на направление и скорость прокрутки страницы.
const sideRails = [...document.querySelectorAll(".side-rail")];
let railTicking = false;
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
window.addEventListener(
  "scroll",
  () => {
    if (railTicking) return;
    railTicking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      const currentY = window.scrollY;
      const delta = currentY - previousScrollY;
      const elapsed = Math.max(now - previousScrollTime, 1);
      const energy = Math.min((Math.abs(delta) / elapsed) * 2.8, 1);
      const drift = Math.sin(currentY / 115) * Math.min(energy * 34, 22);

      sideRails.forEach((rail, index) => {
        rail.style.setProperty("--rail-drift", `${index ? -drift : drift}px`);
        rail.style.setProperty("--scroll-energy", energy.toFixed(2));
        rail.style.setProperty("--scroll-direction", delta >= 0 ? "1" : "-1");
      });

      previousScrollY = currentY;
      previousScrollTime = now;
      railTicking = false;
    });
  },
  { passive: true },
);

const gameApproach = document.querySelector(".about-card-main");
function openGamesFromBenefit() {
  document
    .getElementById("games-section")
    ?.scrollIntoView({ behavior: "smooth" });
}
gameApproach?.addEventListener("click", openGamesFromBenefit);
gameApproach?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGamesFromBenefit();
  }
});

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
const onlineDiscount = document.getElementById("online-discount");
let onlineDiscountActive = false;

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
    priceDesc: "(первое пробное занятие 0 ₽ – попробуй бесплатно)",
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
      onlineDiscount.hidden = !isIndividual;
      onlineDiscountActive = isIndividual && onlineDiscountActive;
      onlineDiscount.setAttribute("aria-pressed", String(onlineDiscountActive));
      onlineDiscount.classList.toggle("is-active", onlineDiscountActive);
      if (isIndividual && onlineDiscountActive) applyOnlineDiscount();

      gsap.to(comparisonCard, {
        opacity: 1,
        y: 0,
        duration: 0.3,
      });
    },
  });
}

function applyOnlineDiscount() {
  formatPrice.textContent = onlineDiscountActive
    ? "1 200 ₽ / урок"
    : formatData.individual.price;
  formatPriceDesc.textContent = onlineDiscountActive
    ? "Онлайн-занятие · экономия 300 ₽ (20%)"
    : formatData.individual.priceDesc;
  formatDetails.textContent = onlineDiscountActive
    ? "Онлайн-занятия из любой точки. Скидка 20% уже учтена в цене."
    : formatData.individual.details;
  onlineDiscount?.setAttribute("aria-pressed", String(onlineDiscountActive));
  onlineDiscount?.classList.toggle("is-active", onlineDiscountActive);
}

onlineDiscount?.addEventListener("click", () => {
  onlineDiscountActive = !onlineDiscountActive;
  applyOnlineDiscount();
});

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

// =========================================
// ЛОГИКА МОДАЛЬНОГО ОКНА И ОТПРАВКА В TELEGRAM
// =========================================
const modalOverlay = document.getElementById("booking-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const formActionBtn = document.getElementById("format-btn");
const toggleCheckbox = document.getElementById("checkbox");

function openModal() {
  const planSelect = document.getElementById("plan");

  if (planSelect && toggleCheckbox) {
    if (toggleCheckbox.checked) {
      planSelect.value = "Индивидуально";
    } else {
      planSelect.value = "Мини-группа";
    }
  } else {
    console.warn(
      "Поле с id='plan' не найдено на странице, но окно будет открыто.",
    );
  }

  if (modalOverlay) {
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    console.error(
      "ОШИБКА: В HTML-файле отсутствует код модального окна (id='booking-modal').",
    );
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (formActionBtn) {
  formActionBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// =========================================
// ОТПРАВКА ФОРМЫ ЧЕРЕЗ ПРОКСИ YANDEX CLOUD
// =========================================
const PROXY_URL = "https://tg-lead-proxy.kadoshnikov-pasha228.workers.dev";

const bookingForm = document.getElementById("booking-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

if (bookingForm) {
  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Визуальная индикация загрузки
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Отправка...";
    submitBtn.disabled = true;
    formStatus.className = "form-status";

    // Собираем данные из полей
    const formData = new FormData(this);
    const name = formData.get("name");
    const contact = formData.get("contact");
    const plan = formData.get("plan");
    const comment = formData.get("comment") || "Не указан";

    try {
      // Отправляем данные на прокси-функцию Yandex Cloud
      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: contact,
          format: plan,
          comment: comment,
        }),
      });

      if (response.ok) {
        formStatus.textContent =
          "Заявка успешно отправлена! Мы скоро свяжемся с вами.";
        formStatus.classList.add("success");
        bookingForm.reset();

        setTimeout(() => {
          closeModal();
          formStatus.classList.remove("success");
        }, 3000);
      } else {
        throw new Error("Ошибка сервера при отправке");
      }
    } catch (error) {
      formStatus.textContent =
        "Произошла ошибка при отправке. Пожалуйста, попробуйте позже.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}
