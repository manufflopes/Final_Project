import { userData } from "./session.js";

function createHeader(userData, assetsPath) {
  const headerTag = document.createElement("header");
  headerTag.innerHTML = `
        <div class="container header-container">
            <a href="/pages">
                <img class="logo" src="${assetsPath}/images/OpenDesks.png" alt="logo" />
            </a>
            <nav>
                <ul>
                    <li><a class="base-button" href="/pages/about-us">About Us</a></li>
                    <li><a class="base-button" href="/pages/sign-up">Sign up</a></li>
                    <li><a class="base-button" href="/pages/faq">FAQ</a></li>
                    <li><a class="base-button" href="/pages/contact-us">Contact Us</a></li>
                    <li>${
                      userData
                        ? userData
                        : '<a class="login-button" href="./login">Login</a>'
                    }</li>
                </ul>
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
                            <a class="footer-link" href="/pages/about-us">About Us</a>
                        </li>
                        <li>
                            <a class="footer-link" href="/pages/contact-us">Contact Us</a>
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

function showRegistrationLink(sessionState) {
  console.log(location.pathname);
  if (
    ["/", "/pages/sign-up", "/pages/booking", "/pages/register"].includes(
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
  div.innerHTML = `<a href="../pages/sign-up" class="register-button">Register Now</button>`;

  return div;
}

document.addEventListener("DOMContentLoaded", async function () {
  const domBody = document.body;

  const main = document.getElementsByTagName("main")[0];

  const assetsLocation = location.pathname === "/pages/" ? ".." : "../..";

  const newHeader = createHeader(userData?.name, assetsLocation);
  domBody.prepend(newHeader);

  const newFooter = createFooter(assetsLocation);
  domBody.append(newFooter);

  const registrationLink = showRegistrationLink(userData);

  main.append(registrationLink);
});
