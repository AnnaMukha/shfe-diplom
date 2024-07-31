const formaVhoda = document.querySelector(".login__form");
const emailVhoda = document.querySelector(".login__email");
const parolVhoda = document.querySelector(".login__password");

formaVhoda.addEventListener("submit", (e) => {
  e.preventDefault();

  if(emailVhoda.value.trim() && parolVhoda.value.trim()) {
    const dannyeFormy = new FormData(formaVhoda);

    fetch("https://shfe-diplom.neto-server.ru/login", {
      method: "POST",
      body: dannyeFormy
    })
    .then(response => response.json())
    .then(function(data) {
      if(data.success === true) {
        document.location="./admin-index.html";
      } else {
        alert("Неверный логин/пароль!");
      }
    })
  }
})
