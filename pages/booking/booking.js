import { getWorkspaceInfo, createBooking } from "../../scripts/api.js";
import { userData } from "../../scripts/session.js";
import { baseUrl } from "../../scripts/config.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";
import { parseWorkspaceType } from "../../scripts/script.js";

document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(location.search);
  const workspaceID = params.get("workspaceId");

  setLoaderVisibility(true);
  const workspaceInfo = await getWorkspaceInfo(workspaceID);

  const workspaceBookingForm = document.createElement("form");
  workspaceBookingForm.id = "workspace-booking-form";

  const imageSrc = workspaceInfo.image.includes("http")
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
            <strong>${new Intl.NumberFormat("en-us", {
              style: "currency",
              currency: "USD",
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
                <input type="date" id="booking-date-from" name="booking-date-from" required>
                To:
                <input type="date" id="booking-date-to" name="booking-date-to">
            </div>
        </div>
        <input type="hidden" name="workspaceId" value="${workspaceInfo.id}"/> 
        <button id="send-button" class="base-button form-submit" type="submit">
            Book Now
        </button>
    `;

  const main = document.getElementsByTagName("main")[0];
  main.append(workspaceBookingForm);
  setLoaderVisibility(false);

  const bookingDateInput = document.getElementById("booking-date-from");
  const bookingEndDateInput = document.getElementById("booking-date-to");

  let days = 1;

  if (workspaceInfo.leaseTerm == "week") {
    days = 6;
  } else if (workspaceInfo.leaseTerm == "month") {
    days = 29;
  }

  bookingDateInput.addEventListener("change", function () {
    const selectedDate = new Date(this.value);
    const endDate = new Date(
      selectedDate.setDate(selectedDate.getDate() + days)
    );

    bookingEndDateInput.value = endDate.toISOString().split("T")[0];
    // bookingEndDateInput.disabled = true;
  });

  workspaceBookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    const bookingData = {
      ...formData,
      userId: userData.userId,
    };

    try {
      setLoaderVisibility(true);
      const bookingResponse = await createBooking(bookingData);
      window.location.assign(
        `${baseUrl}confirmation/?bookingId=${bookingResponse.id}`
      );
    } catch (error) {
      setLoaderVisibility(false);
      console.log(error);
      window.location.assign(`${baseUrl}booking-error/`);
    }
  });
});
