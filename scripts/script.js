import { userData } from "./session.js";
import { fetchProperties } from "./api.js";
import { setLoaderVisibility } from "./domBuilder.js";
import { rootDir } from "./config.js";

const hasParkingGarage = (hasParkingGarage) => {
  return hasParkingGarage
    ? "<img src='../assets/svg/parking.svg' class='svg-icon'/>"
    : "";
};

const hasPublicTransport = (hasPublicTransportNearBy) => {
  return hasPublicTransportNearBy
    ? "<img src='../assets/svg/bus.svg' class='svg-icon'/>"
    : "";
};

export const propertyType = (propertyType, assetLocation = "..") => {
  const mappedPropertyType = {
    meeting_room: `<img src='${assetLocation}/assets/svg/meeting-room.svg' class='svg-icon'/>`,
    private_office: `<img src='${assetLocation}/assets/svg/private-room.svg' class='svg-icon'/>`,
    desk: `<img src='${assetLocation}/assets/svg/shared-space-desk.svg' class='svg-icon'/>`,
  };

  return mappedPropertyType[propertyType] || "";
};

export function parseWorkspaceType(type) {
  let typename;
  switch (type) {
    case "desk":
      typename = "Desk in a Workspace area";
      break;

    case "meeting_room":
      typename = "Meeting Room";
      break;

    case "private_office":
      typename = "Private Office Room";
      break;
    default:
      typename = "Not valid";
      break;
  }
  return typename;
}

function addProperty(propertyData, userSessionData) {
  const property = document.createElement("div");
  property.classList.add("workspace");

  const isTheOwner =
    userSessionData?.role == "owner" &&
    userSessionData?.userId == propertyData.ownerId;

  const imageSrc = propertyData.image.includes("http")
    ? propertyData.image
    : `../images/${propertyData.image}`;

  property.innerHTML = `
      <div class="workspace-container">
        <h2 class="workspace-title">
          ${propertyData.buildingName}
          ${
            isTheOwner
              ? `<span class="manage" data-property-id="${propertyData.id}">
          <img src="../assets/setting.png" class="manage-icon" />
        </span>`
              : ""
          }
        </h2>
        <img class="workspace-image" src="${imageSrc}" />
        <div class="workspace-info">
          <div class="info-container">
            <label>Address:</label>
            <span>${propertyData.address}</span>
          </div>
          <div class="info-container">
            <label>Neighborhood:</label>
            <span>${propertyData.neighborhood}</span>
          </div>
          <div class="info-container square-feet">
            <label>Square Feet:</label>
            <span>${propertyData.squareFeet}</span>
          </div>
          ${
            propertyData.hasParkingGarage ||
            propertyData.hasPublicTransportNearBy
              ? `<div class="info-container">
          <label class="info-label">Facilities</label>
          <div class="facilities-container">
            <div class="icons-container">
            ${hasParkingGarage(propertyData.hasParkingGarage)}
            ${hasPublicTransport(propertyData.hasPublicTransportNearBy)}
            </div>
          </div>
        </div>`
              : ""
          }
          <div class="info-container workspace-types">
            <label class="info-label">Available Workspaces</label>
            <div class="icons-container">
              ${propertyData.workspaceTypes
                .map((type) => propertyType(type))
                .join("")}
            </div>    
          </div>
        </div>
      </div>
      <a href="${rootDir}workspaces/?propertyId=${
    propertyData.id
  }" class="check-button">View Details</a>
  `;
  return property;
}

export function addPageOperations(
  sessionState,
  operationType,
  assetsLocation = ".."
) {
  const searchSection = document.querySelector("#search-section");
  const sectionExists = document.querySelector(".dynamic-menu");

  if (sectionExists) {
    return;
  }

  if (sessionState?.role == "owner") {
    const operationsSection = document.createElement("section");
    operationsSection.id = "operations-section";
    operationsSection.classList.add("dynamic-menu");
    operationsSection.innerHTML = `
      <a href="${rootDir}${operationType}" class="base-button add-button">Add NEW</a>
      `;
    searchSection.after(operationsSection);
  } else {
    const heroSection = document.createElement("section");
    heroSection.id = "hero-section";
    heroSection.classList.add("dynamic-menu");
    heroSection.innerHTML = `
                  <div class="app-description">
                      <h2>Office Spaces for Rent</h2>
                      <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Voluptates, accusantium suscipit facere delectus quo
                          corrupti quia quod enim dicta et molestias adipisci
                          velit ullam quae tempora! Odit repellendus velit
                          distinctio!
                      </p>
                  </div>
                  <img
                      class="hero-image"
                      src="${assetsLocation}/images/image2.webp"
                      alt="Office image"
                  />
              `;

    searchSection.after(heroSection);
  }
}

async function showData(filters) {
  const workspaceSection = document.querySelector(".workspaces-section");
  workspaceSection.innerHTML = "";
  const userId = userData?.role == "coworker" ? null : userData?.userId;
  addPageOperations(userData, "register-property");
  setLoaderVisibility(true);
  const properties = await fetchProperties(userId, filters);

  if (!properties?.length) {
    const noContentSection = document.querySelector(".no-content-available");
    noContentSection.innerHTML =
      "<p class='none-available'>There are not properties registered!</p>";
    setLoaderVisibility(false);
    return;
  }

  for (let index = 0; index < properties.length; index++) {
    workspaceSection.append(addProperty(properties[index], userData));
  }

  setLoaderVisibility(false);

  const manageIcons = document.querySelectorAll(".manage");

  manageIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const propertyId = icon.dataset.propertyId;
      window.location.assign(
        `${rootDir}register-property/?propertyId=${propertyId}`
      );
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const searchForm = document.getElementById("search-section");
  let filters;
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));
      filters = formData;
      showData(filters);
    });
  }

  if (location.pathname == rootDir) {
    showData();
  }
});
