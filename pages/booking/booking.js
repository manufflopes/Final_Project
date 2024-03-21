async function getWorkspaceInfo(id) {
    const apiResponse = await fetch(`http://localhost:3000/workspaces?id=${id}`)
    if (!apiResponse.ok) {
        throw new Error('Api requested Failed.')
    }
    const workspaceData = await apiResponse.json()

    return workspaceData[0]
}

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(location.search)
    const workspaceID = params.get('workspaceId')

    const workspaceInfo = await getWorkspaceInfo(workspaceID)

    const workspaceBookingForm = document.createElement('form')
    workspaceBookingForm.id = 'workspace-booking-form'

    workspaceBookingForm.innerHTML = `
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Workspace Name</label
                >
                <strong>${workspaceInfo.name}</strong>
            </div>
        </div>
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Places</label
                >
                <strong>${workspaceInfo.places}</strong>
            </div>
        </div>
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Workspace Type</label
                >
                <strong>${workspaceInfo.type}</strong>
            </div>
        </div>       
        <img src="./images/${workspaceInfo.image}" />
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Booking Date</label
                >
                From:
                <input type="date" id="booking-date-from" name="booking-date-from">
                To:
                <input type="date" id="booking-date-to" name="booking-date-to">
            </div>
        </div> 
        <button id="send-button" class="base-button" type="submit">
            Book Now
        </button>
    `

    const main = document.getElementsByTagName('main')[0]
    main.append(workspaceBookingForm)

    const bookingDateInput = document.getElementById('booking-date-from')
    const bookingEndDateInput = document.getElementById('booking-date-to')

    let days = 1

    if (workspaceInfo.leaseTerm == 'week') {
        days = 6
    } else if (workspaceInfo.leaseTerm == 'month') {
        days = 29
    }

    bookingDateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value)
        const endDate = new Date(
            selectedDate.setDate(selectedDate.getDate() + days)
        )

        bookingEndDateInput.value = endDate.toISOString().split('T')[0]
        bookingEndDateInput.disabled = true
    })
})
