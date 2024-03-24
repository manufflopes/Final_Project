document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.getElementById("user-contact-us-form");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));
    console.log(formData);

    alert("Your message has been sent successfully");

    loginForm.reset();
  });
});
