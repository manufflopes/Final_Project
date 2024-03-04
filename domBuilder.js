function createHeader() {
    const headerTag = document.createElement('header')
    headerTag.innerHTML = `
        <div class="container header-container">
            <img class="logo" src="./images/OpenDesks.png" alt="logo" />
            <nav>
                <ul>
                    <li><a class="base-button" href="#">About Us</a></li>
                    <li><a class="base-button" href="#">Register</a></li>
                    <li>
                        <a class="base-button" href="#">Workspaces</a>
                    </li>
                    <li><a class="base-button" href="#">FAQ</a></li>
                    <li><a class="login-button" href="#">Login</a></li>
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
                            <a class="footer-link" href="#">About Us</a>
                        </li>
                        <li>
                            <a class="footer-link" href="#">Contact Us</a>
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

document.addEventListener('DOMContentLoaded', function () {
    const domBody = document.body

    const newHeader = createHeader()
    domBody.prepend(newHeader)

    const newFooter = createFooter()
    domBody.append(newFooter)
})
