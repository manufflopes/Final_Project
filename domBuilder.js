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

function showRegistrationLink(sessionState) {
    console.log(location.pathname)
    if (
        ['/', '/login.html', '/booking.html', '/register.html'].includes(
            location.pathname
        )
    ) {
        return ''
    }

    if (sessionState) {
        return ''
    }

    const div = document.createElement('div')
    div.classList.add('register-now')
    div.innerHTML = `<button class="register-button">Register Now</button>`

    return div
}

/* get user session state */
const userSession = sessionStorage.getItem('open-desks@user')
let userInfo

if (userSession !== null) {
    userInfo = JSON.parse(userSession)
}

// end get user session state

document.addEventListener('DOMContentLoaded', async function () {
    const domBody = document.body

    const main = document.getElementsByTagName('main')[0]

    const newHeader = createHeader(userInfo?.name)
    domBody.prepend(newHeader)

    const newFooter = createFooter()
    domBody.append(newFooter)

    const registrationLink = showRegistrationLink(userInfo)

    main.append(registrationLink)
})
