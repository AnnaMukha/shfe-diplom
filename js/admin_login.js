const authForm = document.querySelector(".login__form");
const emailInput = document.querySelector(".login__email");
const passwordInput = document.querySelector(".login__password");

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (emailInput.value.trim() && passwordInput.value.trim()) {
    const userData = new FormData(authForm);

    fetch("https://shfe-diplom.neto-server.ru/login", {
      method: "POST",
      body: userData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = "./admin-index.html";
      } else {
        alert("Invalid login/password!");
      }
    });
  }
});
