// Стрелки скрытия/раскрытия разделов

const sectionArrows = document.querySelectorAll(".admin__header_arrow");

// Скрытие/раскрытие разделов

sectionArrows.forEach(arrow => {
  arrow.addEventListener("click", () => {
    const header = arrow.closest(".admin__header");
    const wrapper = header.nextElementSibling;

    arrow.classList.toggle("admin__header_arrow-hide");
    wrapper.classList.toggle("admin__wrapper-hide");
  });
});

// popups
const allPopups = Array.from(document.querySelectorAll(".popup"));
const closeButtons = Array.from(document.querySelectorAll(".popup__close"));
const formsInPopups = Array.from(document.querySelectorAll(".popup__form"));
const cancelButtons = Array.from(document.querySelectorAll(".popup__button_cancel"));

// Закрытие popup

allPopups.forEach(popup => {
  closeButtons.forEach(button => {
    button.addEventListener("click", () => {
      popup.classList.add("popup__hidden");
    });
  });

  // Кнопка "отменить" в popup

  formsInPopups.forEach(form => {
    cancelButtons.forEach(button => {
      button.addEventListener("click", () => {
        form.reset();
        popup.classList.add("popup__hidden");
      });
    });
  });
});

// Запрос данных у сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(data => {
    handleHalls(data);
    handleMovies(data);
    handleSeances(data);
  });

// Обработчики данных залов, фильмов и сеансов

function handleHalls(data) {
  hallsOperations(data);
}

function handleMovies(data) {
  moviesOperations(data);
}

function handleSeances(data) {
  seancesOperations(data);
}
