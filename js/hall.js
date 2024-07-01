let currentSeanceId = Number(localStorage.getItem("seanceId"));
let currentCheckedDate = localStorage.getItem("checkedDate");

const bodyElement = document.querySelector("body");
const infoSection = document.querySelector(".buying__info");

const titleMovie = document.querySelector(".buying__info_title");
const startTimeSeance = document.querySelector(".buying__info-time");
const nameHall = document.querySelector(".buying__info_hall");

const seatScheme = document.querySelector(".buying__scheme_places");
let hallRowsScheme;
let seatsInHall;

const standardPriceElement = document.querySelector(".price_standart");
const vipPriceElement = document.querySelector(".price_vip");
let priceStandard;
let priceVip;

let selectedSeats;
let ticketList = [];
let totalCost;

const bookButton = document.querySelector(".buying__button");

// Увеличение экрана при двойном тапе на мобильных устройствах

bodyElement.addEventListener("dblclick", () => {
  if ((Number(bodyElement.getBoundingClientRect().width)) < 1200) {
    if (bodyElement.getAttribute("transformed") === "false" || !bodyElement.hasAttribute("transformed")) {
      bodyElement.style.zoom = "1.5";
      bodyElement.style.transform = "scale(1.5)";
      bodyElement.style.transformOrigin = "0 0";
      bodyElement.setAttribute("transformed", "true");
    } else if (bodyElement.getAttribute("transformed") === "true") {
      bodyElement.style.zoom = "1";
      bodyElement.style.transform = "scale(1)";
      bodyElement.style.transformOrigin = "0 0";
      bodyElement.setAttribute("transformed", "false");
    }
  }
});

// Отображение данных о фильме, сеансе и зале

function displayInfo(data) {
  let seanceIndex = data.result.seances.findIndex(item => item.id === Number(currentSeanceId));
  let movieIndex = data.result.films.findIndex(item => item.id === data.result.seances[seanceIndex].seance_filmid);
  let hallIndex = data.result.halls.findIndex(item => item.id === data.result.seances[seanceIndex].seance_hallid);

  titleMovie.textContent = data.result.films[movieIndex].film_name;
  startTimeSeance.textContent = data.result.seances[seanceIndex].seance_time;
  nameHall.textContent = data.result.halls[hallIndex].hall_name;

  standardPriceElement.textContent = data.result.halls[hallIndex].hall_price_standart;
  vipPriceElement.textContent = data.result.halls[hallIndex].hall_price_vip;

  priceStandard = data.result.halls[hallIndex].hall_price_standart;
  priceVip = data.result.halls[hallIndex].hall_price_vip;
}

// Отображение данных о схеме зала

function renderHallScheme(data) {
  let hallConfiguration = data.result;

  hallConfiguration.forEach(() => {
    seatScheme.insertAdjacentHTML("beforeend", `<div class="buying__scheme_row"></div>`);
  });

  hallRowsScheme = document.querySelectorAll(".buying__scheme_row");

  for (let i = 0; i < hallRowsScheme.length; i++) {
    for (let j = 0; j < hallConfiguration[i].length; j++) {
      hallRowsScheme[i].insertAdjacentHTML("beforeend", `<span class="buying__scheme_chair" data-type="${hallConfiguration[i][j]}"></span>`);
    }
  }

  seatsInHall = document.querySelectorAll(".buying__scheme_chair");

  seatsInHall.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("chair_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("chair_standart");
    } else if (element.dataset.type === "taken") {
      element.classList.add("chair_occupied");
    } else {
      element.classList.add("no-chair");
    }
  });
}

// Выбор мест

function selectSeats(hallRowsScheme) {
  let hallSelectRows = Array.from(hallRowsScheme);
  hallSelectRows.forEach(row => {
    let hallSelectPlaces = Array.from(row.children);
    hallSelectPlaces.forEach(place => {
      if (place.dataset.type !== "disabled" && place.dataset.type !== "taken") {
        place.addEventListener("click", () => {
          place.classList.toggle("chair_selected");

          selectedSeats = document.querySelectorAll(".chair_selected:not(.buying__scheme_legend-chair)");

          // Активация кнопки "Забронировать"

          if (selectedSeats.length === 0) {
            bookButton.classList.add("buying__button_disabled");
          } else {
            bookButton.classList.remove("buying__button_disabled");
          }
        });
      }
    });
  });
}

// Клик по кнопке "Забронировать"

function handleBookingButton() {
  bookButton.addEventListener("click", event => {
    event.preventDefault();

    if (bookButton.classList.contains("buying__button_disabled")) {
      return;
    } else {
      let hallSelectedRows = Array.from(document.querySelectorAll(".buying__scheme_row"));

      ticketList = [];

      hallSelectedRows.forEach(row => {
        let rowIndex = hallSelectedRows.findIndex(currentRow => currentRow === row);

        let hallSelectedPlaces = Array.from(row.children);

        hallSelectedPlaces.forEach(place => {
          let placeIndex = hallSelectedPlaces.findIndex(currentPlace => currentPlace === place);

          if (place.classList.contains("chair_selected")) {
            if (place.dataset.type === "standart") {
              totalCost = priceStandard;
            } else if (place.dataset.type === "vip") {
              totalCost = priceVip;
            }

            ticketList.push({
              row: rowIndex + 1,
              place: placeIndex + 1,
              cost: totalCost,
            });
          }
        });
      });

      localStorage.setItem("tickets", JSON.stringify(ticketList));

      document.location = "./payment.html";
    }
  });
}

// Получение общих данных с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function (data) {
    console.log(data);
    displayInfo(data);

    // Получение данных о схеме зала

    fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${currentSeanceId}&date=${currentCheckedDate}`)
      .then(response => response.json())
      .then(function (data) {
        console.log(data);
        renderHallScheme(data);
        selectSeats(hallRowsScheme);
        handleBookingButton();
      });
  });
