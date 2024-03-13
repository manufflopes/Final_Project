const hasParkingGarage = hasParkingGarage => {
    return hasParkingGarage
        ? "<img src='./assets/svg/parking.svg' class='svg-icon'/>"
        : ''
}

const hasPublicTransport = hasPublicTransportNearBy => {
    return hasPublicTransportNearBy
        ? "<img src='./assets/svg/bus.svg' class='svg-icon'/>"
        : ''
}

const isSmokingAllowed = isSmokingAllowed => {
    return isSmokingAllowed
        ? "<img src='./assets/svg/smoking-allowed.svg' class='svg-icon'/>"
        : "<img src='./assets/svg/smoking-not-allowed.svg' class='svg-icon'/>"
}

const propertyType = propertyType => {
    const mappedPropertyType = {
        meeting_room:
            "<img src='./assets/svg/meeting-room.svg' class='svg-icon'/>",
        private_office:
            "<img src='./assets/svg/private-room.svg' class='svg-icon'/>",
        desk: "<img src='./assets/svg/shared-space-desk.svg' class='svg-icon'/>"
    }

    return mappedPropertyType[propertyType] || ''
}

function addProperty(propertyData) {
    const property = document.createElement('div')
    property.classList.add('workspace')

    property.innerHTML = `
                    <div class="workspace-container">
                      <h2 class="workspace-title">${
                          propertyData.buildingName
                      }</h2>
                      <img class="workspace-image" src="images/${
                          propertyData.image
                      }" />
                      <div class="workspace-info">
                        <div class="info-container">
                          <label>Address:</label>
                          <span>${propertyData.address}</span>
                        </div>
                        <div class="info-container">
                          <label>Neighborhood:</label>
                          <span>${propertyData.neighborhood}</span>
                        </div>
                        <div class="info-container">
                          <label>Square Feet:</label>
                          <span>${propertyData.squareFeet}</span>
                        </div>
                        <div class="info-container">
                          <label class="info-label">Facilities</label>
                          <div class="facilities-container">
                            <div class="icons-container">
                            ${hasParkingGarage(propertyData.hasParkingGarage)}
                            ${hasPublicTransport(
                                propertyData.hasPublicTransportNearBy
                            )}
                            </div>
                          </div>
                        </div>
                        <div class="info-container">
                          <label class="info-label">Available Workspaces</label>
                          <div class="icons-container">
                            ${propertyData.workspaceTypes
                                .map(propertyType)
                                .join('')}
                          </div>    
                        </div>
                      </div>
                    </div>
                    <a href="./workspaces.html?propertyId=${
                        propertyData.id
                    }" class="check-button">View Details</a>
                `
    return property
}

function addWorkspace(workspaceData) {
    const workspace = document.createElement('div')
    workspace.classList.add('workspace')

    workspace.innerHTML = `
                      <div class="workspace-container">
                        <h2 class="workspace-title">${workspaceData.name}</h2>
                        <img class="workspace-image" src="images/${
                            workspaceData.image
                        }" />
                        <div class="workspace-info">
                          <div class="info-container">
                            <label>Price:</label>
                            <span>
                              ${new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                              }).format(workspaceData.price)}
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Lease Term:</label>
                            <span>
                              ${
                                  workspaceData.leaseTerm
                                      .charAt(0)
                                      .toUpperCase() +
                                  workspaceData.leaseTerm.slice(1)
                              }
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Availability Date</label>
                            <span>
                              ${new Date(
                                  workspaceData.availabilityDate
                              ).toLocaleDateString('en-CA')}
                            </span>
                          </div>
                          <div class="info-container">
                            <div class="icons-container">
                              ${isSmokingAllowed(
                                  workspaceData.smokingIsAllowed
                              )}
                            </div>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Workspace Type</label>
                            <div class="icons-container">
                              ${propertyType(workspaceData.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <a href="./booking.html?workspaceId=${
                          workspaceData.id
                      }" class="check-button">Book Now</a>
                `
    return workspace
}

async function fetchProperties() {
    const response = await fetch('http://localhost:3000/properties')
    const data = await response.json()
    return data
}

async function fetchWorkspaces(propertyId) {
    const response = await fetch(
        `http://localhost:3000/workspaces/${propertyId}`
    )
    const data = await response.json()
    return data
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM fully loaded and parsed')
    if (['/index.html', '/'].includes(location.pathname)) {
        const workspaceSection = document.querySelector('.workspaces-section')

        const properties = await fetchProperties()
        for (let index = 0; index < properties.length; index++) {
            workspaceSection.append(addProperty(properties[index]))
        }
    }

    if (location.pathname == '/workspaces.html') {
        const workspaceSection = document.querySelector('.workspaces-section')

        const params = new URLSearchParams(location.search)
        const propertyId = params.get('propertyId')

        if (propertyId) {
            const { spaces } = await fetchWorkspaces(propertyId)

            if (!spaces.length) {
                workspaceSection.innerHTML =
                    '<p>There are no workspaces available for this property</p>'
                return
            }

            spaces.forEach(workspace =>
                workspaceSection.append(addWorkspace(workspace))
            )
        } else {
            console.log('Nenhuma propriedade selecionada')
        }
    }

    if (location.pathname == '/register.html') {
        const userRegistrationForm = document.getElementById(
            'user-registration-form'
        )

        userRegistrationForm.addEventListener('submit', function (event) {
            event.preventDefault()

            const name = document.getElementById('username')
            const email = document.getElementById('email')
            const phone = document.getElementById('phone')
            const password = document.getElementById('password')
            const role = document.getElementById('role')

            const newUser = {
                name: name.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: role.value
            }

            const localStorage = window.localStorage
            const previousData = localStorage.getItem('openDesks - users') || []
            const users = previousData.length ? JSON.parse(previousData) : []
            users.push(newUser)

            localStorage.setItem('openDesks - users', JSON.stringify(users))
        })
    }
})
