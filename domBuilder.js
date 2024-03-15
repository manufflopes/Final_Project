function createHeader(userData) {
    const headerTag = document.createElement('header')
    headerTag.innerHTML = `
        <div class="container header-container">
            <a href="/">
                <img class="logo" src="./images/OpenDesks.png" alt="logo" />
            </a>
            <nav>
                <ul>
                    <li><a class="base-button" href="./aboutUs.html">About Us</a></li>
                    <li><a class="base-button" href="./register.html">Register</a></li>
                    <li><a class="base-button" href="./faq.html">FAQ</a></li>
                    <li><a class="base-button" href="./contactUs.html">Contact Us</a></li>
                    <li>${
                        userData
                            ? userData
                            : '<a class="login-button" href="./login.html">Login</a>'
                    }</li>
                </ul>
            </nav>
        </div>
        `
    return headerTag
}

function createFooter() {
    const footerTag = document.createElement('footer')
    footerTag.innerHTML = `
  
            <div class="container footer-container">
                <img
                    class="logo footer-logo"
                    src="./images/OpenDesks.png"
                    alt="logo"
                />
                <nav>
                    <ul>
                        <li>
                            <a class="footer-link" href="./aboutUs.html">About Us</a>
                        </li>
                        <li>
                            <a class="footer-link" href="./contactUs.html">Contact Us</a>
                        </li>
                    </ul>
                </nav>
                <div class="our-customers">
                    <h2>Our Clients</h2>
                    <div class="separator">
                        <div class="customers-logo">
                            <img src="./images/disney.webp" alt="logo disney" />
                            <img
                                src="./images/microsoft.webp"
                                alt="logo disney"
                            />
                            <img src="./images/slack.webp" alt="logo disney" />
                        </div>
                    </div>
                </div>
            </div>

    `

    return footerTag
}

document.addEventListener('DOMContentLoaded', async function () {
    const userSession = sessionStorage.getItem('open-desks@user')
    let userName

    if (userSession !== null) {
        userName = JSON.parse(userSession).name
    }

    const domBody = document.body

    const newHeader = createHeader(userName)
    domBody.prepend(newHeader)

    const newFooter = createFooter()
    domBody.append(newFooter)
})
