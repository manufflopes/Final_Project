import { createUser, loginUser } from "../../scripts/api.js";

document.addEventListener("DOMContentLoaded", function () {
  const userRegistrationForm = document.getElementById(
    "user-registration-form"
  );

  userRegistrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    try {
      //Try to create a new user
      await createUser(formData);
      //If the user is created, try to login
      await loginUser({ email: formData.email, password: formData.password });
    } catch (error) {
      console.log(error);
    }
  });
});
