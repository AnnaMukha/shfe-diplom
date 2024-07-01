// Добавление фильма
const btnAddMovie = document.querySelector(".admin__button_movie");
const wrapperMovieSeances = document.querySelector(".movie-seances__wrapper");

// Открытие popup "Добавить фильм"

btnAddMovie.addEventListener("click", () => {
  popupAddMovie.classList.remove("popup__hidden");
});

// popup Добавление фильма

const popupAddMovie = document.querySelector(".popup__movie_add");
const formMovieAdd = document.querySelector(".popup__form_add-movie");
const inputNameMovie = document.querySelector(".add-movie_name_input");
const inputTimeMovie = document.querySelector(".add-movie_time_input");
const inputSynopsisMovie = document.querySelector(".add-movie_synopsis_input");
const inputCountryMovie = document.querySelector(".add-movie_country_input");

const btnAddPoster = document.querySelector(".input_add_poster");

let filePoster;

// Добавление фильма

function submitMovie(filePoster) {
  const movieData = new FormData();
  let duration = Number(inputTimeMovie.value);

  movieData.set("filmName", `${inputNameMovie.value}`);
  movieData.set("filmDuration", `${duration}`);
  movieData.set("filmDescription", `${inputSynopsisMovie.value}`);
  movieData.set("filmOrigin", `${inputCountryMovie.value}`);
  movieData.set("filePoster", filePoster);

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: movieData
  })
    .then(response => response.json())
    .then(function(data) {
      alert(`Фильм ${inputNameMovie.value} добавлен!`);
      location.reload();  
    });
}

// Удаление фильма

function removeMovie(movieId) {
  fetch(`https://shfe-diplom.neto-server.ru/film/${movieId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    alert(`Фильм ${movieId} удален!`);
    location.reload();
  });
}

// Загрузить постер

btnAddPoster.addEventListener("change", event => {
  event.preventDefault();
  let sizeFile = btnAddPoster.files[0].size;

  if(sizeFile > 3000000) {
    alert("Размер файла должен быть не более 3 Mb!");
  } else {
    filePoster = btnAddPoster.files[0];
  }
});

// Добавить фильм

formMovieAdd.addEventListener("submit", (e) => {
  e.preventDefault();
  if (filePoster === undefined) {
    alert("Загрузите постер!");
    return;
  } else {
    submitMovie(filePoster);
  }
});

// Удалить фильм

let currentMovieId;

wrapperMovieSeances.addEventListener("click", (e) => {  
  if(e.target.classList.contains("movie-seances__movie_delete")) {
    currentMovieId = e.target.closest(".movie-seances__movie").dataset.id;
    removeMovie(currentMovieId);
  } else {
    return;
  }
}); 

// Отображение фильмов

function renderMovies(data) {
  let countMovies = 1;

  data.result.films.forEach((film, index) => {
    wrapperMovieSeances.insertAdjacentHTML("beforeend", `
      <div class="movie-seances__movie background_${countMovies}" data-id="${film.id}" draggable="true">
        <img src="${film.film_poster}" alt="постер" class="movie-seances__movie_poster">
        <div class="movie-seances__movie_info">
          <p class="movie_info-title">${film.film_name}</p>
          <p class="movie_info-length"><span class="movie_info-time">${film.film_duration}</span> минут</p> 
        </div>
        <span class="admin__button_remove movie-seances__movie_delete"></span>
      </div>
    `);

    countMovies = (countMovies % 5) + 1;
  });
}
