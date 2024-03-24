import { loginUser } from "../../scripts/api.js";
import { rootDir } from "../../scripts/config.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";

document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.getElementById("login-form");
  const main = document.getElementsByTagName("main")[0];

  const registerLink = document.createElement("p");
  registerLink.classList.add("new-customer");
  registerLink.innerHTML = `Don't have an account? <a href="${rootDir}sign-up">Sign up</a>`;
  main.append(registerLink);

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    const redirect = new URLSearchParams(location.search).get("callback");
    setLoaderVisibility(true);
    await loginUser(formData, () => setLoaderVisibility(false), redirect);
  });
});
