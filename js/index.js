const knopkaVkhoda = document.querySelector(".header__button");

const dniNavigacii = Array.from(document.querySelectorAll(".nav__day"));
const navigaciyaSegodnya = document.querySelector(".nav__day_today");
const strelkaNavigaciiVpravo = document.querySelector(".right");

let kolichestvoDney = 1;

let tekushayaNedelyaNavigacii;
let tekushayaDataNavigacii;

const dniNedeli = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let segodnyaDenNedeli;

const tekushiyDen = new Date();
let proverennayaData;
let vybrannayaData;
let vybrannyyMesyac;
let vybrannyyGod;

let poluchennayaData;
let poluchennyyMesyac;
let data;

let otsortirovannyeDniNavigacii;

const osnova = document.querySelector(".main");
let filmy;
let film;
let seansyFilma;
let spisokSeansovFilma;

// Переход на авторизацию с кнопки "Войти"

knopkaVkhoda.addEventListener("click", event => {
  event.preventDefault();
  document.location="./admin-login.html";
})

// Установка даты и дня недели сегодняшнего дня

function ustanovitSegodnya(tekushiyDen) {
  segodnyaDenNedeli = dniNedeli[tekushiyDen.getDay()];

  tekushayaNedelyaNavigacii = navigaciyaSegodnya.querySelector(".nav__text-week");
  tekushayaNedelyaNavigacii.textContent = `${segodnyaDenNedeli}, `;
  
  tekushayaDataNavigacii = navigaciyaSegodnya.querySelector(".nav__text-date");
  tekushayaDataNavigacii.textContent = ` ${tekushiyDen.getDate()}`;
  
  if (tekushayaNedelyaNavigacii.textContent === "Сб, " || tekushayaNedelyaNavigacii.textContent === "Вс, ") {
    tekushayaNedelyaNavigacii.classList.add("nav__day_weekend");
    tekushayaDataNavigacii.classList.add("nav__day_weekend");
  }
}

// Установка дат и дней недели на остальные дни

function ustanovitDni() {
  dniNavigacii.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(tekushiyDen.getTime() + (1000 * 60 * 60 * 24 * i));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${dniNedeli[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Смена дней недели и дат

function smenaDney(kolichestvoDney) {
  dniNavigacii.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(tekushiyDen.getTime() + (1000 * 60 * 60 * 24 * (i + kolichestvoDney)));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${dniNedeli[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Преобразование выбранной даты для параметров

function poluchitDen(vybrannayaData, vybrannyyMesyac, vybrannyyGod) {
  if(vybrannayaData < 10) {
    poluchennayaData = `0${vybrannayaData}`;
  } else {
    poluchennayaData = vybrannayaData;
  }

  if(vybrannyyMesyac < 9) {
    poluchennyyMesyac = `0${vybrannyyMesyac}`;
  } else {
    searchMonth = poluchennyyMesyac;
  }

  data = `${vybrannyyGod}-${poluchennyyMesyac}-${poluchennayaData}`;
}

// Сортировка списка дней (избавление от кнопок со стрелками)

function sortirovkaDney(dniNavigacii) {
  otsortirovannyeDniNavigacii = dniNavigacii.filter(item => !item.classList.contains("nav__arrow"));
}

// Выделение сегодняшнего дня

navigaciyaSegodnya.classList.add("nav__day-checked");
navigaciyaSegodnya.style.cursor = "default";
navigaciyaSegodnya.dataset.date = tekushiyDen.toJSON().split("T")[0];

if(navigaciyaSegodnya.classList.contains("nav__day-checked")) {
  vybrannayaData = tekushiyDen.getDate();
  vybrannyyMesyac = tekushiyDen.getMonth() + 1;
  vybrannyyGod = tekushiyDen.getFullYear();

  poluchitDen(vybrannayaData, vybrannyyMesyac, vybrannyyGod);
  localStorage.setItem("checkedDate", data);
}

ustanovitSegodnya(tekushiyDen);
ustanovitDni();
sortirovkaDney(dniNavigacii);
otmetitProshlyeSeansy();

// При нажатии на правую стрелку

strelkaNavigaciiVpravo.addEventListener("click", () => {
  kolichestvoDney++;
  
  navigaciyaSegodnya.classList.remove("nav__day-checked");
  navigaciyaSegodnya.classList.add("nav__arrow");
  navigaciyaSegodnya.classList.add("left");
  navigaciyaSegodnya.style.cursor = "pointer";
  navigaciyaSegodnya.style.display = "flex";

  navigaciyaSegodnya.innerHTML = `
    <span class="nav__arrow-text">&lt;</span>
  `;

  smenaDney(kolichestvoDney);
  sortirovkaDney(dniNavigacii);
})

// При нажатии на левую стрелку

navigaciyaSegodnya.addEventListener("click", () => {
  if(navigaciyaSegodnya.classList.contains("nav__arrow")) {
    kolichestvoDney--;

    if(kolichestvoDney > 0) {
      smenaDney(kolichestvoDney);
      sortirovkaDney(dniNavigacii);
    } else if (kolichestvoDney === 0) {
      navigaciyaSegodnya.classList.remove("nav__arrow");
      navigaciyaSegodnya.classList.remove("left");
      navigaciyaSegodnya.style.display = "block";
    
      navigaciyaSegodnya.innerHTML = `
        <span class="nav__text-today">Сегодня</span>
        <br><span class="nav__text-week"></span> <span class="nav__text-date"></span>
      `;
  
      ustanovitSegodnya(tekushiyDen);
      ustanovitDni();

      dniNavigacii.forEach(day => {
        if(!day.classList.contains("nav__day-checked")) {
          navigaciyaSegodnya.classList.add("nav__day-checked");
          navigaciyaSegodnya.style.cursor = "default";

          vybrannayaData = tekushiyDen.getDate();
          vybrannyyMesyac = tekushiyDen.getMonth() + 1;
          vybrannyyGod = tekushiyDen.getFullYear();
        
          poluchitDen(vybrannayaData, vybrannyyMesyac, vybrannyyGod);
          localStorage.setItem("checkedDate", data);
        }
      })
  
      sortirovkaDney(dniNavigacii);
    } else {
      return;
    }

  } else {
    return;
  }
  
})

// Выбор дня

otsortirovannyeDniNavigacii.forEach(day => {
  day.addEventListener("click", () => {

    otsortirovannyeDniNavigacii.forEach(item => {
      item.classList.remove("nav__day-checked");
      item.style.cursor = "pointer";
    })

    if(!day.classList.contains("nav__arrow")) {
      day.classList.add("nav__day-checked");
      day.style.cursor = "default";

      proverennayaData = new Date(day.dataset.date);

      vybrannayaData = proverennayaData.getDate();
      vybrannyyMesyac = proverennayaData.getMonth() + 1;
      vybrannyyGod = proverennayaData.getFullYear();
        
      poluchitDen(vybrannayaData, vybrannyyMesyac, vybrannyyGod);
      localStorage.setItem("checkedDate", data);

      otmetitProshlyeSeansy();
      klikSeansa();
    }
    
  })
})

// Формирование списка фильмов и сеансов по ним

let dannyeFilmy;
let dannyeSeansy;
let dannyeZaly;

let seansyZalov;
let tekushieSeansy;

function poluchitFilmy(data) {
  dannyeFilmy = data.result.films;
  dannyeSeansy = data.result.seances;
  dannyeZaly = data.result.halls.filter(hall => hall.hall_open === 1);

  dannyeFilmy.forEach(film => {
    seansyZalov = "";

    dannyeZaly.forEach(hall => {

      //Фильтрация по сеансам в холлах, где показывается фильм

      tekushieSeansy = dannyeSeansy.filter(seance => (
        (Number(seance.seance_hallid) === Number(hall.id)) && 
        (Number(seance.seance_filmid) === Number(film.id))
      ));

      // Сортировка полученного массива по времени сеансов

      tekushieSeansy.sort(function(a, b) {
        if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) < 0) {
          return -1;
        } else if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) > 0) {
          return 1;
        }
      });

      if (tekushieSeansy.length > 0) {

        // Формирование названия зала и списка для сеансов

        seansyZalov += `
        <h3 class="movie-seances__hall" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="movie-seances__list">
        `;

        tekushieSeansy.forEach(seance => {
          // Формирование сеансов для нужного зала

          seansyZalov += `
          <li class="movie-seances__time" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">
            ${seance.seance_time}
          </li>
          `;
        });
        
        seansyZalov += `</ul>`;
      };
    });
  
    if (seansyZalov) {
      // Формирование блока с фильмом

      osnova.insertAdjacentHTML("beforeend", `
        <section class="movie" data-filmid="${film.id}">
          <div class="movie__info">
            <div class="movie__poster">
              <img src="${film.film_poster}" alt="Постер фильма ${film.film_name}" class="movie__poster_image">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${film.film_name}</h2>
              <p class="movie__synopsis">${film.film_description}</p>
              <p class="movie__data">
                <span class="movie__data-length">${film.film_duration} минут</span>
                <span class="movie__data-country">${film.film_origin}</span>
              </p>
            </div>
          </div>

          <div class="movie-seances">
            ${seansyZalov}
          </div>
        </section>
      `);
    } 
  })

  otmetitProshlyeSeansy();

  klikSeansa();
}

// Запрос данных с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    poluchitFilmy(data);
  })

// Отмечание прошедших сеансов неактивными

function otmetitProshlyeSeansy() {

  // Получение текущего времени (часы:минуты)

  const tekushieChasy = tekushiyDen.getHours();
  const tekushieMinuty = tekushiyDen.getMinutes();

  spisokSeansovFilma = document.querySelectorAll(".movie-seances__time");
  spisokSeansovFilma.forEach(seance => {

    if (Number(vybrannayaData) === Number(tekushiyDen.getDate())) {
   
      if(Number(tekushieChasy) > Number(seance.textContent.trim().slice(0,2))) {
        seance.classList.add("movie-seances__time_disabled");
      } else if(Number(tekushieChasy) === Number(seance.textContent.trim().slice(0,2))) {
        if(Number(tekushieMinuty) > Number(seance.textContent.trim().slice(3))) {
          seance.classList.add("movie-seances__time_disabled");

        } else {
          seance.classList.remove("movie-seances__time_disabled");
        }
      } else {
        seance.classList.remove("movie-seances__time_disabled");
      }
  
    } else {
      seance.classList.remove("movie-seances__time_disabled");
    }
  })
}

// Переход в зал выбранного сеанса

let idSeansa;

function klikSeansa() {
  spisokSeansovFilma = document.querySelectorAll(".movie-seances__time");

  spisokSeansovFilma.forEach(seance => {
    if(!seance.classList.contains("movie-seances__time_disabled")) {
      seance.addEventListener("click", () => {
        idSeansa = seance.dataset.seanceid;
        localStorage.setItem("seanceId", idSeansa);

        document.location="./hall.html";
      })
    }
  })

}
