const idSeansa = Number(localStorage.getItem("seanceId"));
const proverennayaData = localStorage.getItem("checkedDate");
const bilety = JSON.parse(localStorage.getItem("tickets"));

const informaciyaFilma = document.querySelector(".ticket__info-movie");
const informaciyaMest = document.querySelector(".ticket__info-places");
const informaciyaZala = document.querySelector(".ticket__info-hall");
const informaciyaVremeni = document.querySelector(".ticket__info-time");
const informaciyaStoimosti = document.querySelector(".ticket__info-price");

let mesta = [];
let stoimost = [];
let konechnayaSumma;

const knopkaBileta = document.querySelector(".ticket__button");

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
  informaciyaStoimosti.textContent = konechnayaSumma;
}

// Запрос к серверу (информация по фильму, залу и сеансу)

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    poluchitInformaciyu(data);
  })

// Клик по кнопке "Получить код бронирования"

knopkaBileta.addEventListener("click", event => {
  event.preventDefault();

  const params = new FormData();
    params.set("seanceId", idSeansa);
    params.set("ticketDate", proverennayaData);
    params.set("tickets", JSON.stringify(bilety));
  
    fetch("https://shfe-diplom.neto-server.ru/ticket", {
      method: "POST",
      body: params
      })
      .then(response => response.json())
      .then(function(data) {
        console.log(data); 
        
        if(data.success === true) { 
          localStorage.setItem("ticketsInfo", JSON.stringify(data));
          document.location="./ticket.html";
        } else {
          alert("Места недоступны для бронирования!");
          return;
        }
    })  
})
