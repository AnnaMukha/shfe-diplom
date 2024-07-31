// Добавление фильма
const knopkaDobavitFilm = document.querySelector(".admin__button_movie");
const obertkaSeansovFilmov = document.querySelector(".movie-seances__wrapper");

// Открытие popup "Добавить фильм"

knopkaDobavitFilm.addEventListener("click", () => {
  popupDobavitFilm.classList.remove("popup__hidden");
})

// popup Добавление фильма

const popupDobavitFilm = document.querySelector(".popup__movie_add");
const formaDobavitFilm = document.querySelector(".popup__form_add-movie");
const vvodNazvaniyaFilma = document.querySelector(".add-movie_name_input");
const vvodVremyaFilma = document.querySelector(".add-movie_time_input");
const vvodSinopsisFilma = document.querySelector(".add-movie_synopsis_input");
const vvodStranyFilma = document.querySelector(".add-movie_country_input");

const knopkaZagruzitPoster = document.querySelector(".input_add_poster");

let filePoster;

// Добавление фильма

function dobavitFilm(filePoster) {
  const dannyeFormy = new FormData();
  let chisloProdolzhitelnosti = Number(vvodVremyaFilma.value);

  dannyeFormy.set("filmName", `${vvodNazvaniyaFilma.value}`);
  dannyeFormy.set("filmDuration", `${chisloProdolzhitelnosti}`);
  dannyeFormy.set("filmDescription", `${vvodSinopsisFilma.value}`);
  dannyeFormy.set("filmOrigin", `${vvodStranyFilma.value}`);
  dannyeFormy.set("filePoster", filePoster);

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: dannyeFormy
  })
    .then(response => response.json())
    .then(function(data) {
      alert(`Фильм ${vvodNazvaniyaFilma.value} добавлен!`);
      location.reload();  
    })
}

// Удаление фильма

function udalitFilm(filmId) {
  fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    alert(`Фильм ${filmId} удален!`);
    location.reload();
  })
}

// Загрузить постер

knopkaZagruzitPoster.addEventListener("change", event => {
  event.preventDefault();
  let razmerFayla = knopkaZagruzitPoster.files[0].size;

  if(razmerFayla > 3000000) {
    alert("Размер файла должен быть не более 3 Mb!");
  } else {
    filePoster = knopkaZagruzitPoster.files[0];
  }
})

// Добавить фильм

formaDobavitFilm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (filePoster === undefined) {
    alert("Загрузите постер!");
    return;
  } else {
    dobavitFilm(filePoster);
  }
})

// Удалить фильм

let filmId;

obertkaSeansovFilmov.addEventListener("click", (e) => {  
  if(e.target.classList.contains("movie-seances__movie_delete")) {
    filmId = e.target.closest(".movie-seances__movie").dataset.id;
    udalitFilm(filmId);
  } else {
    return;
  }
}) 

// Отображение фильмов

function operaciiFilmov(data) {
  let schetchikFilmov = 1;

  for(let i = 0; i < data.result.films.length; i++) {
    obertkaSeansovFilmov.insertAdjacentHTML("beforeend", `
    <div class="movie-seances__movie background_${schetchikFilmov}" data-id="${data.result.films[i].id}" draggable="true" >
              <img src="${data.result.films[i].film_poster}" alt="постер" class="movie-seances__movie_poster">

              <div class="movie-seances__movie_info">
                  <p class="movie_info-title">${data.result.films[i].film_name}</p>
                  <p class="movie_info-length"><span class="movie_info-time">${data.result.films[i].film_duration}</span> минут</p> 
              </div>
              
              <span class="admin__button_remove movie-seances__movie_delete"></span>
            </div>
    `);

    schetchikFilmov++;

    if (schetchikFilmov > 5) {
      schetchikFilmov = 1;
    }  
  }
}
