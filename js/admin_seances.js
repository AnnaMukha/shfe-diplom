// Сетка сеансов
let vremyaSeansov;
let vremyaFilmov;
let vybrannyyFilm;
let vybrannyyZal;

let seansyZal;
let nachaloSeansa;
let konecSeansa;
let tekushayaProdolzhitelnostSeansa;
let tekushiyNachaloSeansa;
let tekushiySeansNachalo;
let tekushiySeansKonec;

let seansyRazresheny = false;

// Кнопки

let otmenaSeansovFilmov;
let sohranenieSeansovFilmov;

// popup Добавление сеанса

const popupDobavitSeans = document.querySelector(".popup__seance_add");
const formaDobavitSeans = document.querySelector(".popup__form_add-seance");
const vyborSeansZal = document.querySelector(".select__add-seance_hall");
let variantNazvaniyaZala;
let variantNazvaniyaFilma;
const vyborSeansFilm = document.querySelector(".select__add-seance_movie");
const vvodVremeniSeansa = document.querySelector(".add-seans__input_time");
let proverkaIdZala;
let proverkaIdFilma;
let proverkaNazvaniyaFilma;
let proverkaProdolzhitelnostiFilma;
let proverkaVremeniSeansa;
let knopkaOtmenySeansa;

// popup Удаление сеанса

const popupUdalitSeans = document.querySelector(".popup__seance_remove");
let zagolovokUdalitSeans;
let knopkaUdalitSeans;
let knopkaOtmenyUdalitSeans;

// Удаление сеансов

let vybrannyeSeansy;
let vybrannyeDlyaUdalenia;

let vybrannyySeans;
let vybrannyyIdSeansa;
let vybrannyyVremya;
let vybrannyyIdZala;
let vybrannoeNazvaniyeFilma;

let udalennyeSeansy = [];
let filtorUdalennykhSeansov = [];

// Загрузка сеансов

function zagruzkaSeansov(data) {
  vremyaSeansov.forEach(timeline => {
    timeline.innerHTML = "";

    for(let i = 0; i < data.result.seances.length; i++) {
      let idFilmaSeansa = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));
      
      if(Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[idFilmaSeansa].film_name}</p>
          <p class="timeline__movie_start" data-duration="${data.result.films[idFilmaSeansa].film_duration}">${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }
    
  })

  // Загрузка фона сеансов

  ustanovitFonFilma();

  // Позиционирование сеансов
  
  pozitsiyaSeansa();

  // Отслеживание изменения ширины окна

  window.addEventListener("resize", event => {
    pozitsiyaSeansa();
  })

  // Кнопка Отмена под сеткой сеансов

  otmenaSeansovFilmov = document.querySelector(".movie-seances__batton_cancel");

  otmenaSeansovFilmov.addEventListener("click", event => {
    if(otmenaSeansovFilmov.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      udalennyeSeansy.length = 0;
      filtorUdalennykhSeansov.length = 0;
      zagruzkaSeansov(data);
    
      udalitSeans();

      otmenaSeansovFilmov.classList.add("button_disabled");
      sohranenieSeansovFilmov.classList.add("button_disabled");
    }
  })
}

// Установка цвета фона для фильмов в таймлайнах

function ustanovitFonFilma() {
  const filmy = document.querySelectorAll(".movie-seances__movie");
  let fonFilma;
  const informaciyaFilmy = new Array();

  // Собираем массив из загруженных фильмов и сохраняем номер цвета фона в каждом

  filmy.forEach(movie => {
    fonFilma = movie.classList.value.match(/\d+/)[0];

    const informaciyaFilma = new Object();
    informaciyaFilma.movieInfoId = movie.dataset.id;
    informaciyaFilma.background = fonFilma;

    informaciyaFilmy.push(informaciyaFilma);
  })

  // Проставление номера цвета фона в фильмы в таймлайне с сеансами

  vremyaFilmov = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  vremyaFilmov.forEach(element => {
    for (let i = 0; i < informaciyaFilmy.length; i++)
      if(Number(element.dataset.filmid) === Number(informaciyaFilmy[i].movieInfoId)) {
        element.classList.add(`background_${informaciyaFilmy[i].background}`);
      }
  })

}

// Позиционирование сеансов по таймлайну и определение ширины блока с сеансом (длительность фильма)

let denVMinutakh = 24 * 60;
let nachaloSeansaFilma;
let prodolzhitelnostFilma;
let shirinaFilma;
let pozitsiyaSeansaFilma;

function pozitsiyaSeansa() {

  vremyaFilmov.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]); 
    let minutes = Number(time[1]);

    nachaloSeansaFilma = (hours * 60) + minutes;
    pozitsiyaSeansaFilma = (nachaloSeansaFilma / denVMinutakh) * 100;

    prodolzhitelnostFilma = item.lastElementChild.dataset.duration;
    shirinaFilma = (prodolzhitelnostFilma / denVMinutakh) * 100;

    item.style.left = pozitsiyaSeansaFilma + "%";
    item.style.width = shirinaFilma + "%";

    // Уменьшение размера шрифта и padding при слишком маленькой ширине сеанса

    if(item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let shirinaFilmaPx = item.getBoundingClientRect().width;

    if(shirinaFilmaPx < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    } 
  })

}

// Перетаскивание фильма в таймлайн зала (открытие popup Добавление сеанса)

function otkritPopupSeansa(data) {

  const massivFilmov = document.querySelectorAll(".movie-seances__movie");
  const massivZalov = document.querySelectorAll(".timeline__seances");

  // Определение выбранного элемента

  let vybrannyyElement;

  massivFilmov.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {  
      vybrannyyFilm = movie.dataset.id;
      vybrannyyElement = event.target;
    }) 
  })

  // Очищаем значение выбранного элемента, если элемент отпущен

  massivFilmov.forEach(movie => {
    movie.addEventListener("dragend", () => {  
      vybrannyyElement = undefined;
    }) 
  })

  massivZalov.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  })

  massivZalov.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();
      
      if(vybrannyyElement === undefined) {
        return;
      }

      vybrannyyZal = timeline.dataset.id;
      
      // Открытие popup "Добавление сеанса"

      popupDobavitSeans.classList.remove("popup__hidden");

      // Очищение значений в popup

      vyborSeansZal.innerHTML = "";
      vyborSeansFilm.innerHTML = "";
      formaDobavitSeans.reset();

      // Формирование select "Название зала"

      for(let i = 0; i < data.result.halls.length; i++) {
        vyborSeansZal.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      } 

      variantNazvaniyaZala = document.querySelectorAll(".hall__name");

      variantNazvaniyaZala.forEach(hallName => {
        if(Number(hallName.dataset.id) === Number(vybrannyyZal)) {
          hallName.setAttribute("selected", "true");
        }
      })

      // Формирование select "Название фильма"

      for(let i = 0; i < data.result.films.length; i++) {
        vyborSeansFilm.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}" data-duration="${data.result.films[i].film_duration}">${data.result.films[i].film_name}</option>
        `);
      } 

      variantNazvaniyaFilma = document.querySelectorAll(".movie__name");

      variantNazvaniyaFilma.forEach(movieName => {
        if(Number(movieName.dataset.id) === Number(vybrannyyFilm)) {
          movieName.setAttribute("selected", "true");
        }
      })

    })
  })
}

// Клик по кнопке "Добавить сеанс"

let proverennyeSeansy = [];

function klikKnopkiDobavitSeans() {
  formaDobavitSeans.addEventListener("submit", (event) => {
    event.preventDefault();
    proverennyeSeansy.length = 0;

    // Сохранение данных по залу

    let proverkaZala = vyborSeansZal.value;

    variantNazvaniyaZala.forEach(hallName => {
      if(hallName.textContent === proverkaZala) {
        proverkaIdZala = hallName.dataset.id;
      }
    })

    // Сохранение данных по фильму

    let proverkaFilma = vyborSeansFilm.value;

    variantNazvaniyaFilma.forEach(movieName => {
      if(movieName.textContent === proverkaFilma) {
        proverkaIdFilma = movieName.dataset.id;
        proverkaNazvaniyaFilma = proverkaFilma;
        proverkaProdolzhitelnostiFilma = movieName.dataset.duration;
      }
    })

    // Сохранение данных по выбранному времени

    proverkaVremeniSeansa = vvodVremeniSeansa.value;

    let vremyaSeansa = proverkaVremeniSeansa.split(':', [2]);
    nachaloSeansa = Number(vremyaSeansa[0]) * 60 + Number(vremyaSeansa[1]);

    konecSeansa = nachaloSeansa + Number(proverkaProdolzhitelnostiFilma);

    // Последний сеанс должен заканчиваться не позднее 23:59

    let posledneeVremya = 23 * 60 + 59;

    if(konecSeansa > posledneeVremya) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    // Проверка на пересечение с другими сеансами в зале

    vremyaSeansov = document.querySelectorAll(".timeline__seances");
    
    // Сбор сеансов в искомом зале

    vremyaSeansov.forEach(timeline => {
      if(Number(timeline.dataset.id) === Number(proverkaIdZala)) {
        seansyZal = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    })

    // Если зал пуст, без проверки сеансов закрыть popup и добавить новый сеанс

    if (seansyZal.length === 0) {
      popupDobavitSeans.classList.add("popup__hidden");
      dobavitNovyySeans();
      return;
    }

    // Информация о всех существующих сеансах в конкретном зале

    for (let seance of seansyZal) {

      // Получение длительности фильма в каждом существующем сеансе
      
      tekushayaProdolzhitelnostSeansa = seance.lastElementChild.dataset.duration;

      // Получение времени начала каждого существующего сеанса

      tekushiyNachaloSeansa = seance.lastElementChild.textContent;
 
      // Расчет старта и окончания каждого существующего сеанса

      let tekushiySeansTime = tekushiyNachaloSeansa.split(':', [2]);
      tekushiySeansNachalo = Number(tekushiySeansTime[0]) * 60 + Number(tekushiySeansTime[1]);

      tekushiySeansKonec = tekushiySeansNachalo + Number(tekushayaProdolzhitelnostSeansa);

      // Проверка добавляемого сеанса

      if(nachaloSeansa >= tekushiySeansNachalo && nachaloSeansa <= tekushiySeansKonec) {
        alert("Новый сеанс пересекается по времени с существующими!");
        proverennyeSeansy.push("false");
        break;
      } else if (konecSeansa >= tekushiySeansNachalo && konecSeansa <= tekushiySeansKonec) {
        alert("Новый сеанс пересекается по времени с существующими!");
        proverennyeSeansy.push("false");
        break;
      } else {
        proverennyeSeansy.push("true");
      }

    }

    if(!proverennyeSeansy.includes("false")) {
      popupDobavitSeans.classList.add("popup__hidden");
      dobavitNovyySeans();
    } else {
      return;
    }

  })
}

// Добавление сеанса в таймлайн зала

function dobavitNovyySeans() {
  otmenaSeansovFilmov.classList.remove("button_disabled");
  sohranenieSeansovFilmov.classList.remove("button_disabled");

  vremyaSeansov.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(proverkaIdZala)) {
      timeline.insertAdjacentHTML("beforeend", `
      <div class="timeline__seances_movie" data-filmid="${proverkaIdFilma}" data-seanceid="" draggable="true">
        <p class="timeline__seances_title">${proverkaNazvaniyaFilma}</p>
        <p class="timeline__movie_start" data-duration="${proverkaProdolzhitelnostiFilma}">${proverkaVremeniSeansa}</p>
      </div>
      `);
    }      
    
  })

  ustanovitFonFilma();
  
  pozitsiyaSeansa();

  udalitSeans();
}


// Удаление сеанса из таймлайна

function udalitSeans() {
  vybrannyeSeansy = document.querySelectorAll(".timeline__seances_movie");

  // Определение выбранного сеанса

  let vybrannyyElement;

  vybrannyeSeansy.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      vybrannyySeans = seance;
      vybrannyyVremya = seance.closest(".movie-seances__timeline");
      vybrannyyFilm = seance.dataset.filmid;
      vybrannoeNazvaniyeFilma = seance.firstElementChild.textContent;
      vybrannyyIdZala = seance.parentElement.dataset.id;
      vybrannyeDlyaUdalenia = vybrannyyVremya.firstElementChild;

      vybrannyeDlyaUdalenia.classList.remove("hidden");

      vybrannyyElement = event.target;

      vybrannyeDlyaUdalenia.addEventListener("dragover", (event) => {  
        event.preventDefault();
      })
    
      vybrannyeDlyaUdalenia.addEventListener("drop", (event) => {  
        event.preventDefault();
    
        // Открытие popup "Удаление сеанса"
    
        popupUdalitSeans.classList.remove("popup__hidden");

        zagolovokUdalitSeans = document.querySelector(".seance-remove_title");
        zagolovokUdalitSeans.textContent = vybrannoeNazvaniyeFilma;

        knopkaUdalitSeans = document.querySelector(".popup__remove-seance_button_delete");

        // Кнопка "Удалить" в popup "Удаление сеанса"

        knopkaUdalitSeans.addEventListener("click", (e) => {
          e.preventDefault();

          popupUdalitSeans.classList.add("popup__hidden");

          if(vybrannyySeans.dataset.seanceid !== "") {
            vybrannyyIdSeansa = vybrannyySeans.dataset.seanceid;
            udalennyeSeansy.push(vybrannyyIdSeansa);
          }

          vybrannyySeans.remove();

          // Очищение массива с удаляемыми сеансами от повторов

          filtorUdalennykhSeansov = udalennyeSeansy.filter((item, index) => {
            return udalennyeSeansy.indexOf(item) === index;
          });

          if(filtorUdalennykhSeansov.length !== 0) {
            otmenaSeansovFilmov.classList.remove("button_disabled");
            sohranenieSeansovFilmov.classList.remove("button_disabled");
          } else {
            otmenaSeansovFilmov.classList.add("button_disabled");
            sohranenieSeansovFilmov.classList.add("button_disabled");
          }
        
        })

      })

    })
  })

  vybrannyeSeansy.forEach(seance => {
    seance.addEventListener("dragend", () => {
      vybrannyyElement = undefined;
      vybrannyeDlyaUdalenia.classList.add("hidden");
    })
  })

}

// Отображение сеансов

function operaciiSeansov(data) {
  vremyaSeansov = document.querySelectorAll(".timeline__seances");

  // Загрузкa сеансов

  zagruzkaSeansov(data);

  otkritPopupSeansa(data);
  klikKnopkiDobavitSeans();

  udalitSeans();
}

// Кнопка Сохранить под сеткой сеансов

sohranenieSeansovFilmov = document.querySelector(".movie-seances__batton_save");

// Сохранить сетку сеансов

sohranenieSeansovFilmov.addEventListener("click", event => {
  if(sohranenieSeansovFilmov.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const massivSeansov = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    // Добавление сеансов

    massivSeansov.forEach(seance => {
      if(seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        dobavitSeans(params);
      }
    })
    
    // Удаление сеансов

    if (filtorUdalennykhSeansov.length !== 0) {
      filtorUdalennykhSeansov.forEach(seance => {
        let seanceId = seance;
        udalitSeansy(seanceId);
      })
    }

    alert("Сеансы сохранены!");
    location.reload();
 }
})

// Добавить сеанс на сервер

function dobavitSeans(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
  method: "POST",
  body: params 
})
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
  })
}

// Удалить сеанс с сервера

function udalitSeansy(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
    })
}
