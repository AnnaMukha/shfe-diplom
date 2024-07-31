// Управление залами

const zalyInfo = document.querySelector(".halls__info");
const zalySpisok = document.querySelector(".halls__list");
const zalyKnopka = document.querySelector(".admin__button_hall");
let zalyUdalitKnopka;

// Конфигурация залов

const zalyKonfiguraciya = document.querySelector(".hall-config");
const zalyKonfiguraciyaSpisok = document.querySelector(".hall-config__list");
let zalyKonfiguraciyaElementy;
const zalyKonfiguraciyaObertka = document.querySelector(".hall-config__wrapper");
let zalyKonfiguraciyaMassiv = [];

// Схема зала

let tekushayaZalKonfiguraciya;
let tekushayaZalKonfiguraciyaIndex;
let novayaZalKonfiguraciyaMassiv;

let formaZalKonfiguraciya;
let strokiZalKonfiguraciya;
let mestaZalKonfiguraciya;
let skhemaZal;
let strokiSkhemaZal;
let mestaSkhemaZal;
let kreslaZal;
let otmenaZalKonfiguraciya;
let sohranitZalKonfiguraciya;

// Конфигурация цен

const cenaKonfiguraciya = document.querySelector(".price-config");
const cenaKonfiguraciyaSpisok = document.querySelector(".price-config__list");
let cenaKonfiguraciyaElementy;
const cenaKonfiguraciyaObertka = document.querySelector(".price-config__wrapper");
let formaCenaKonfiguraciya;
let cenaStandartKonfiguraciya;
let cenaVipKonfiguraciya;
let otmenaCenaKonfiguraciya;
let sohranitCenaKonfiguraciya;

let tekushayaCenaKonfiguraciya;

// Открыть продажи

const otkritProdazhu = document.querySelector(".open");
const spisokOtkritProdazhu = document.querySelector(".open__list");
const obertkaOtkritProdazhu = document.querySelector(".open__wrapper");
let infoOtkritProdazhu;
let knopkaOtkritProdazhu;
let tekushayaOtkritProdazhu;

let tekushiyStatusZal;
let noviyStatusZal;

// Залы в Сетке сеансов

const seansyFilmovVremya = document.querySelector(".movie-seances__timelines");
let udaleniyaVremya;

// Проверка наличия залов в блоке "Доступные залы"

function proverkaSpisokZalov() {
  if (zalySpisok.innerText) {
    zalyInfo.classList.remove("hidden");
    zalySpisok.classList.remove("hidden");
    zalyKonfiguraciya.classList.remove("hidden");
    seansyFilmovVremya.classList.remove("hidden");
    otkritProdazhu.classList.remove("hidden");
  } else {
    zalyInfo.classList.add("hidden");
    zalySpisok.classList.add("hidden");
    zalyKonfiguraciya.classList.add("hidden");
    seansyFilmovVremya.classList.add("hidden");
    otkritProdazhu.classList.add("hidden");
  }
}

// Открытие popup "Добавить зал"

zalyKnopka.addEventListener("click", () => {
  popupDobavitZal.classList.remove("popup__hidden");
})

// popup Добавление зала

const popupDobavitZal = document.querySelector(".popup__hall_add");
const formaDobavitZal = document.querySelector(".popup__form_add-hall");
const vvodDobavitZal = document.querySelector(".add-hall_input");
const knopkaDobavitZal = document.querySelector(".popup__add-hall_button_add");

// Добавить зал

formaDobavitZal.addEventListener("submit", (e) => {
  e.preventDefault();
  dobavitZal(vvodDobavitZal);
})

function dobavitZal(vvodDobavitZal) {
  const dannyeFormy = new FormData();
  dannyeFormy.set("hallName", `${vvodDobavitZal.value}`);

  if(vvodDobavitZal.value.trim()) {
    fetch("https://shfe-diplom.neto-server.ru/hall", {
      method: "POST",
      body: dannyeFormy
    })
      .then(response => response.json())
      .then(function(data) {
        console.log(data);  
        zalySpisok.insertAdjacentHTML("beforeend", `
        <li class="halls__list_item">
          <span class="halls__list_name" data-id="${data.result.halls.id}>${vvodDobavitZal.value}</span> <span class="admin__button_remove hall_remove"></span></p>
        </li>
        `);

        vvodDobavitZal.value = "";
        location.reload(); 
      })
  } 
}

// Удаление зала в блоке "Доступные залы"

function udalitZal(hallId) {
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    location.reload();
  })
}

// Отрисовка зала

function pokazatZal(data, tekushayaZalKonfiguraciyaIndex) {
  strokiZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_rows;
  mestaZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_places;
  
  skhemaZal.innerHTML = "";
  zalyKonfiguraciyaMassiv.splice(0, zalyKonfiguraciyaMassiv.length);

  data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config.forEach(element => {
    skhemaZal.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  strokiSkhemaZal = document.querySelectorAll(".hall-config__hall_row");

  for(let i = 0; i < strokiSkhemaZal.length; i++) {
    for(let j = 0; j < data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config[0].length; j++) {
      strokiSkhemaZal[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config[i][j]}"></span>`);
    }
  }

  kreslaZal = document.querySelectorAll(".hall-config__hall_chair");

  kreslaZal.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("place_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("place_standart");
    } else {
      element.classList.add("place_block");
    }
  })

  zalyKonfiguraciyaMassiv = JSON.parse(JSON.stringify(data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config));
}

// Изменение типа мест на схеме зала

function izmenitMesta(strokiSkhemaZal, data) {
  novayaZalKonfiguraciyaMassiv = JSON.parse(JSON.stringify(zalyKonfiguraciyaMassiv));

  let izmenitStroki = Array.from(strokiSkhemaZal);
  izmenitStroki.forEach(row => {
    let rowIndex = izmenitStroki.findIndex(currentRow => currentRow === row);
    let izmenitMesta = Array.from(row.children);
    izmenitMesta.forEach(place => {
      place.style.cursor = "pointer";
      let placeIndex = izmenitMesta.findIndex(currentPlace => currentPlace === place);
      
      place.addEventListener("click", () => {
        if(place.classList.contains("place_standart")) {
          place.classList.replace("place_standart", "place_vip");
          place.dataset.type = "vip";
          novayaZalKonfiguraciyaMassiv[rowIndex][placeIndex] = "vip";
        } else if (place.classList.contains("place_vip")) {
          place.classList.replace("place_vip", "place_block");
          place.dataset.type = "disabled";
          novayaZalKonfiguraciyaMassiv[rowIndex][placeIndex] = "disabled";
        } else {
          place.classList.replace("place_block", "place_standart");
          place.dataset.type = "standart";
          novayaZalKonfiguraciyaMassiv[rowIndex][placeIndex] = "standart";
        }

        if(JSON.stringify(novayaZalKonfiguraciyaMassiv) !== JSON.stringify(data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config)) {
          otmenaZalKonfiguraciya.classList.remove("button_disabled");
          sohranitZalKonfiguraciya.classList.remove("button_disabled");
        } else {
          otmenaZalKonfiguraciya.classList.add("button_disabled");
          sohranitZalKonfiguraciya.classList.add("button_disabled");
        }
      })
    })
  })
}

// Изменение размера зала

function izmenitRazmerZala(novayaZalKonfiguraciyaMassiv, data) {
  formaZalKonfiguraciya.addEventListener("input", () => {
    novayaZalKonfiguraciyaMassiv.splice(0, novayaZalKonfiguraciyaMassiv.length);

    skhemaZal.innerHTML = "";

    for(let i = 0; i < strokiZalKonfiguraciya.value; i++) {
      skhemaZal.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
      novayaZalKonfiguraciyaMassiv.push(new Array());
    }

    strokiSkhemaZal = Array.from(document.querySelectorAll(".hall-config__hall_row"));
      
    for(let i = 0; i < strokiZalKonfiguraciya.value; i++) {
      for(let j = 0; j < mestaZalKonfiguraciya.value; j++) {
        strokiSkhemaZal[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair place_standart" data-type="standart"></span>`);
        novayaZalKonfiguraciyaMassiv[i].push("standart");
      }
    }

    if(JSON.stringify(novayaZalKonfiguraciyaMassiv) !== JSON.stringify(data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_config)) {
      otmenaZalKonfiguraciya.classList.remove("button_disabled");
      sohranitZalKonfiguraciya.classList.remove("button_disabled");
    } else {
      otmenaZalKonfiguraciya.classList.add("button_disabled");
      sohranitZalKonfiguraciya.classList.add("button_disabled");
    }

    izmenitMesta(strokiSkhemaZal, data);
  })
}

// Сохранение конфигурации зала

function sohranitKonfiguraciyu(tekushayaZalKonfiguraciya, novayaZalKonfiguraciyaMassiv) {
  const params = new FormData();

  params.set("rowCount", `${strokiZalKonfiguraciya.value}`);
  params.set("placeCount", `${mestaZalKonfiguraciya.value}`);
  params.set("config", JSON.stringify(novayaZalKonfiguraciyaMassiv)); 

  fetch(`https://shfe-diplom.neto-server.ru/hall/${tekushayaZalKonfiguraciya}`, {
    method: "POST",
    body: params 
    })
      .then(response => response.json())
      .then(function(data) { 
        console.log(data);
        alert("Конфигурация зала сохранена!");
        location.reload();
      })
}

// Отображение цен

function pokazatCeny(data, tekushayaCenaKonfiguraciya) {
  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(tekushayaCenaKonfiguraciya)) {
      cenaStandartKonfiguraciya.value = data.result.halls[i].hall_price_standart;
      cenaVipKonfiguraciya.value = data.result.halls[i].hall_price_vip;
      
      formaCenaKonfiguraciya.addEventListener("input", () => {
        if(cenaStandartKonfiguraciya.value === data.result.halls[i].hall_price_standart && cenaVipKonfiguraciya.value ===data.result.halls[i].hall_price_vip) {
          otmenaCenaKonfiguraciya.classList.add("button_disabled");
          sohranitCenaKonfiguraciya.classList.add("button_disabled");
        } else {
          otmenaCenaKonfiguraciya.classList.remove("button_disabled");
          sohranitCenaKonfiguraciya.classList.remove("button_disabled");
        }
      })
    }
  }
}

// Сохранение конфигурации цен

function sohranitCeny(tekushayaCenaKonfiguraciya) {
  const params = new FormData();
  params.set("priceStandart", `${cenaStandartKonfiguraciya.value}`);
  params.set("priceVip", `${cenaVipKonfiguraciya.value}`);

  fetch(`https://shfe-diplom.neto-server.ru/price/${tekushayaCenaKonfiguraciya}`, {
    method: "POST",
    body: params 
  })
    .then(response => response.json())
    .then(function(data) { 
      console.log(data);
      alert("Конфигурация цен сохранена!");
      location.reload();
    })
}

// Проверка, открыт ли зал

function proveritZalOtkrit(data, tekushayaOtkritProdazhu) {
  infoOtkritProdazhu = document.querySelector(".open__info");
  knopkaOtkritProdazhu = document.querySelector(".admin__button_open");
  let estSeansy = 0;

  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(tekushayaOtkritProdazhu)) {
      tekushiyStatusZal = data.result.halls[i].hall_open;
    }
  }

  // Проверка, установлены ли сеансы для зала

  for (let i = 0; i < data.result.seances.length; i++) {
    if(data.result.seances[i].seance_hallid === Number(tekushayaOtkritProdazhu)) {
      estSeansy++;
    }
  }

  if((tekushiyStatusZal === 0) && (estSeansy === 0)) {
    knopkaOtkritProdazhu.textContent = "Открыть продажу билетов";
    infoOtkritProdazhu.textContent = "Добавьте сеансы в зал для открытия";
    knopkaOtkritProdazhu.classList.add("button_disabled");
  } else if ((tekushiyStatusZal === 0) && (estSeansy > 0)) {
    knopkaOtkritProdazhu.textContent = "Открыть продажу билетов";
    noviyStatusZal = 1;
    infoOtkritProdazhu.textContent = "Всё готово к открытию";
    knopkaOtkritProdazhu.classList.remove("button_disabled");
  } else {
    knopkaOtkritProdazhu.textContent = "Приостановить продажу билетов";
    noviyStatusZal = 0;
    infoOtkritProdazhu.textContent = "Зал открыт";
    knopkaOtkritProdazhu.classList.remove("button_disabled");
  }
}

// Изменить статус зала

function otkritZakrityZal(tekushayaOtkritProdazhu, noviyStatusZal) {
  const params = new FormData();
  params.set("hallOpen", `${noviyStatusZal}`)
  fetch( `https://shfe-diplom.neto-server.ru/open/${tekushayaOtkritProdazhu}`, {
    method: "POST",
    body: params 
  })
  
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
    alert("Статус зала изменен!");
  })
}

// Получение информации по залам

function operaciiZalov(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    // Заполнение блока "Доступные залы"

    zalySpisok.insertAdjacentHTML("beforeend", `
      <li class="halls__list_item">
        <span class="halls__list_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span></p>
      </li>
    `);

    // Проверка наличия залов в списке

    proverkaSpisokZalov();

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация залов"

    zalyKonfiguraciyaSpisok.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация цен"

    cenaKonfiguraciyaSpisok.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение блока "Выберите зал для открытия/закрытия продаж"

    spisokOtkritProdazhu.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Создание таймлайнов залов в блоке "Сетка сеансов"

    seansyFilmovVremya.insertAdjacentHTML("beforeend", `
    <section class="movie-seances__timeline">
      <div class="timeline__delete">
         <img class="timeline__delete_image" src="./images/delete.png" alt="Удалить сеанс">
      </div>
      <h3 class="timeline__hall_title">${data.result.halls[i].hall_name}</h3>
      <div class="timeline__seances" data-id="${data.result.halls[i].id}">
      </div>
    </section>
    `);

    // Спрятать корзины

    udaleniyaVremya = document.querySelectorAll(".timeline__delete");

    udaleniyaVremya.forEach(element => {
      element.classList.add("hidden");
    })

  }

  // Схема первого зала в списке 

  zalyKonfiguraciyaSpisok.firstElementChild.classList.add("hall_item-selected");
  tekushayaZalKonfiguraciya = zalyKonfiguraciyaSpisok.firstElementChild.getAttribute("data-id");

  formaZalKonfiguraciya = document.querySelector(".hall-config__size");
  strokiZalKonfiguraciya = document.querySelector(".hall-config__rows");
  mestaZalKonfiguraciya = document.querySelector(".hall-config__places");

  skhemaZal = document.querySelector(".hall-config__hall_wrapper");

  tekushayaZalKonfiguraciyaIndex = data.result.halls.findIndex(hall => hall.id === Number(tekushayaZalKonfiguraciya));

  strokiZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_rows;
  mestaZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_places;

  otmenaZalKonfiguraciya = document.querySelector(".hall-config__batton_cancel");
  sohranitZalKonfiguraciya = document.querySelector(".hall-config__batton_save");

  pokazatZal(data, tekushayaZalKonfiguraciyaIndex);
  izmenitMesta(strokiSkhemaZal, data);
  izmenitRazmerZala(novayaZalKonfiguraciyaMassiv, data);

  // Клик по кнопке "Отмена" в блоке Конфигурация залов

  otmenaZalKonfiguraciya.addEventListener("click", event => {
    if(otmenaZalKonfiguraciya.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      otmenaZalKonfiguraciya.classList.add("button_disabled");
      sohranitZalKonfiguraciya.classList.add("button_disabled");

      pokazatZal(data, tekushayaZalKonfiguraciyaIndex);
      izmenitMesta(strokiSkhemaZal, data);
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация залов

  sohranitZalKonfiguraciya.addEventListener("click", event => {
    if(sohranitZalKonfiguraciya.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      sohranitKonfiguraciyu(tekushayaZalKonfiguraciya, novayaZalKonfiguraciyaMassiv);
    }
  })

  // Загрузка цен для первого зала в списке 

  cenaKonfiguraciyaSpisok.firstElementChild.classList.add("hall_item-selected");
  tekushayaCenaKonfiguraciya = cenaKonfiguraciyaSpisok.firstElementChild.getAttribute("data-id");

  formaCenaKonfiguraciya = document.querySelector(".price-config__form");

  cenaStandartKonfiguraciya = document.querySelector(".price-config__input_standart");
  cenaVipKonfiguraciya = document.querySelector(".price-config__input_vip");
  
  pokazatCeny(data, tekushayaCenaKonfiguraciya);

  // Клик по кнопке "Отмена" в блоке Конфигурация цен

  otmenaCenaKonfiguraciya = document.querySelector(".price-config__batton_cancel");
  sohranitCenaKonfiguraciya = document.querySelector(".price-config__batton_save");

  otmenaCenaKonfiguraciya.addEventListener("click", event => {
    if(otmenaCenaKonfiguraciya.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      otmenaCenaKonfiguraciya.classList.add("button_disabled");
      sohranitCenaKonfiguraciya.classList.add("button_disabled");

      pokazatCeny(data, tekushayaCenaKonfiguraciya)
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация цен

  sohranitCenaKonfiguraciya.addEventListener("click", event => {
    if(sohranitCenaKonfiguraciya.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      sohranitCeny(tekushayaCenaKonfiguraciya);
    }
  })

  // Проверка, открыт ли первый зал в списке 

  spisokOtkritProdazhu.firstElementChild.classList.add("hall_item-selected");
  tekushayaOtkritProdazhu = spisokOtkritProdazhu.firstElementChild.getAttribute("data-id");

  proveritZalOtkrit(data, tekushayaOtkritProdazhu);

  // Выбор зала в блоке "Конфигурация залов"

  zalyKonfiguraciyaElementy = document.querySelectorAll(".hall-config__item");

  zalyKonfiguraciyaElementy.forEach(item => {
    item.addEventListener("click", () => {
      zalyKonfiguraciyaElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        tekushayaZalKonfiguraciya = item.getAttribute("data-id");
      }

      otmenaZalKonfiguraciya.classList.add("button_disabled");
      sohranitZalKonfiguraciya.classList.add("button_disabled");

      tekushayaZalKonfiguraciyaIndex = data.result.halls.findIndex(hall => hall.id === Number(tekushayaZalKonfiguraciya));

      strokiZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_rows;
      mestaZalKonfiguraciya.value = data.result.halls[tekushayaZalKonfiguraciyaIndex].hall_places;

      // Отрисовка зала

      pokazatZal(data, tekushayaZalKonfiguraciyaIndex);
      izmenitMesta(strokiSkhemaZal, data);

      // Изменение размера зала

      izmenitRazmerZala(novayaZalKonfiguraciyaMassiv, data);

    })

  })

  // Выбор зала в блоке "Конфигурация цен"

  cenaKonfiguraciyaElementy = document.querySelectorAll(".price-config__item");

  cenaKonfiguraciyaElementy.forEach(item => {
    item.addEventListener("click", () => {
      cenaKonfiguraciyaElementy.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        tekushayaCenaKonfiguraciya = item.getAttribute("data-id");
      }

      otmenaCenaKonfiguraciya.classList.add("button_disabled");
      sohranitCenaKonfiguraciya.classList.add("button_disabled");

      // Отображение цены

      pokazatCeny(data, tekushayaCenaKonfiguraciya);
    })

  })

  // Выбор зала в блоке "Открыть продажи"

  elementyOtkritProdazhu = document.querySelectorAll(".open__item");

  elementyOtkritProdazhu.forEach(item => {
    item.addEventListener("click", () => {
      elementyOtkritProdazhu.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        tekushayaOtkritProdazhu = item.getAttribute("data-id");
      }

      proveritZalOtkrit(data, tekushayaOtkritProdazhu);
    })
  }) 

  // Клик по кнопке в блоке "Открыть продажи"

  knopkaOtkritProdazhu.addEventListener("click", event => {
    if(knopkaOtkritProdazhu.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      otkritZakrityZal(tekushayaOtkritProdazhu, noviyStatusZal);

      for(let i = 0; i < data.result.halls.length; i++) {
        if(data.result.halls[i].id === Number(tekushayaOtkritProdazhu)) {
          tekushiyStatusZal = data.result.halls[i].hall_open;
        }
      }
    
      if (noviyStatusZal === 0) {
        knopkaOtkritProdazhu.textContent = "Открыть продажу билетов";
        infoOtkritProdazhu.textContent = "Всё готово к открытию";
        noviyStatusZal = 1;
      } else {
        knopkaOtkritProdazhu.textContent = "Приостановить продажу билетов";
        infoOtkritProdazhu.textContent = "Зал открыт";
        noviyStatusZal = 0;
      }
    }
  })

  // Удалить зал

  zalyUdalitKnopka = document.querySelectorAll(".hall_remove");

  zalyUdalitKnopka.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      udalitZal(hallId);
    })  
  })

}
