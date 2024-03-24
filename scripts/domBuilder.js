import { userData, logoutUser } from "./session.js";
import { rootDir } from "./config.js";

function toggleUserPanel() {
  const userPanel = document.querySelector(".user-sub-menu-container");
  userPanel.classList.toggle("open");
}

function createHeader(userData, assetsPath) {
  const headerTag = document.createElement("header");
  headerTag.innerHTML = `
        <div class="container header-container">
            <a href="${rootDir}">
                <img class="logo" src="${assetsPath}/images/OpenDesks.png" alt="logo" />
            </a>
            <nav>
                <ul>
                    <li><a class="base-button" href="${rootDir}about-us">About Us</a></li>
                    <li><a class="base-button" href="${rootDir}sign-up">Sign up</a></li>
                    <li><a class="base-button" href="${rootDir}faq">FAQ</a></li>
                    <li><a class="base-button" href="${rootDir}contact-us">Contact Us</a></li>
                    <li>${
                      userData
                        ? `<img id="user-avatar" class="user-avatar" src="${assetsPath}/images/avatar/user.png"/>`
                        : `<a class="login-button" href="${rootDir}login">Login</a>`
                    }</li>
                </ul>
                <div class="user-sub-menu-container">
                  <div class="user-sub-menu">
                    <div class="user-info">
                      <img src="${assetsPath}/images/avatar/user.png" alt="User Avatar" />
                      <h2 class="user-name">${userData}</h2>
                    </div>
                    <hr />
                    <a href="${rootDir}my-bookings" class="sub-menu-link">
                      <img src="${assetsPath}/assets/setting.png" />
                      <p>My Bookings</p>
                      <span>></span>
                    </a>
                    <button id="logout-button" href="${rootDir}/logout" class="sub-menu-link">
                      <img src="${assetsPath}/assets/logout.png" />
                      <p>Logout</p>
                      <span>></span>
                    </button>
                </ul>
                </div>
                 
                </div>
            </nav>
        </div>
        `;
  return headerTag;
}

function createFooter(assetsPath) {
  const footerTag = document.createElement("footer");
  footerTag.innerHTML = `
  
            <div class="container footer-container">
                <img
                    class="logo footer-logo"
                    src="${assetsPath}/images/OpenDesks.png"
                    alt="logo"
                />
                <nav>
                    <ul>
                        <li>
                            <a class="footer-link" href="${rootDir}about-us">About Us</a>
                        </li>
                        <li>
                            <a class="footer-link" href="${rootDir}contact-us">Contact Us</a>
                        </li>
                    </ul>
                </nav>
                <div class="our-customers">
                    <h2>Our Clients</h2>
                    <div class="separator">
                        <div class="customers-logo">
                            <img src="${assetsPath}/images/disney.webp" alt="logo disney" />
                            <img
                                src="${assetsPath}/images/microsoft.webp"
                                alt="logo disney"
                            />
                            <img src="${assetsPath}/images/slack.webp" alt="logo disney" />
                        </div>
                    </div>
                </div>
            </div>

    `;

  return footerTag;
}

function addGoBackButton() {
  const a = document.createElement("a");
  a.classList.add("go-back");
  a.href = "javascript:history.back()";
  a.innerHTML = `
    <svg class="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
    </svg>
    Go Back
  `;

  return a;
}

function showRegistrationLink(sessionState) {
  if (
    [`${rootDir}login/`, `${rootDir}booking/`, `${rootDir}sign-up/`].includes(
      location.pathname
    )
  ) {
    return "";
  }

  if (sessionState) {
    return "";
  }

  const div = document.createElement("div");
  div.classList.add("register-now");
  div.innerHTML = `<a href="${rootDir}sign-up" class="register-button">Register Now</button>`;

  return div;
}

function createLoadingElement() {
  const div = document.createElement("div");
  div.id = "loading-element";
  div.innerHTML = `Loading...`;
  return div;
}

export function setLoaderVisibility(setVisible) {
  const loader = document.getElementById("loading-element");
  if (loader) {
    loader.style.display = setVisible ? "flex" : "none";
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const domBody = document.body;
  domBody.append(createLoadingElement());

  if (location.pathname === `${rootDir}login/`) {
    return;
  }

  const main = document.getElementsByTagName("main")[0];

  const assetsLocation = location.pathname === rootDir ? ".." : "../..";

  const newHeader = createHeader(userData?.name, assetsLocation);
  domBody.prepend(newHeader);

  domBody.append(createLoadingElement());

  const newFooter = createFooter(assetsLocation);
  domBody.append(newFooter);

  const registrationLink = showRegistrationLink(userData);

  if (![`${rootDir}`, `${rootDir}login`].includes(location.pathname)) {
    main.prepend(addGoBackButton());
  }

  main.append(registrationLink);

  const userAvatar = document.getElementById("user-avatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", toggleUserPanel);
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});
