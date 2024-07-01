const btnLogin = document.querySelector(".header__button");

const daysNav = Array.from(document.querySelectorAll(".nav__day"));
const todayNav = document.querySelector(".nav__day_today");
const rightNavArrow = document.querySelector(".right");

let counterDays = 1;

let todayWeekdayNav;
let todayDateNav;

const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let weekdayToday;

const currentDate = new Date();
let chosenDate;
let dateSelected;
let monthSelected;
let yearSelected;

let formattedDate;
let formattedMonth;
let fullDate;

let sortedNavDays;

const mainSection = document.querySelector(".main");
let filmList;
let individualFilm;
let filmSeances;
let seanceList;

// Переход на авторизацию с кнопки "Войти"

btnLogin.addEventListener("click", event => {
  event.preventDefault();
  document.location = "./admin-login.html";
});

// Установка даты и дня недели сегодняшнего дня

function setTodayDate(currentDate) {
  weekdayToday = weekdays[currentDate.getDay()];

  todayWeekdayNav = todayNav.querySelector(".nav__text-week");
  todayWeekdayNav.textContent = `${weekdayToday}, `;

  todayDateNav = todayNav.querySelector(".nav__text-date");
  todayDateNav.textContent = ` ${currentDate.getDate()}`;

  if (todayWeekdayNav.textContent === "Сб, " || todayWeekdayNav.textContent === "Вс, ") {
    todayWeekdayNav.classList.add("nav__day_weekend");
    todayDateNav.classList.add("nav__day_weekend");
  }
}

// Установка дат и дней недели на остальные дни

function initializeDays() {
  daysNav.forEach((day, i) => {
    if (!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * i));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekdays[date.getDay()]},`;
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

function updateDays(daysCount) {
  daysNav.forEach((day, i) => {
    if (!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * (i + daysCount)));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekdays[date.getDay()]},`;
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

function formatDate(selectedDate, selectedMonth, selectedYear) {
  formattedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
  formattedMonth = selectedMonth < 9 ? `0${selectedMonth + 1}` : selectedMonth + 1;
  fullDate = `${selectedYear}-${formattedMonth}-${formattedDate}`;
}

// Сортировка списка дней (избавление от кнопок со стрелками)

function filterDays(navDays) {
  sortedNavDays = navDays.filter(item => !item.classList.contains("nav__arrow"));
}

// Выделение сегодняшнего дня

todayNav.classList.add("nav__day-checked");
todayNav.style.cursor = "default";
todayNav.dataset.date = currentDate.toJSON().split("T")[0];

if (todayNav.classList.contains("nav__day-checked")) {
  dateSelected = currentDate.getDate();
  monthSelected = currentDate.getMonth();
  yearSelected = currentDate.getFullYear();

  formatDate(dateSelected, monthSelected, yearSelected);
  localStorage.setItem("checkedDate", fullDate);
}

setTodayDate(currentDate);
initializeDays();
filterDays(daysNav);
highlightPastSeances();

// При нажатии на правую стрелку

rightNavArrow.addEventListener("click", () => {
  counterDays++;

  todayNav.classList.remove("nav__day-checked");
  todayNav.classList.add("nav__arrow");
  todayNav.classList.add("left");
  todayNav.style.cursor = "pointer";
  todayNav.style.display = "flex";

  todayNav.innerHTML = `
    <span class="nav__arrow-text">&lt;</span>
  `;

  updateDays(counterDays);
  filterDays(daysNav);
});

// При нажатии на левую стрелку

todayNav.addEventListener("click", () => {
  if (todayNav.classList.contains("nav__arrow")) {
    counterDays--;

    if (counterDays > 0) {
      updateDays(counterDays);
      filterDays(daysNav);
    } else if (counterDays === 0) {
      todayNav.classList.remove("nav__arrow");
      todayNav.classList.remove("left");
      todayNav.style.display = "block";

      todayNav.innerHTML = `
        <span class="nav__text-today">Сегодня</span>
        <br><span class="nav__text-week"></span> <span class="nav__text-date"></span>
      `;

      setTodayDate(currentDate);
      initializeDays();

      daysNav.forEach(day => {
        if (!day.classList.contains("nav__day-checked")) {
          todayNav.classList.add("nav__day-checked");
          todayNav.style.cursor = "default";

          dateSelected = currentDate.getDate();
          monthSelected = currentDate.getMonth();
          yearSelected = currentDate.getFullYear();

          formatDate(dateSelected, monthSelected, yearSelected);
          localStorage.setItem("checkedDate", fullDate);
        }
      });

      filterDays(daysNav);
    } else {
      return;
    }
  } else {
    return;
  }
});

// Выбор дня

sortedNavDays.forEach(day => {
  day.addEventListener("click", () => {
    sortedNavDays.forEach(item => {
      item.classList.remove("nav__day-checked");
      item.style.cursor = "pointer";
    });

    if (!day.classList.contains("nav__arrow")) {
      day.classList.add("nav__day-checked");
      day.style.cursor = "default";

      chosenDate = new Date(day.dataset.date);

      dateSelected = chosenDate.getDate();
      monthSelected = chosenDate.getMonth();
      yearSelected = chosenDate.getFullYear();

      formatDate(dateSelected, monthSelected, yearSelected);
      localStorage.setItem("checkedDate", fullDate);

      highlightPastSeances();
      handleSeanceClick();
    }
  });
});

// Формирование списка фильмов и сеансов по ним

let filmData;
let seanceData;
let hallData;

let hallSeanceData;
let currentSeanceList;

function displayMovies(data) {
  filmData = data.result.films;
  seanceData = data.result.seances;
  hallData = data.result.halls.filter(hall => hall.hall_open === 1);

  filmData.forEach(film => {
    hallSeanceData = "";

    hallData.forEach(hall => {
      // Фильтрация по сеансам в холлах, где показывается фильм
      currentSeanceList = seanceData.filter(seance => (
        (Number(seance.seance_hallid) === Number(hall.id)) &&
        (Number(seance.seance_filmid) === Number(film.id))
      ));

      // Сортировка полученного массива по времени сеансов
      currentSeanceList.sort((a, b) => {
        return (a.seance_time.slice(0, 2) - b.seance_time.slice(0, 2));
      });

      if (currentSeanceList.length > 0) {
        // Формирование названия зала и списка для сеансов
        hallSeanceData += `
        <h3 class="movie-seances__hall" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="movie-seances__list">
        `;

        currentSeanceList.forEach(seance => {
          // Формирование сеансов для нужного зала
          hallSeanceData += `
          <li class="movie-seances__time" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">
            ${seance.seance_time}
          </li>
          `;
        });

        hallSeanceData += `</ul>`;
      }
    });

    if (hallSeanceData) {
      // Формирование блока с фильмом
      mainSection.insertAdjacentHTML("beforeend", `
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
            ${hallSeanceData}
          </div>
        </section>
      `);
    }
  });

  highlightPastSeances();
  handleSeanceClick();
}

// Запрос данных с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function (data) {
    console.log(data);
    displayMovies(data);
  });

// Отмечание прошедших сеансов неактивными

function highlightPastSeances() {
  // Получение текущего времени (часы:минуты)
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  seanceList = document.querySelectorAll(".movie-seances__time");
  seanceList.forEach(seance => {
    if (Number(dateSelected) === Number(currentDate.getDate())) {
      if (Number(currentHours) > Number(seance.textContent.trim().slice(0, 2))) {
        seance.classList.add("movie-seances__time_disabled");
      } else if (Number(currentHours) === Number(seance.textContent.trim().slice(0, 2))) {
        if (Number(currentMinutes) > Number(seance.textContent.trim().slice(3))) {
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
  });
}

// Переход в зал выбранного сеанса

let selectedSeanceId;

function handleSeanceClick() {
  seanceList = document.querySelectorAll(".movie-seances__time");

  seanceList.forEach(seance => {
    if (!seance.classList.contains("movie-seances__time_disabled")) {
      seance.addEventListener("click", () => {
        selectedSeanceId = seance.dataset.seanceid;
        localStorage.setItem("seanceId", selectedSeanceId);

        document.location = "./hall.html";
      });
    }
  });
}
