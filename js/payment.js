const selectedSeanceId = Number(localStorage.getItem("seanceId"));
const selectedDate = localStorage.getItem("checkedDate");
const selectedTickets = JSON.parse(localStorage.getItem("tickets"));

const movieTitleElement = document.querySelector(".ticket__info-movie");
const seatsElement = document.querySelector(".ticket__info-places");
const hallNameElement = document.querySelector(".ticket__info-hall");
const seanceTimeElement = document.querySelector(".ticket__info-time");
const totalPriceElement = document.querySelector(".ticket__info-price");

let seatNumbers = [];
let ticketPrices = [];
let totalAmount;

const bookButton = document.querySelector(".ticket__button");

// Отображение данных о билете

function displayTicketInfo(data) {
  let seanceIndex = data.result.seances.findIndex(item => item.id === Number(selectedSeanceId));
  let movieIndex = data.result.films.findIndex(item => item.id === data.result.seances[seanceIndex].seance_filmid);
  let hallIndex = data.result.halls.findIndex(item => item.id === data.result.seances[seanceIndex].seance_hallid);

  movieTitleElement.textContent = data.result.films[movieIndex].film_name;
  hallNameElement.textContent = data.result.halls[hallIndex].hall_name;
  seanceTimeElement.textContent = data.result.seances[seanceIndex].seance_time;

  selectedTickets.forEach(ticket => {
    seatNumbers.push(ticket.row + "/" + ticket.place);
    ticketPrices.push(ticket.coast);
  });

  seatsElement.textContent = seatNumbers.join(", ");

  totalAmount = ticketPrices.reduce((acc, price) => acc + price, 0);
  totalPriceElement.textContent = totalAmount;
}

// Запрос к серверу (информация по фильму, залу и сеансу)

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function (data) {
    console.log(data);
    displayTicketInfo(data);
  });

// Клик по кнопке "Получить код бронирования"

bookButton.addEventListener("click", event => {
  event.preventDefault();

  const params = new FormData();
  params.set("seanceId", selectedSeanceId);
  params.set("ticketDate", selectedDate);
  params.set("tickets", JSON.stringify(selectedTickets));

  fetch("https://shfe-diplom.neto-server.ru/ticket", {
    method: "POST",
    body: params
  })
    .then(response => response.json())
    .then(function (data) {
      console.log(data);

      if (data.success === true) {
        localStorage.setItem("ticketsInfo", JSON.stringify(data));
        document.location = "./ticket.html";
      } else {
        alert("Места недоступны для бронирования!");
        return;
      }
    });
});
