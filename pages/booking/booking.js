import { getWorkspaceInfo, createBooking } from '../../scripts/api.js';
import { userData } from '../../scripts/session.js';
import { baseUrl } from '../../scripts/config.js';
import { setLoaderVisibility } from '../../scripts/domBuilder.js';
import { parseWorkspaceType } from '../../scripts/script.js';

let unavailableDates = [];

document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(location.search);
  const workspaceID = params.get('workspaceId');

  setLoaderVisibility(true);
  const workspaceInfo = await getWorkspaceInfo(workspaceID);

  const workspaceBookingForm = document.createElement('form');
  workspaceBookingForm.id = 'workspace-booking-form';

  unavailableDates = workspaceInfo.unavailableDates;

  function disableDates(date) {
    const dateString = jQuery.datepicker.formatDate('yy-mm-dd', date);
    return [unavailableDates.indexOf(dateString) == -1];
  }

  const imageSrc = workspaceInfo.image.includes('http')
    ? workspaceInfo.image
    : `../../images/${workspaceInfo.image}`;

  workspaceBookingForm.innerHTML = `
        <img class="property-image-preview" src="${imageSrc}" />
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Name</label
                >
                <strong>${workspaceInfo.name}</strong>
            </div>
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
                    >Type</label
                >
                <strong>${parseWorkspaceType(workspaceInfo.type)}</strong>
            </div>
        </div>
        <div class="form-content">
          <div class="input-container">
            <label class="base-button" for="buildingName"
                >Price</label
            >
            <strong>${new Intl.NumberFormat('en-us', {
              style: 'currency',
              currency: 'USD',
            }).format(workspaceInfo.price)}</strong>
          </div>
          <div class="input-container">
            <label class="base-button" for="buildingName"
                >Lease Term</label
            >
            <strong class="lease-term">${workspaceInfo.leaseTerm}</strong>
          </div>
        </div>       
        
        <div class="form-content">
            <div class="input-container">
                <label class="base-button" for="buildingName"
                    >Booking Date</label
                >
                From:
                <input type="text" class="date" id="startDate" name="startDate" required>
                To:
                <input type="text" class="date" id="endDate" name="endDate" readonly>
            </div>
        </div>
        <input type="hidden" name="workspaceId" value="${workspaceID}"/> 
        <button id="send-button" class="base-button form-submit" type="submit">
            Book Now
        </button>
    `;

  const main = document.getElementsByTagName('main')[0];
  main.append(workspaceBookingForm);
  setLoaderVisibility(false);

  let days = 1;

  if (workspaceInfo.leaseTerm == 'week') {
    days = 6;
  } else if (workspaceInfo.leaseTerm == 'month') {
    days = 29;
  }
  const bookingEndDateInput = document.getElementById('endDate');
  $('#startDate').datepicker({
    dateFormat: 'yy-mm-dd',
    beforeShowDay: disableDates,
    onSelect: function (selected) {
      const selectedDate = new Date(this.value);
      const endDate = new Date(
        selectedDate.setDate(selectedDate.getDate() + days)
      );
      bookingEndDateInput.value = endDate.toISOString().split('T')[0];
    },
  });

  workspaceBookingForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    const bookingData = {
      ...formData,
    };
    console.log(
      `${baseUrl}confirmation/?workspaceId=${formData.workspaceId}&endDate=${formData.endDate}&startDate=${formData.startDate}`
    );
    // setLoaderVisibility(true);
    window.location.assign(
      `${baseUrl}confirmation/?workspaceId=${formData.workspaceId}&endDate=${formData.endDate}&startDate=${formData.startDate}`
    );
  });
});
