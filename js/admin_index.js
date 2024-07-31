// Стрелки скрытия/раскрытия разделов

const zagolovokStrelka = document.querySelectorAll(".admin__header_arrow");

// Скрытие/раскрытие разделов

zagolovokStrelka.forEach(strelka => {
  strelka.addEventListener("click", () => {
    let zagolovokElement = strelka.closest(".admin__header");
    let adminObertka = zagolovokElement.nextElementSibling;

    strelka.classList.toggle("admin__header_arrow-hide");
    adminObertka.classList.toggle("admin__wrapper-hide");
  })
})

// popups
const vsplyvayushieOkna = Array.from(document.querySelectorAll(".popup"));
const zakrytVsplyvayushie = Array.from(document.querySelectorAll(".popup__close"));
const formyVsplyvayushie = Array.from(document.querySelectorAll(".popup__form"));
const otmenitVsplyvayushie = Array.from(document.querySelectorAll(".popup__button_cancel"));

// Закрытие popup

vsplyvayushieOkna.forEach(okno => {
  zakrytVsplyvayushie.forEach(element => {
    element.addEventListener("click", () => {
      okno.classList.add("popup__hidden");
    })
  })

  // Кнопка "отменить" в popup

  formyVsplyvayushie.forEach(forma => {
    otmenitVsplyvayushie.forEach(element => {
      element.addEventListener("click", () => {
        forma.reset();
        okno.classList.add("popup__hidden");
      })
    })
  })
})

// Запрос данных у сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    operaciiZalov(data);
    operaciiFilmov(data);
    operaciiSeansov(data);
  })
