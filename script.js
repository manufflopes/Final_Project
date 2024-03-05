function addProperty(propertyData) {
    const property = document.createElement('div')
    property.classList.add('workspace')

    property.innerHTML = `
                    <div class="workspace-container">
                        <img class="workspace-image" src="images/${propertyData.image}" />
                        <div class="workspace-info">
                            <p>Address: ${propertyData.address}</p>
                            <p>Building Name: ${propertyData.buildingName}</p>
                            <p>Types: ${propertyData.types}</p>
                        </div>
                    </div>
                    <a href="./workspaces.html?propertyId=${propertyData.id}" class="check-button">Check</a>
                `
    return property
}

function addWorkspace(workspaceData) {
    console.log(workspaceData)
    const workspace = document.createElement('div')
    workspace.classList.add('workspace')

    workspace.innerHTML = `
                    <div class="workspace-container">
                        <img class="workspace-image" src="images/${
                            workspaceData.image
                        }" />
                        <div class="workspace-info">
                            <p>Name: ${workspaceData.name}</p>
                            <p>Places: ${workspaceData.places}</p>
                            <p>Price: ${workspaceData.price}</p>
                            ${
                                workspaceData.smokingIsAllowed
                                    ? 'Smoking is Allowed'
                                    : ''
                            }
                        </div>
                    </div>
                    <a disable=true href="./booking.html?workspaceIs\d=${
                        workspaceData.id
                    }" class="check-button">Book Now</a>
                `
    return workspace
}

const db = [
    {
        id: 1,
        image: 'image3.webp',
        address: '1235 11th Avenue',
        buildingName: 'The Metropolitan',
        types: 'Apartment',
        workspaces: [
            {
                id: 1,
                name: 'AP 901',
                smokingIsAllowed: false,
                places: 2,
                price: 1680,
                image: 'image3.webp'
            },
            {
                id: 2,
                name: 'AP 906',
                smokingIsAllowed: false,
                places: 6,
                price: 2680,
                image: 'image2.webp'
            }
        ]
    },
    {
        id: 2,
        image: 'image4.webp',
        address: 'Rua das Flores',
        buildingName: 'The Eleven',
        types: 'Desk',
        workspaces: []
    },
    {
        id: 4,
        image: 'image2.webp',
        address: 'Rua Sergipe',
        buildingName: 'Bilbo',
        types: 'Apartment',
        workspaces: [
            {
                id: 3,
                name: 'Sala de reuniao',
                smokingIsAllowed: false,
                places: 6,
                price: 3680,
                image: 'image5.webp'
            }
        ]
    }
]

document.addEventListener('DOMContentLoaded', function () {
    if (location.pathname == '/') {
        //index.html
        const workspaceSection = document.querySelector('.workspaces-section')
        for (let index = 0; index < db.length; index++) {
            workspaceSection.append(addProperty(db[index]))
        }
    }

    if (location.pathname == '/workspaces.html') {
        const workspaceSection = document.querySelector('.workspaces-section')

        const params = new URLSearchParams(location.search)
        // {

        // }

        const propertyId = params.get('propertyId')

        if (propertyId) {
            const filteredData = db.find(property => {
                if (property.id == propertyId) {
                    return true
                }
            })

            if (filteredData.workspaces.length == 0) {
                workspaceSection.innerHTML =
                    '<p>There are no workspaces available for this property</p>'
                return
            }

            for (
                let index = 0;
                index < filteredData.workspaces.length;
                index++
            ) {
                workspaceSection.append(
                    addWorkspace(filteredData.workspaces[index])
                )
            }
        } else {
            console.log('Nenhuma propriedade selecionada')
        }
    }
})
