const idSeansa = Number(localStorage.getItem("seanceId"));
const proverennayaData = localStorage.getItem("checkedDate");
const bilety = JSON.parse(localStorage.getItem("tickets"));
const informaciyaBiletov = JSON.parse(localStorage.getItem("ticketsInfo"));

const informaciyaFilma = document.querySelector(".ticket__info-movie");
const informaciyaMest = document.querySelector(".ticket__info-places");
const informaciyaZala = document.querySelector(".ticket__info-hall");
const informaciyaVremeni = document.querySelector(".ticket__info-time");

const qrKodBileta = document.querySelector(".ticket__info-qr");
let tekstQr;
let kodQr;

let mesta = [];
let stoimost = [];
let konechnayaSumma;

// Отображение данных о билете

function poluchitInformaciyu(data) {
  let indexSeansa = data.result.seances.findIndex(item => item.id === Number(idSeansa));
  let indexFilma = data.result.films.findIndex(item => item.id === data.result.seances[indexSeansa].seance_filmid);
  let indexZala = data.result.halls.findIndex(item => item.id === data.result.seances[indexSeansa].seance_hallid);

  informaciyaFilma.textContent = data.result.films[indexFilma].film_name;
  informaciyaZala.textContent = data.result.halls[indexZala].hall_name;
  informaciyaVremeni.textContent = data.result.seances[indexSeansa].seance_time;

  bilety.forEach(ticket => {
    mesta.push(ticket.row + "/" + ticket.place);
    stoimost.push(ticket.coast);
  })

  informaciyaMest.textContent = mesta.join(", ");

  konechnayaSumma = stoimost.reduce((acc, price) => acc + price, 0);

  // Создание QR-кода с информацией по билетам

  tekstQr = `
    Дата: ${proverennayaData}, 
    Время: ${informaciyaVremeni.textContent}, 
    Название фильма: ${informaciyaFilma.textContent}, 
    Зал: ${informaciyaZala.textContent}, 
    Ряд/Место: ${mesta.join(", ")}, 
    Стоимость: ${konechnayaSumma}, 
    Билет действителен строго на свой сеанс
  `

  kodQr = QRCreator(tekstQr, 
    { mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "PNG",
      modsize: 3,
      margin: 3
    });

  qrKodBileta.append(kodQr.result);

  localStorage.clear();
}

// Запрос к серверу (информация по фильму, залу и сеансу)

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    poluchitInformaciyu(data);
  })
