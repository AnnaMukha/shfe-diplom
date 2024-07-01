const currentSeanceId = Number(localStorage.getItem("seanceId"));
const currentCheckedDate = localStorage.getItem("checkedDate");
const selectedTickets = JSON.parse(localStorage.getItem("tickets"));
const bookingInfo = JSON.parse(localStorage.getItem("ticketsInfo"));

const movieTitleElement = document.querySelector(".ticket__info-movie");
const seatNumbersElement = document.querySelector(".ticket__info-places");
const hallNameElement = document.querySelector(".ticket__info-hall");
const seanceTimeElement = document.querySelector(".ticket__info-time");

const qrCodeElement = document.querySelector(".ticket__info-qr");
let qrText;
let qrCodeImage;

let seatNumbers = [];
let ticketCosts = [];
let totalAmount;

// Отображение данных о билете

function displayTicketInfo(data) {
  const seanceIndex = data.result.seances.findIndex(item => item.id === Number(currentSeanceId));
  const movieIndex = data.result.films.findIndex(item => item.id === data.result.seances[seanceIndex].seance_filmid);
  const hallIndex = data.result.halls.findIndex(item => item.id === data.result.seances[seanceIndex].seance_hallid);

  movieTitleElement.textContent = data.result.films[movieIndex].film_name;
  hallNameElement.textContent = data.result.halls[hallIndex].hall_name;
  seanceTimeElement.textContent = data.result.seances[seanceIndex].seance_time;

  selectedTickets.forEach(ticket => {
    seatNumbers.push(`${ticket.row}/${ticket.place}`);
    ticketCosts.push(ticket.coast);
  });

  seatNumbersElement.textContent = seatNumbers.join(", ");
  totalAmount = ticketCosts.reduce((acc, price) => acc + price, 0);

  // Создание QR-кода с информацией по билетам

  qrText = `
    Дата: ${currentCheckedDate}, 
    Время: ${seanceTimeElement.textContent}, 
    Название фильма: ${movieTitleElement.textContent}, 
    Зал: ${hallNameElement.textContent}, 
    Ряд/Место: ${seatNumbers.join(", ")}, 
    Стоимость: ${totalAmount}, 
    Билет действителен строго на свой сеанс
  `;

  qrCodeImage = QRCreator(qrText, 
    { mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "PNG",
      modsize: 3,
      margin: 3
    });

  qrCodeElement.append(qrCodeImage.result);
  localStorage.clear();
}

// Запрос к серверу (информация по фильму, залу и сеансу)

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function (data) {
    console.log(data);
    displayTicketInfo(data);
  });
