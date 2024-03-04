function addProperty(propertyData) {
    const workspace = document.createElement('div')
    workspace.classList.add('workspace')

    workspace.innerHTML = `
                    <div class="workspace-container">
                        <img class="workspace-image" src="images/${propertyData.image}" />
                        <div class="workspace-info">
                            <p>Address: ${propertyData.address}</p>
                            <p>Building Name: ${propertyData.buildingName}</p>
                            <p>Type: ${propertyData.type}</p>
                        </div>
                    </div>
                    <button class="check-button">Check</button>
                `
    return workspace
}

const db = [
    {
        image: 'image3.webp',
        address: '1235 11th Avenue',
        buildingName: 'The Metropolitan',
        type: 'Apartment',
        workspaces: []
    },
    {
        image: 'image4.webp',
        address: 'Rua das Flores',
        buildingName: 'The Eleven',
        type: 'Desk'
    },
    {
        image: 'image2.webp',
        address: 'Rua Sergipe',
        buildingName: 'Bilbo',
        type: 'Buraco'
    }
]

document.addEventListener('DOMContentLoaded', function () {
    const workspaceSection = document.querySelector('.workspaces-section')

    for (let index = 0; index < db.length; index++) {
        workspaceSection.append(addProperty(db[index]))
    }
})
