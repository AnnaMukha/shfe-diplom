// Сетка сеансов
let seanceTimeline;
let movieTimeline;
let currentMovie;
let currentHall;

let hallSession;
let startTime;
let endTime;
let sessionDuration;
let sessionStart;
let currentSessionStart;
let sessionEnd;

let isSeanceAllowed = false;

// Кнопки

let seanceCancelBtn;
let seanceSaveBtn;

// popup Добавление сеанса

const popupAddSeance = document.querySelector(".popup__seance_add");
const formSeanceAdd = document.querySelector(".popup__form_add-seance");
const selectHall = document.querySelector(".select__add-seance_hall");
let hallOption;
let movieOption;
const selectMovie = document.querySelector(".select__add-seance_movie");
const inputSeanceStartTime = document.querySelector(".add-seans__input_time");
let selectedHallId;
let selectedMovieId;
let selectedMovieName;
let selectedMovieDuration;
let seanceStartTime;
let btnCancelSeance;

// popup Удаление сеанса

const popupRemoveSeance = document.querySelector(".popup__seance_remove");
let removeSeanceTitle;
let btnDeleteSeance;
let btnCancelRemoveSeance;

// Удаление сеансов

let seanceElements;
let deleteElements;

let activeSeance;
let activeSeanceId;
let timelineElement;
let activeHallId;
let activeMovieName;

let removedSeances = [];
let filteredRemovedSeances = [];

// Загрузка сеансов

function loadSessions(data) {
  seanceTimeline.forEach(timeline => {
    timeline.innerHTML = "";

    for (let i = 0; i < data.result.seances.length; i++) {
      let movieId = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));

      if (Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
          <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
            <p class="timeline__seances_title">${data.result.films[movieId].film_name}</p>
            <p class="timeline__movie_start" data-duration="${data.result.films[movieId].film_duration}">${data.result.seances[i].seance_time}</p>
          </div>
        `);
      }
    }
  });

  // Загрузка фона сеансов

  setSeanceBackground();

  // Позиционирование сеансов

  positionSessions();

  // Отслеживание изменения ширины окна

  window.addEventListener("resize", event => {
    positionSessions();
  });

  // Кнопка Отмена под сеткой сеансов

  seanceCancelBtn = document.querySelector(".movie-seances__batton_cancel");

  seanceCancelBtn.addEventListener("click", event => {
    if (seanceCancelBtn.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      removedSeances.length = 0;
      filteredRemovedSeances.length = 0;
      loadSessions(data);

      removeSession();

      seanceCancelBtn.classList.add("button_disabled");
      seanceSaveBtn.classList.add("button_disabled");
    }
  });
}

// Установка цвета фона для фильмов в таймлайнах

function setSeanceBackground() {
  const movies = document.querySelectorAll(".movie-seances__movie");
  let movieBg;
  const movieInfoArray = [];

  // Собираем массив из загруженных фильмов и сохраняем номер цвета фона в каждом

  movies.forEach(movie => {
    movieBg = movie.classList.value.match(/\d+/)[0];

    const movieInfo = {};
    movieInfo.movieId = movie.dataset.id;
    movieInfo.background = movieBg;

    movieInfoArray.push(movieInfo);
  });

  // Проставление номера цвета фона в фильмы в таймлайне с сеансами

  movieTimeline = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  movieTimeline.forEach(element => {
    for (let i = 0; i < movieInfoArray.length; i++)
      if (Number(element.dataset.filmid) === Number(movieInfoArray[i].movieId)) {
        element.classList.add(`background_${movieInfoArray[i].background}`);
      }
  });
}

// Позиционирование сеансов по таймлайну и определение ширины блока с сеансом (длительность фильма)

let totalMinutesInDay = 24 * 60;
let startSession;
let movieLength;
let movieBlockWidth;
let sessionPosition;

function positionSessions() {
  movieTimeline.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]);
    let minutes = Number(time[1]);

    startSession = (hours * 60) + minutes;
    sessionPosition = (startSession / totalMinutesInDay) * 100;

    movieLength = item.lastElementChild.dataset.duration;
    movieBlockWidth = (movieLength / totalMinutesInDay) * 100;

    item.style.left = sessionPosition + "%";
    item.style.width = movieBlockWidth + "%";

    // Уменьшение размера шрифта и padding при слишком маленькой ширине сеанса

    if (item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let movieBlockPxWidth = item.getBoundingClientRect().width;

    if (movieBlockPxWidth < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    }
  });
}

// Перетаскивание фильма в таймлайн зала (открытие popup Добавление сеанса)

function openSeancePopup(data) {
  const movieElements = document.querySelectorAll(".movie-seances__movie");
  const hallTimelines = document.querySelectorAll(".timeline__seances");

  // Определение выбранного элемента

  let draggedElement;

  movieElements.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {
      currentMovie = movie.dataset.id;
      draggedElement = event.target;
    });
  });

  // Очищаем значение выбранного элемента, если элемент отпущен

  movieElements.forEach(movie => {
    movie.addEventListener("dragend", () => {
      draggedElement = undefined;
    });
  });

  hallTimelines.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
  });

  hallTimelines.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();

      if (draggedElement === undefined) {
        return;
      }

      currentHall = timeline.dataset.id;

      // Открытие popup "Добавление сеанса"

      popupAddSeance.classList.remove("popup__hidden");

      // Очищение значений в popup

      selectHall.innerHTML = "";
      selectMovie.innerHTML = "";
      formSeanceAdd.reset();

      // Формирование select "Название зала"

      data.result.halls.forEach(hall => {
        selectHall.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance hall__name" data-id="${hall.id}">${hall.hall_name}</option>
        `);
      });

      hallOption = document.querySelectorAll(".hall__name");

      hallOption.forEach(hallName => {
        if (Number(hallName.dataset.id) === Number(currentHall)) {
          hallName.setAttribute("selected", "true");
        }
      });

      // Формирование select "Название фильма"

      data.result.films.forEach(film => {
        selectMovie.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${film.id}" data-duration="${film.film_duration}">${film.film_name}</option>
        `);
      });

      movieOption = document.querySelectorAll(".movie__name");

      movieOption.forEach(movieName => {
        if (Number(movieName.dataset.id) === Number(currentMovie)) {
          movieName.setAttribute("selected", "true");
        }
      });
    });
  });
}

// Клик по кнопке "Добавить сеанс"

let checkedSeances = [];

function handleAddSeanceButton() {
  formSeanceAdd.addEventListener("submit", (event) => {
    event.preventDefault();
    checkedSeances.length = 0;

    // Сохранение данных по залу

    let selectedHall = selectHall.value;

    hallOption.forEach(hallName => {
      if (hallName.textContent === selectedHall) {
        selectedHallId = hallName.dataset.id;
      }
    });

    // Сохранение данных по фильму

    let selectedMovie = selectMovie.value;

    movieOption.forEach(movieName => {
      if (movieName.textContent === selectedMovie) {
        selectedMovieId = movieName.dataset.id;
        selectedMovieName = selectedMovie;
        selectedMovieDuration = movieName.dataset.duration;
      }
    });

    // Сохранение данных по выбранному времени

    seanceStartTime = inputSeanceStartTime.value;

    let time = seanceStartTime.split(':', [2]);
    startTime = Number(time[0]) * 60 + Number(time[1]);

    endTime = startTime + Number(selectedMovieDuration);

    // Последний сеанс должен заканчиваться не позднее 23:59

    let endOfDay = 23 * 60 + 59;

    if (endTime > endOfDay) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    // Проверка на пересечение с другими сеансами в зале

    seanceTimeline = document.querySelectorAll(".timeline__seances");

    // Сбор сеансов в искомом зале

    seanceTimeline.forEach(timeline => {
      if (Number(timeline.dataset.id) === Number(selectedHallId)) {
        hallSession = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    });

    // Если зал пуст, без проверки сеансов закрыть popup и добавить новый сеанс

    if (hallSession.length === 0) {
      popupAddSeance.classList.add("popup__hidden");
      createNewSeance();
      return;
    }

    // Информация о всех существующих сеансах в конкретном зале

    hallSession.forEach(seance => {
      // Получение длительности фильма в каждом существующем сеансе

      sessionDuration = seance.lastElementChild.dataset.duration;

      // Получение времени начала каждого существующего сеанса

      sessionStart = seance.lastElementChild.textContent;

      // Расчет старта и окончания каждого существующего сеанса

      let sessionTime = sessionStart.split(':', [2]);
      currentSessionStart = Number(sessionTime[0]) * 60 + Number(sessionTime[1]);

      sessionEnd = currentSessionStart + Number(sessionDuration);

      // Проверка добавляемого сеанса

      if (startTime >= currentSessionStart && startTime <= sessionEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        checkedSeances.push("false");
        return;
      } else if (endTime >= currentSessionStart && endTime <= sessionEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        checkedSeances.push("false");
        return;
      } else {
        checkedSeances.push("true");
      }
    });

    if (!checkedSeances.includes("false")) {
      popupAddSeance.classList.add("popup__hidden");
      createNewSeance();
    }
  });
}

// Добавление сеанса в таймлайн зала

function createNewSeance() {
  seanceCancelBtn.classList.remove("button_disabled");
  seanceSaveBtn.classList.remove("button_disabled");

  seanceTimeline.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(selectedHallId)) {
      timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${selectedMovieId}" data-seanceid="" draggable="true">
          <p class="timeline__seances_title">${selectedMovieName}</p>
          <p class="timeline__movie_start" data-duration="${selectedMovieDuration}">${seanceStartTime}</p>
        </div>
      `);
    }
  });

  setSeanceBackground();
  positionSessions();
  removeSession();
}

// Удаление сеанса из таймлайна

function removeSession() {
  seanceElements = document.querySelectorAll(".timeline__seances_movie");

  // Определение выбранного сеанса

  let draggedSeance;

  seanceElements.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      activeSeance = seance;
      timelineElement = seance.closest(".movie-seances__timeline");
      currentMovie = seance.dataset.filmid;
      activeMovieName = seance.firstElementChild.textContent;
      activeHallId = seance.parentElement.dataset.id;
      deleteElements = timelineElement.firstElementChild;

      deleteElements.classList.remove("hidden");

      draggedSeance = event.target;

      deleteElements.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      deleteElements.addEventListener("drop", (event) => {
        event.preventDefault();

        // Открытие popup "Удаление сеанса"

        popupRemoveSeance.classList.remove("popup__hidden");

        removeSeanceTitle = document.querySelector(".seance-remove_title");
        removeSeanceTitle.textContent = activeMovieName;

        btnDeleteSeance = document.querySelector(".popup__remove-seance_button_delete");

        // Кнопка "Удалить" в popup "Удаление сеанса"

        btnDeleteSeance.addEventListener("click", (e) => {
          e.preventDefault();

          popupRemoveSeance.classList.add("popup__hidden");

          if (activeSeance.dataset.seanceid !== "") {
            activeSeanceId = activeSeance.dataset.seanceid;
            removedSeances.push(activeSeanceId);
          }

          activeSeance.remove();

          // Очищение массива с удаляемыми сеансами от повторов

          filteredRemovedSeances = removedSeances.filter((item, index) => {
            return removedSeances.indexOf(item) === index;
          });

          if (filteredRemovedSeances.length !== 0) {
            seanceCancelBtn.classList.remove("button_disabled");
            seanceSaveBtn.classList.remove("button_disabled");
          } else {
            seanceCancelBtn.classList.add("button_disabled");
            seanceSaveBtn.classList.add("button_disabled");
          }
        });
      });
    });
  });

  seanceElements.forEach(seance => {
    seance.addEventListener("dragend", () => {
      draggedSeance = undefined;
      deleteElements.classList.add("hidden");
    });
  });
}

// Отображение сеансов

function manageSeances(data) {
  seanceTimeline = document.querySelectorAll(".timeline__seances");

  // Загрузкa сеансов

  loadSessions(data);

  openSeancePopup(data);
  handleAddSeanceButton();

  removeSession();
}

// Кнопка Сохранить под сеткой сеансов

seanceSaveBtn = document.querySelector(".movie-seances__batton_save");

// Сохранить сетку сеансов

seanceSaveBtn.addEventListener("click", event => {
  if (seanceSaveBtn.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const sessionArray = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    // Добавление сеансов

    sessionArray.forEach(seance => {
      if (seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        addSeanceToServer(params);
      }
    });

    // Удаление сеансов

    if (filteredRemovedSeances.length !== 0) {
      filteredRemovedSeances.forEach(seance => {
        let seanceId = seance;
        removeSeanceFromServer(seanceId);
      });
    }

    alert("Сеансы сохранены!");
    location.reload();
  }
});

// Добавить сеанс на сервер

function addSeanceToServer(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
    method: "POST",
    body: params
  })
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
    });
}

// Удалить сеанс с сервера

function removeSeanceFromServer(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
    });
}
