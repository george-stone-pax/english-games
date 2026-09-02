$(function() {
  
  // ==========================================
  // 1. БЛОКИРОВКА СКРОЛЛА СТРЕЛКАМИ
  // ==========================================
  window.addEventListener("keydown", function(e) {
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault();
      }
  }, false);

  // ==========================================
  // 2. БАЗА СЛОВ (9 классов по 15 слов)
  // ==========================================
  const wordsDB = {
      1: [
          {en: "cat", ru: "кот"}, {en: "dog", ru: "собака"}, {en: "red", ru: "красный"}, {en: "blue", ru: "синий"}, {en: "one", ru: "один"},
          {en: "two", ru: "два"}, {en: "apple", ru: "яблоко"}, {en: "boy", ru: "мальчик"}, {en: "girl", ru: "девочка"}, {en: "sun", ru: "солнце"},
          {en: "mom", ru: "мама"}, {en: "dad", ru: "папа"}, {en: "book", ru: "книга"}, {en: "run", ru: "бегать"}, {en: "jump", ru: "прыгать"}
      ],
      2: [
          {en: "house", ru: "дом"}, {en: "car", ru: "машина"}, {en: "tree", ru: "дерево"}, {en: "flower", ru: "цветок"}, {en: "milk", ru: "молоко"},
          {en: "water", ru: "вода"}, {en: "play", ru: "играть"}, {en: "sleep", ru: "спать"}, {en: "happy", ru: "счастливый"}, {en: "sad", ru: "грустный"},
          {en: "big", ru: "большой"}, {en: "small", ru: "маленький"}, {en: "green", ru: "зеленый"}, {en: "yellow", ru: "желтый"}, {en: "bird", ru: "птица"}
      ],
      3: [
          {en: "family", ru: "семья"}, {en: "friend", ru: "друг"}, {en: "school", ru: "школа"}, {en: "teacher", ru: "учитель"}, {en: "student", ru: "ученик"},
          {en: "read", ru: "читать"}, {en: "write", ru: "писать"}, {en: "learn", ru: "учить"}, {en: "game", ru: "игра"}, {en: "toy", ru: "игрушка"},
          {en: "animal", ru: "животное"}, {en: "zoo", ru: "зоопарк"}, {en: "park", ru: "парк"}, {en: "day", ru: "день"}, {en: "night", ru: "ночь"}
      ],
      4: [
          {en: "weather", ru: "погода"}, {en: "summer", ru: "лето"}, {en: "winter", ru: "зима"}, {en: "autumn", ru: "осень"}, {en: "spring", ru: "весна"},
          {en: "hot", ru: "горячий"}, {en: "cold", ru: "холодный"}, {en: "rain", ru: "дождь"}, {en: "snow", ru: "снег"}, {en: "wind", ru: "ветер"},
          {en: "cloud", ru: "облако"}, {en: "sky", ru: "небо"}, {en: "moon", ru: "луна"}, {en: "star", ru: "звезда"}, {en: "beautiful", ru: "красивый"}
      ],
      5: [
          {en: "travel", ru: "путешествие"}, {en: "city", ru: "город"}, {en: "country", ru: "страна"}, {en: "world", ru: "мир"}, {en: "map", ru: "карта"},
          {en: "ticket", ru: "билет"}, {en: "train", ru: "поезд"}, {en: "plane", ru: "самолет"}, {en: "ship", ru: "корабль"}, {en: "bus", ru: "автобус"},
          {en: "street", ru: "улица"}, {en: "bicycle", ru: "велосипед"}, {en: "walk", ru: "гулять"}, {en: "swim", ru: "плавать"}
      ],
      6: [
          {en: "health", ru: "здоровье"}, {en: "doctor", ru: "врач"}, {en: "hospital", ru: "больница"}, {en: "medicine", ru: "лекарство"}, {en: "body", ru: "тело"},
          {en: "head", ru: "голова"}, {en: "arm", ru: "рука"}, {en: "leg", ru: "нога"}, {en: "foot", ru: "ступня"}, {en: "hand", ru: "кисть"},
          {en: "eye", ru: "глаз"}, {en: "ear", ru: "ухо"}, {en: "nose", ru: "нос"}, {en: "mouth", ru: "рот"}, {en: "face", ru: "лицо"}
      ],
      7: [
          {en: "science", ru: "наука"}, {en: "history", ru: "история"}, {en: "geography", ru: "география"}, {en: "math", ru: "математика"}, {en: "art", ru: "искусство"},
          {en: "music", ru: "музыка"}, {en: "sport", ru: "спорт"}, {en: "computer", ru: "компьютер"}, {en: "internet", ru: "интернет"}, {en: "phone", ru: "телефон"},
          {en: "message", ru: "сообщение"}, {en: "email", ru: "электронная почта"}, {en: "letter", ru: "письмо"}, {en: "news", ru: "новости"}, {en: "magazine", ru: "журнал"}
      ],
      8: [
          {en: "environment", ru: "окружающая среда"}, {en: "pollution", ru: "загрязнение"}, {en: "nature", ru: "природа"}, {en: "forest", ru: "лес"}, {en: "ocean", ru: "океан"},
          {en: "mountain", ru: "гора"}, {en: "river", ru: "река"}, {en: "lake", ru: "озеро"}, {en: "plant", ru: "растение"}, {en: "insect", ru: "насекомое"},
          {en: "protect", ru: "защищать"}, {en: "destroy", ru: "разрушать"}, {en: "recycle", ru: "перерабатывать"}, {en: "plastic", ru: "пластик"}, {en: "trash", ru: "мусор"}
      ],
      9: [
          {en: "society", ru: "общество"}, {en: "culture", ru: "культура"}, {en: "economy", ru: "экономика"}, {en: "politics", ru: "политика"}, {en: "government", ru: "правительство"},
          {en: "law", ru: "закон"}, {en: "right", ru: "право"}, {en: "duty", ru: "обязанность"}, {en: "freedom", ru: "свобода"}, {en: "peace", ru: "мир"},
          {en: "war", ru: "война"}, {en: "army", ru: "армия"}, {en: "soldier", ru: "солдат"}, {en: "weapon", ru: "оружие"}, {en: "citizen", ru: "гражданин"}
      ]
  };

  // ==========================================
  // 3. УПРАВЛЕНИЕ ЗВУКОМ И АВТОЗАПУСК
  // ==========================================
  
  // Устанавливаем громкость при загрузке согласно ползунку
  let initialVol = $('#volume-slider').val();
  $('audio').each(function() {
      this.volume = initialVol;
  });

  // Динамическое изменение громкости для всех аудиофайлов в игре
  $('#volume-slider').on('input', function() {
      let vol = $(this).val();
      $('audio').each(function() {
          this.volume = vol;
      });
  });

  // Запуск фоновой музыки при первом клике (обход блокировок автоплея в браузерах)
  let musicStarted = false;
  $(document).on('click', function() {
      if (!musicStarted) {
          let bgMusic = document.getElementById('audio-bg');
          if (bgMusic) {
              bgMusic.play().catch(e => console.log("Ожидание взаимодействия с пользователем..."));
              musicStarted = true;
          }
      }
  });

  // ==========================================
  // 4. ПОЛНОЭКРАННЫЙ РЕЖИМ
  // ==========================================
  $('#fullscreen-btn').on('click', function() {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
              console.log(`Ошибка перехода в полноэкранный режим: ${err.message}`);
          });
      } else {
          document.exitFullscreen();
      }
  });

  // ==========================================
  // 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ИГРЫ
  // ==========================================
  function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }
      return array;
  }

  // ==========================================
  // 6. ЛОГИКА ИГРЫ (ОСНОВНОЙ ЦИКЛ)
  // ==========================================
  
  // Переворот карточек меню
  $('.logo .card:not(".twist")').on('click', function(e){
      // Не переворачивать обратно, если кликаем внутри поля ввода
      if($(e.target).is('textarea') || $(e.target).is('a')) return;
      
      $(this).toggleClass('active').siblings().not('.twist').removeClass('active');
      if( $(e.target).is('.playnow') ) { $('.logo .card').last().addClass('active'); }
  });

  let currentMatches = 0;
  let totalPairs = 0;

  // Запуск стандартных уровней
  $('.play').on('click', function(){
      let grade = $(this).data('level');
      let wordList = wordsDB[grade];
      startGame(wordList);
  });

  // Запуск со своими словами
  $('#btn-play-custom').on('click', function(){
      let rawText = $('#custom-words-input').val().trim();
      if(!rawText) {
          alert("Пожалуйста, введи слова в формате: слово - перевод");
          return;
      }

      let lines = rawText.split('\n');
      let customWordList = [];

      for(let i = 0; i < lines.length; i++) {
          let parts = lines[i].split('-'); 
          if(parts.length >= 2) {
              customWordList.push({
                  en: parts[0].trim(),
                  ru: parts[1].trim()
              });
          }
      }

      if(customWordList.length === 0) {
          alert("Не удалось распознать слова. Используй дефис (например: dog - собака).");
          return;
      }

      startGame(customWordList);
  });

  // Общая функция старта игры
  function startGame(wordList) {
      $('.info').fadeOut();
      $('#g').removeClass().empty();

      // ОПРЕДЕЛЯЕМ МОБИЛЬНОЕ ЛИ ЭТО УСТРОЙСТВО И СКОЛЬКО СЛОВ БРАТЬ
      let isMobile = window.innerWidth <= 640;
      // Читаем лимит из HTML-атрибута (9), иначе 15 для ПК
      let maxWordsLimit = isMobile ? parseInt($('#g').attr('data-mobile-max-words') || 9) : 15;
      
      // Перемешиваем весь список слов ПЕРЕД обрезкой. 
      // Так на телефоне каждый раз будут выпадать 9 РАЗНЫХ слов из 15 возможных!
      let shuffledWordList = shuffle([...wordList]);
      let activeWordList = shuffledWordList.slice(0, maxWordsLimit);

      currentMatches = 0;
      totalPairs = activeWordList.length;

      $('.logo').fadeOut(250, function(){
          let cardsArray = [];
          
          for(let i = 0; i < activeWordList.length; i++) {
              cardsArray.push({ id: i, text: activeWordList[i].en, lang: 'en' });
              cardsArray.push({ id: i, text: activeWordList[i].ru, lang: 'ru' });
          }

          let shu = shuffle(cardsArray);
          
          // Динамический расчет колонок (для десктопа)
          let totalCards = shu.length;
          let cols = Math.ceil(Math.sqrt(totalCards));
          let rows = Math.ceil(totalCards / cols);
          
          let cardWidth = 100 / cols;
          let cardHeight = 100 / rows;

          for(let i = 0; i < totalCards; i++){
              let cardData = shu[i];
              // На смартфонах inline-стили width и height переопределяются через !important в CSS Grid
              $(`<div class="card" style="width:${cardWidth}%; height:${cardHeight}%;" 
                      data-id="${cardData.id}">
                  <div class="flipper">
                      <div class="f"></div>
                      <div class="b text-card" style="display:flex; justify-content:center; align-items:center; font-size:1.8vw; text-align:center; padding: 5px;">
                          ${cardData.text}
                      </div>
                  </div>
                </div>`).appendTo('#g');
          }

          // Логика клика по карточке
          $('#g .card').on('mousedown', function(){
              if($('#g').attr('data-paused') == 1) return;
              if($(this).hasClass('active') || $(this).hasClass('found')) return;

              $(this).addClass('active');

              let activeCards = $('#g').find('.card.active:not(.found)');

              if(activeCards.length === 2){
                  let card1 = activeCards.eq(0);
                  let card2 = activeCards.eq(1);
                  
                  if(card1.data('id') === card2.data('id')){
                      // ПРАВИЛЬНЫЙ ОТВЕТ
                      $('#g').attr('data-paused', '1');
                      setTimeout(function(){
                          card1.addClass('found');
                          card2.addClass('found');
                          
                          let audioRight = document.getElementById('audio-right');
                          if(audioRight) {
                              audioRight.currentTime = 0; 
                              audioRight.play();
                          }
                          
                          currentMatches++;
                          
                          if(currentMatches === totalPairs){
                              setTimeout(() => {
                                  $('#evaluation-screen').removeClass('hidden');
                              }, 600); // Небольшая задержка перед финальным окном
                          }
                          $('#g').attr('data-paused', '0');
                      }, 400);
                  } else {
                      // НЕПРАВИЛЬНЫЙ ОТВЕТ
                      $('#g').attr('data-paused', '1');
                      
                      let audioWrong = document.getElementById('audio-wrong');
                      if(audioWrong) {
                          audioWrong.currentTime = 0;
                          audioWrong.play();
                      }
                      
                      // Ждем 1 секунду, чтобы игрок посмотрел на слова, и переворачиваем обратно
                      setTimeout(function(){
                          card1.removeClass('active');
                          card2.removeClass('active');
                          $('#g').attr('data-paused', '0');
                      }, 1000);
                  }
              }
          });
      });
  }

  // Рестарт игры (возврат в меню)
  $('#btn-restart').on('click', function() {
      $('#evaluation-screen').addClass('hidden');
      $('#g').empty();
      $('.logo').fadeIn(250);
      $('.info').fadeIn(250);
  });

  // ==========================================
  // 7. ГОРЯЧИЕ КЛАВИШИ (Пауза и выход)
  // ==========================================
  $(window).on('keyup', function(e){
      // P - Пауза (игнорируем, если вводим текст в textarea)
      if(e.keyCode == 80 && !$(document.activeElement).is('textarea')){
          if( $('#g').attr('data-paused') == 1 ) {
              $('#g').attr('data-paused', '0');
              $('.pause').remove();
          } else {
              $('#g').attr('data-paused', '1');
              $('<div class="pause"></div>').appendTo('body');
          }
      }
      // ESC - Выход
      if(e.keyCode == 27){
          if( $('#g').attr('data-paused') == 1 ){
              $('#g').attr('data-paused', '0');
              $('.pause').remove();
          }
          $('#g').empty();
          $('.logo').fadeIn(250);
          $('.info').fadeIn(250);
      }
  });

});
