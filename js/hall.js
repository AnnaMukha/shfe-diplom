let idSeansa = Number(localStorage.getItem("seanceId"));
let proverennayaData = localStorage.getItem("checkedDate");

const telo = document.querySelector("body");
const informaciyaPokupki = document.querySelector(".buying__info");

const nazvanieFilma = document.querySelector(".buying__info_title");
const vremyaNachalaSeansa = document.querySelector(".buying__info-time");
const nazvanieZala = document.querySelector(".buying__info_hall");

const skhema = document.querySelector(".buying__scheme_places");
let strokiSkhemaZala;
let kreslaZala;

const cenaStandartZala = document.querySelector(".price_standart");
const cenaVipZala = document.querySelector(".price_vip");
let cenaStandart;
let cenaVip;

let vybrannyeMesta;
let bilety = [];
let stoimost;

const knopkaPokupki = document.querySelector(".buying__button");

// Увеличение экрана при двойном тапе на мобильных устройствах

telo.addEventListener("dblclick", () => {
  if((Number(telo.getBoundingClientRect().width)) < 1200) {
    if(telo.getAttribute("transformed") === "false" || !telo.hasAttribute("transformed")) {
      telo.style.zoom = "1.5";
      telo.style.transform = "scale(1.5)";
      telo.style.transformOrigin = "0 0";
      telo.setAttribute("transformed", "true")
    } else if(telo.getAttribute("transformed") === "true") {
      telo.style.zoom = "1";
      telo.style.transform = "scale(1)";
      telo.style.transformOrigin = "0 0";
      telo.setAttribute("transformed", "false");
    }
  }
})

// Отображение данных о фильме, сеансе и зале

function ustanovitInformaciyu(data) {
  let indexSeansa = data.result.seances.findIndex(item => item.id === Number(idSeansa));
  let indexFilma = data.result.films.findIndex(item => item.id === data.result.seances[indexSeansa].seance_filmid);
  let indexZala = data.result.halls.findIndex(item => item.id === data.result.seances[indexSeansa].seance_hallid);

  nazvanieFilma.textContent = data.result.films[indexFilma].film_name;
  vremyaNachalaSeansa.textContent = data.result.seances[indexSeansa].seance_time;
  nazvanieZala.textContent = data.result.halls[indexZala].hall_name;

  cenaStandartZala.textContent = data.result.halls[indexZala].hall_price_standart;
  cenaVipZala.textContent = data.result.halls[indexZala].hall_price_vip;

  cenaStandart = data.result.halls[indexZala].hall_price_standart;
  cenaVip = data.result.halls[indexZala].hall_price_vip;
}

// Отображение данных о схеме зала

function pokazatSkhemuZala(data) {
  let konfiguraciyaZala = data.result;

  konfiguraciyaZala.forEach(() => {
    skhema.insertAdjacentHTML("beforeend", `<div class="buying__scheme_row"></div>`);
  });
    
  strokiSkhemaZala = document.querySelectorAll(".buying__scheme_row");

  for(let i = 0; i < strokiSkhemaZala.length; i++) {
    for(let j = 0; j < konfiguraciyaZala[i].length; j++) {
      strokiSkhemaZala[i].insertAdjacentHTML("beforeend", `<span class="buying__scheme_chair" data-type="${konfiguraciyaZala[i][j]}"></span>`);
    }
  }

  kreslaZala = document.querySelectorAll(".buying__scheme_chair");

  kreslaZala.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("chair_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("chair_standart");
    } else if (element.dataset.type === "taken") {
      element.classList.add("chair_occupied");
    } else {
      element.classList.add("no-chair");
    }
  })

}

// Выбор мест

function vybratMesta(strokiSkhemaZala) {
  let vybrannyeStroki = Array.from(strokiSkhemaZala);
  vybrannyeStroki.forEach(row => {
    let vybrannyeMesta = Array.from(row.children);
    vybrannyeMesta.forEach(place => {   
      if(place.dataset.type !== "disabled" && place.dataset.type !== "taken") {
        place.addEventListener("click", () => {
          place.classList.toggle("chair_selected");

          vybrannyeMesta = document.querySelectorAll(".chair_selected:not(.buying__scheme_legend-chair)");

          // Активация кнопки "Забронировать"

          if (vybrannyeMesta.length === 0) {
            knopkaPokupki.classList.add("buying__button_disabled");
          } else {
            knopkaPokupki.classList.remove("buying__button_disabled");
          }
        })

      }
    })
  })  
}

// Клик по кнопке "Забронировать"

function klikKnopkiBronirovaniya() {
  knopkaPokupki.addEventListener("click", event => {
    event.preventDefault();

    if(knopkaPokupki.classList.contains("buying__button_disabled")) {
      return;
    } else {

      let vybrannyeStroki = Array.from(document.querySelectorAll(".buying__scheme_row"));

      bilety = [];

      vybrannyeStroki.forEach(row => {
        let indexStroki = vybrannyeStroki.findIndex(currentRow => currentRow === row);
       
        let vybrannyeMesta = Array.from(row.children);

        vybrannyeMesta.forEach(place => {
          let indexMesta = vybrannyeMesta.findIndex(currentPlace => currentPlace === place);

          if(place.classList.contains("chair_selected")) {
            if(place.dataset.type === "standart") {
              stoimost = cenaStandart;
            } else if(place.dataset.type === "vip") {
              stoimost = cenaVip;
            }

            bilety.push({
              row: indexStroki + 1,
              place: indexMesta + 1,
              coast: stoimost,
            })
          }

        })
      })

      localStorage.setItem("tickets", JSON.stringify(bilety));

      document.location="./payment.html";
    }

  })

}


// Получение общих данные с сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    ustanovitInformaciyu(data);

    // Получение данных о схеме зала

    fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${idSeansa}&date=${proverennayaData}`)
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      pokazatSkhemuZala(data);
      vybratMesta(strokiSkhemaZala);
      klikKnopkiBronirovaniya();
    })

  })
