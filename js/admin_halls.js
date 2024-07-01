// Управление залами

const infoHalls = document.querySelector(".halls__info");
const listHalls = document.querySelector(".halls__list");
const buttonHall = document.querySelector(".admin__button_hall");
let buttonRemoveHall;

// Конфигурация залов

const configHalls = document.querySelector(".hall-config");
const listConfigHalls = document.querySelector(".hall-config__list");
let itemsConfigHalls;
const wrapperConfigHalls = document.querySelector(".hall-config__wrapper");
let arrayConfigHalls = [];

// Схема зала

let currentConfigHall;
let currentIndexConfigHall;
let newArrayConfigHall;

let formConfigHall;
let rowsConfigHall;
let placesConfigHall;
let schemeHall;
let rowsSchemeHall;
let placesSchemeHall;
let chairsHall;
let cancelConfigHall;
let saveConfigHall;

// Конфигурация цен

const configPrices = document.querySelector(".price-config");
const listConfigPrices = document.querySelector(".price-config__list");
let itemsConfigPrices;
const wrapperConfigPrices = document.querySelector(".price-config__wrapper");
let formConfigPrices;
let standardConfigPrice;
let vipConfigPrice;
let cancelConfigPrice;
let saveConfigPrice;

let currentConfigPrice;

// Открыть продажи

const sellsOpen = document.querySelector(".open");
const listOpen = document.querySelector(".open__list");
const wrapperOpen = document.querySelector(".open__wrapper");
let infoOpen;
let buttonOpen;
let currentOpen;

let statusCurrentHall;
let statusNewHall;

// Залы в Сетке сеансов

const timelinesMovieSeances = document.querySelector(".movie-seances__timelines");
let deleteTimeline;

// Проверка наличия залов в блоке "Доступные залы"

function verifyHallsList() {
  if (listHalls.innerText) {
    infoHalls.classList.remove("hidden");
    listHalls.classList.remove("hidden");
    configHalls.classList.remove("hidden");
    timelinesMovieSeances.classList.remove("hidden");
    sellsOpen.classList.remove("hidden");
  } else {
    infoHalls.classList.add("hidden");
    listHalls.classList.add("hidden");
    configHalls.classList.add("hidden");
    timelinesMovieSeances.classList.add("hidden");
    sellsOpen.classList.add("hidden");
  }
}

// Открытие popup "Добавить зал"

buttonHall.addEventListener("click", () => {
  addHallPopup.classList.remove("popup__hidden");
})

// popup Добавление зала

const addHallPopup = document.querySelector(".popup__hall_add");
const formAddHall = document.querySelector(".popup__form_add-hall");
const inputAddHall = document.querySelector(".add-hall_input");
const buttonAddHall = document.querySelector(".popup__add-hall_button_add");

// Добавить зал

formAddHall.addEventListener("submit", (e) => {
  e.preventDefault();
  addHallToList(inputAddHall);
})

function addHallToList(inputAddHall) {
  const formData = new FormData();
  formData.set("hallName", `${inputAddHall.value}`);

  if(inputAddHall.value.trim()) {
    fetch("https://shfe-diplom.neto-server.ru/hall", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(function(data) {
        console.log(data);  
        listHalls.insertAdjacentHTML("beforeend", `
        <li class="halls__list_item">
          <span class="halls__list_name" data-id="${data.result.halls.id}">${inputAddHall.value}</span> <span class="admin__button_remove hall_remove"></span>
        </li>
        `);

        inputAddHall.value = "";
        location.reload(); 
      })
  } 
}

// Удаление зала в блоке "Доступные залы"

function removeHall(hallId) {
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

function renderHall(data, currentIndexConfigHall) {
  rowsConfigHall.value = data.result.halls[currentIndexConfigHall].hall_rows;
  placesConfigHall.value = data.result.halls[currentIndexConfigHall].hall_places;
  
  schemeHall.innerHTML = "";
  arrayConfigHalls.splice(0, arrayConfigHalls.length);

  data.result.halls[currentIndexConfigHall].hall_config.forEach(element => {
    schemeHall.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  rowsSchemeHall = document.querySelectorAll(".hall-config__hall_row");

  for(let i = 0; i < rowsSchemeHall.length; i++) {
    for(let j = 0; j < data.result.halls[currentIndexConfigHall].hall_config[0].length; j++) {
      rowsSchemeHall[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${data.result.halls[currentIndexConfigHall].hall_config[i][j]}"></span>`);
    }
  }

  chairsHall = document.querySelectorAll(".hall-config__hall_chair");

  chairsHall.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("place_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("place_standart");
    } else {
      element.classList.add("place_block");
    }
  })

  arrayConfigHalls = JSON.parse(JSON.stringify(data.result.halls[currentIndexConfigHall].hall_config));
}

// Изменение типа мест на схеме зала

function modifyPlaces(rowsSchemeHall, data) {
  newArrayConfigHall = JSON.parse(JSON.stringify(arrayConfigHalls));

  let changeRowsHall = Array.from(rowsSchemeHall);
  changeRowsHall.forEach(row => {
    let rowIndex = changeRowsHall.findIndex(currentRow => currentRow === row);
    let changePlacesHall = Array.from(row.children);
    changePlacesHall.forEach(place => {
      place.style.cursor = "pointer";
      let placeIndex = changePlacesHall.findIndex(currentPlace => currentPlace === place);
      
      place.addEventListener("click", () => {
        if(place.classList.contains("place_standart")) {
          place.classList.replace("place_standart", "place_vip");
          place.dataset.type = "vip";
          newArrayConfigHall[rowIndex][placeIndex] = "vip";
        } else if (place.classList.contains("place_vip")) {
          place.classList.replace("place_vip", "place_block");
          place.dataset.type = "disabled";
          newArrayConfigHall[rowIndex][placeIndex] = "disabled";
        } else {
          place.classList.replace("place_block", "place_standart");
          place.dataset.type = "standart";
          newArrayConfigHall[rowIndex][placeIndex] = "standart";
        }

        if(JSON.stringify(newArrayConfigHall) !== JSON.stringify(data.result.halls[currentIndexConfigHall].hall_config)) {
          cancelConfigHall.classList.remove("button_disabled");
          saveConfigHall.classList.remove("button_disabled");
        } else {
          cancelConfigHall.classList.add("button_disabled");
          saveConfigHall.classList.add("button_disabled");
        }
      })
    })
  })
}

// Изменение размера зала

function resizeHall(newArrayConfigHall, data) {
  formConfigHall.addEventListener("input", () => {
    newArrayConfigHall.splice(0, newArrayConfigHall.length);

    schemeHall.innerHTML = "";

    for(let i = 0; i < rowsConfigHall.value; i++) {
      schemeHall.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
      newArrayConfigHall.push(new Array());
    }

    rowsSchemeHall = Array.from(document.querySelectorAll(".hall-config__hall_row"));
      
    for(let i = 0; i < rowsConfigHall.value; i++) {
      for(let j = 0; j < placesConfigHall.value; j++) {
        rowsSchemeHall[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair place_standart" data-type="standart"></span>`);
        newArrayConfigHall[i].push("standart");
      }
    }

    if(JSON.stringify(newArrayConfigHall) !== JSON.stringify(data.result.halls[currentIndexConfigHall].hall_config)) {
      cancelConfigHall.classList.remove("button_disabled");
      saveConfigHall.classList.remove("button_disabled");
    } else {
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");
    }

    modifyPlaces(rowsSchemeHall, data);
  })
}

// Сохранение конфигурации зала

function saveHallConfig(currentConfigHall, newArrayConfigHall) {
  const params = new FormData();

  params.set("rowCount", `${rowsConfigHall.value}`);
  params.set("placeCount", `${placesConfigHall.value}`);
  params.set("config", JSON.stringify(newArrayConfigHall)); 

  fetch(`https://shfe-diplom.neto-server.ru/hall/${currentConfigHall}`, {
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

function renderPrices(data, currentConfigPrice) {
  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentConfigPrice)) {
      standardConfigPrice.value = data.result.halls[i].hall_price_standart;
      vipConfigPrice.value = data.result.halls[i].hall_price_vip;
      
      formConfigPrices.addEventListener("input", () => {
        if(standardConfigPrice.value === data.result.halls[i].hall_price_standart && vipConfigPrice.value ===data.result.halls[i].hall_price_vip) {
          cancelConfigPrice.classList.add("button_disabled");
          saveConfigPrice.classList.add("button_disabled");
        } else {
          cancelConfigPrice.classList.remove("button_disabled");
          saveConfigPrice.classList.remove("button_disabled");
        }
      })
    }
  }
}

// Сохранение конфигурации цен

function saveHallPrices(currentConfigPrice) {
  const params = new FormData();
  params.set("priceStandart", `${standardConfigPrice.value}`);
  params.set("priceVip", `${vipConfigPrice.value}`);

  fetch(`https://shfe-diplom.neto-server.ru/price/${currentConfigPrice}`, {
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

function verifyHallOpen(data, currentOpen) {
  infoOpen = document.querySelector(".open__info");
  buttonOpen = document.querySelector(".admin__button_open");
  let seancesCount = 0;

  for(let i = 0; i < data.result.halls.length; i++) {
    if(data.result.halls[i].id === Number(currentOpen)) {
      statusCurrentHall = data.result.halls[i].hall_open;
    }
  }

  // Проверка, установлены ли сеансы для зала

  for (let i = 0; i < data.result.seances.length; i++) {
    if(data.result.seances[i].seance_hallid === Number(currentOpen)) {
      seancesCount++;
    }
  }

  if((statusCurrentHall === 0) && (seancesCount === 0)) {
    buttonOpen.textContent = "Открыть продажу билетов";
    infoOpen.textContent = "Добавьте сеансы в зал для открытия";
    buttonOpen.classList.add("button_disabled");
  } else if ((statusCurrentHall === 0) && (seancesCount > 0)) {
    buttonOpen.textContent = "Открыть продажу билетов";
    statusNewHall = 1;
    infoOpen.textContent = "Всё готово к открытию";
    buttonOpen.classList.remove("button_disabled");
  } else {
    buttonOpen.textContent = "Приостановить продажу билетов";
    statusNewHall = 0;
    infoOpen.textContent = "Зал открыт";
    buttonOpen.classList.remove("button_disabled");
  }
}

// Изменить статус зала

function toggleHallOpen(currentOpen, statusNewHall) {
  const params = new FormData();
  params.set("hallOpen", `${statusNewHall}`)
  fetch(`https://shfe-diplom.neto-server.ru/open/${currentOpen}`, {
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

function hallOperations(data) {

  for(let i = 0; i < data.result.halls.length; i++) {

    // Заполнение блока "Доступные залы"

    listHalls.insertAdjacentHTML("beforeend", `
      <li class="halls__list_item">
        <span class="halls__list_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span>
      </li>
    `);

    // Проверка наличия залов в списке

    verifyHallsList();

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация залов"

    listConfigHalls.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение "Выберите зал для конфигурации" в блоке "Конфигурация цен"

    listConfigPrices.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Заполнение блока "Выберите зал для открытия/закрытия продаж"

    listOpen.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // Создание таймлайнов залов в блоке "Сетка сеансов"

    timelinesMovieSeances.insertAdjacentHTML("beforeend", `
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

    deleteTimeline = document.querySelectorAll(".timeline__delete");

    deleteTimeline.forEach(element => {
      element.classList.add("hidden");
    })

  }

  // Схема первого зала в списке 

  listConfigHalls.firstElementChild.classList.add("hall_item-selected");
  currentConfigHall = listConfigHalls.firstElementChild.getAttribute("data-id");

  formConfigHall = document.querySelector(".hall-config__size");
  rowsConfigHall = document.querySelector(".hall-config__rows");
  placesConfigHall = document.querySelector(".hall-config__places");

  schemeHall = document.querySelector(".hall-config__hall_wrapper");

  currentIndexConfigHall = data.result.halls.findIndex(hall => hall.id === Number(currentConfigHall));

  rowsConfigHall.value = data.result.halls[currentIndexConfigHall].hall_rows;
  placesConfigHall.value = data.result.halls[currentIndexConfigHall].hall_places;

  cancelConfigHall = document.querySelector(".hall-config__batton_cancel");
  saveConfigHall = document.querySelector(".hall-config__batton_save");

  renderHall(data, currentIndexConfigHall);
  modifyPlaces(rowsSchemeHall, data);
  resizeHall(newArrayConfigHall, data);

  // Клик по кнопке "Отмена" в блоке Конфигурация залов

  cancelConfigHall.addEventListener("click", event => {
    if(cancelConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");

      renderHall(data, currentIndexConfigHall);
      modifyPlaces(rowsSchemeHall, data);
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация залов

  saveConfigHall.addEventListener("click", event => {
    if(saveConfigHall.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      saveHallConfig(currentConfigHall, newArrayConfigHall);
    }
  })

  // Загрузка цен для первого зала в списке 

  listConfigPrices.firstElementChild.classList.add("hall_item-selected");
  currentConfigPrice = listConfigPrices.firstElementChild.getAttribute("data-id");

  formConfigPrices = document.querySelector(".price-config__form");

  standardConfigPrice = document.querySelector(".price-config__input_standart");
  vipConfigPrice = document.querySelector(".price-config__input_vip");
  
  renderPrices(data, currentConfigPrice);

  // Клик по кнопке "Отмена" в блоке Конфигурация цен

  cancelConfigPrice = document.querySelector(".price-config__batton_cancel");
  saveConfigPrice = document.querySelector(".price-config__batton_save");

  cancelConfigPrice.addEventListener("click", event => {
    if(cancelConfigPrice.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      cancelConfigPrice.classList.add("button_disabled");
      saveConfigPrice.classList.add("button_disabled");

      renderPrices(data, currentConfigPrice)
    }
  })

  // Клик по кнопке "Сохранить" в блоке Конфигурация цен

  saveConfigPrice.addEventListener("click", event => {
    if(saveConfigPrice.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      saveHallPrices(currentConfigPrice);
    }
  })

  // Проверка, открыт ли первый зал в списке 

  listOpen.firstElementChild.classList.add("hall_item-selected");
  currentOpen = listOpen.firstElementChild.getAttribute("data-id");

  verifyHallOpen(data, currentOpen);

  // Выбор зала в блоке "Конфигурация залов"

  itemsConfigHalls = document.querySelectorAll(".hall-config__item");

  itemsConfigHalls.forEach(item => {
    item.addEventListener("click", () => {
      itemsConfigHalls.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentConfigHall = item.getAttribute("data-id");
      }

      cancelConfigHall.classList.add("button_disabled");
      saveConfigHall.classList.add("button_disabled");

      currentIndexConfigHall = data.result.halls.findIndex(hall => hall.id === Number(currentConfigHall));

      rowsConfigHall.value = data.result.halls[currentIndexConfigHall].hall_rows;
      placesConfigHall.value = data.result.halls[currentIndexConfigHall].hall_places;

      // Отрисовка зала

      renderHall(data, currentIndexConfigHall);
      modifyPlaces(rowsSchemeHall, data);

      // Изменение размера зала

      resizeHall(newArrayConfigHall, data);

    })

  })

  // Выбор зала в блоке "Конфигурация цен"

  itemsConfigPrices = document.querySelectorAll(".price-config__item");

  itemsConfigPrices.forEach(item => {
    item.addEventListener("click", () => {
      itemsConfigPrices.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentConfigPrice = item.getAttribute("data-id");
      }

      cancelConfigPrice.classList.add("button_disabled");
      saveConfigPrice.classList.add("button_disabled");

      // Отображение цены

      renderPrices(data, currentConfigPrice);
    })

  })

  // Выбор зала в блоке "Открыть продажи"

  openItems = document.querySelectorAll(".open__item");

  openItems.forEach(item => {
    item.addEventListener("click", () => {
      openItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
  
      item.classList.add("hall_item-selected");

      if(item.classList.contains("hall_item-selected")) {
        currentOpen = item.getAttribute("data-id");
      }

      verifyHallOpen(data, currentOpen);
    })
  }) 

  // Клик по кнопке в блоке "Открыть продажи"

  buttonOpen.addEventListener("click", event => {
    if(buttonOpen.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      toggleHallOpen(currentOpen, statusNewHall);

      for(let i = 0; i < data.result.halls.length; i++) {
        if(data.result.halls[i].id === Number(currentOpen)) {
          statusCurrentHall = data.result.halls[i].hall_open;
        }
      }
    
      if (statusNewHall === 0) {
        buttonOpen.textContent = "Открыть продажу билетов";
        infoOpen.textContent = "Всё готово к открытию";
        statusNewHall = 1;
      } else {
        buttonOpen.textContent = "Приостановить продажу билетов";
        infoOpen.textContent = "Зал открыт";
        statusNewHall = 0;
      }
    }
  })

  // Удалить зал

  buttonRemoveHall = document.querySelectorAll(".hall_remove");

  buttonRemoveHall.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      removeHall(hallId);
    })  
  })

}
