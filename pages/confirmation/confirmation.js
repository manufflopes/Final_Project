import { createBooking } from '../../scripts/api.js';
import { rootDir } from '../../scripts/config.js';
import { setLoaderVisibility } from '../../scripts/domBuilder.js';
import { parseWorkspaceType } from '../../scripts/script.js';

document.addEventListener('DOMContentLoaded', async function () {
  setLoaderVisibility(true);
  const params = new URLSearchParams(location.search);
  const workspaceId = params.get('workspaceId');
  const startDate = params.get('startDate');
  const endDate = params.get('endDate');

  if (!workspaceId) {
    window.location.assign(`${rootDir}404`);
    return;
  }

  const test = JSON.stringify({
    startDate,
    endDate,
  });
  const bookingResponse = await createBooking(
    {
      startDate,
      endDate,
    },
    workspaceId
  );

  const workspaceBookingConfirmation = document.createElement('div');
  workspaceBookingConfirmation.id = 'workspace-booking-confirmation';

  // const imageSrc = workspaceInfo.image.includes('http')
  //   ? workspaceInfo.image
  //   : `../../images/${workspaceInfo.image}`;
  const imageSrc = '';

  workspaceBookingConfirmation.innerHTML = `
        <h2>Your booking is confirmed!</h2>
        <img class="property-image-preview" src="${imageSrc}" />
        <h4>The workspace ${
          bookingResponse.name
        } has been successfully booked.</h4>
        <h2>Here are the details:</h2>
        <div>
            <p><strong>Lease Term:</strong> ${bookingResponse.leaseTerm}</p>
            <p><strong>Places available:</strong> ${bookingResponse.places}</p>
            <p><strong>Type:</strong> ${parseWorkspaceType(
              bookingResponse.type
            )}</p>
            <p><strong>Price:</strong> ${new Intl.NumberFormat('en-us', {
              style: 'currency',
              currency: 'USD',
            }).format(bookingResponse.price)}</p>
            <p><strong>Start Date:</strong> ${bookingResponse.startDate}</p>
            <p><strong>End Date:</strong> ${bookingResponse.endDate}</p>
            <p class="confirmation-message">You'll receive an e-mail with all details and directions for payment.</p>
        </div>
                
        `;

  const main = document.getElementsByTagName('main')[0];
  main.append(workspaceBookingConfirmation);

  const myBookings = document.createElement('a');
  myBookings.href = `${rootDir}my-bookings/`;
  myBookings.classList.add('base-button');
  myBookings.classList.add('my-booking-button');
  myBookings.innerHTML = 'Go to > My bookings';
  main.append(myBookings);

  setLoaderVisibility(false);
});
