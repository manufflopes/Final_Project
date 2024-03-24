import { baseUrl, rootDir } from "./config.js";

let userData;

function logoutUser() {
  sessionStorage.removeItem("open-desks@user");
  window.location.assign(baseUrl);
}

document.addEventListener("DOMContentLoaded", function () {
  const userSession = sessionStorage.getItem("open-desks@user");

  if (userSession !== null) {
    userData = JSON.parse(userSession);

    if ([`${rootDir}login`].includes(location.pathname)) {
      window.location.assign(baseUrl);
      return;
    }
  } else {
    if (
      [
        `${rootDir}register-property/`,
        `${rootDir}register-workspace/`,
        `${rootDir}booking/`,
      ].includes(location.pathname)
    ) {
      window.location.assign(`${baseUrl}login?callback=${location.href}`);
      return;
    }
  }
});

export { userData, logoutUser };
