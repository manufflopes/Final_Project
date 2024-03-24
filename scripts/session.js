import { baseUrl } from "./config.js";

let userData;

function logoutUser() {
  sessionStorage.removeItem("open-desks@user");
  window.location.assign(baseUrl);
}

document.addEventListener("DOMContentLoaded", function () {
  const userSession = sessionStorage.getItem("open-desks@user");

  if (userSession !== null) {
    userData = JSON.parse(userSession);

    if (["/pages/login"].includes(location.pathname)) {
      window.location.assign(baseUrl);
      return;
    }
  } else {
    if (
      [
        "/pages/register-property",
        "/pages/register-workspace",
        "/pages/booking",
      ].includes(location.pathname)
    ) {
      window.location.assign(`${baseUrl}/pages/login`);
      return;
    }
  }
});

export { userData, logoutUser };
