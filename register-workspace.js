function parseWorkspaceType(type) {
    let typename
    switch (type) {
        case 'desk':
            typename = 'Desk in a Workspace area'
            break

        case 'meeting_room':
            typename = 'Meeting Room'
            break

        case 'private_office':
            typename = 'Private Office Room'
            break
        default:
            typename = 'Not valid'
            break
    }
    return typename
}

function createWorkspaceTypesSelector(types) {
    const div = document.createElement('div')
    div.classList.add('form-content')
    div.innerHTML = `
        <div class="input-container">
                <label class="base-button" for="select-type">
                    Workspace Type
                </label>
                <select
                    class="space-to-fill"
                    name="select-type"
                    id="select-type"
                >
                    <option disabled selected>
                        Select a type
                    </option>
${types
    .map(function (type) {
        return `<option value="${type}">${parseWorkspaceType(type)}</option>`
    })
    .join('')}
                    
                </select>
        </div>
    `

    return div
}

async function getPropertyInfo(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/properties/${id}`)
        if (!response.ok) {
            throw new Error('Property not found !')
        }

        const propertyData = await response.json()
        return propertyData
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(location.search)
    const propertyId = urlParams.get('propertyId')
    const dataProperty = await getPropertyInfo(propertyId)

    const pageTitle = document.getElementsByClassName('page-title')[0]
    pageTitle.textContent = `Add Workspace to ${dataProperty.buildingName}`

    const main = document.getElementsByTagName('main')[0]
    main.append(createWorkspaceTypesSelector(dataProperty.workspaceTypes))
})
