import { getMyBookings } from '../../scripts/api.js';
import { setLoaderVisibility } from '../../scripts/domBuilder.js';

document.addEventListener('DOMContentLoaded', async function () {
  setLoaderVisibility(true);

  const myBookings = document.createElement('div');
  myBookings.id = 'my-bookings';
  myBookings.classList.add('gap-1');

  let bookings;
  try {
    bookings = await getMyBookings();
    setLoaderVisibility(false);
  } catch (error) {
    const noContentSection = document.querySelector('.no-content-available');
    noContentSection.innerHTML =
      "<p class='none-available'>You don't have any booking yet!</p>";
    noContentSection.style.display = 'grid';

    setLoaderVisibility(false);

    return;
  }

  myBookings.innerHTML = bookings
    .map((booking) => {
      if (!booking.startDate) return '';
      return `<div class="workspace-container">
                        <h2 class="workspace-title">
                          Booking reference ${booking.id}
                        </h2>
                        <div class="workspace-info">
                          <div class="info-container">
                            <div>
                                <label>Date:</label>
                                <span>
                                    ${new Intl.DateTimeFormat('en-US', {
                                      dateStyle: 'full',
                                      timeStyle: 'short',
                                    }).format(new Date(booking.startDate))}
                                </span>
                            </div>
                            <div>
                                <label>Status:</label>
                                <span class="booking-status">
                                    Confirmed
                                </span>
                            </div>
                          </div>
                        </div>
                      </div>`;
    })
    .join('');

  const main = document.getElementsByTagName('main')[0];
  main.append(myBookings);

  setLoaderVisibility(false);
});
