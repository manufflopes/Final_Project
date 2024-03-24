import {
  createProperty,
  updateProperty,
  getPropertyById,
  uploadImage,
} from "../../scripts/api.js";
import { baseUrl } from "../../scripts/config.js";
import { userData } from "../../scripts/session.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";

document.addEventListener("DOMContentLoaded", async function () {
  /* upload image trick */
  const uploadImageBtn = document.querySelector(".upload-btn-image");
  const uploadFileInput = document.querySelector("#upload-image-input");
  const imagePreview = document.querySelector(".property-image-preview");

  if (uploadImageBtn) {
    uploadImageBtn.addEventListener("click", function () {
      uploadFileInput.click();
    });
  }

  if (uploadFileInput) {
    uploadFileInput.addEventListener("change", function () {
      if (this.files.length) {
        const reader = new FileReader();
        reader.onload = function () {
          imagePreview.src = reader.result;
          imagePreview.classList.remove("hidden");
        };
        reader.readAsDataURL(this.files[0]);
      } else {
        imagePreview.src = "";
        imagePreview.classList.add("hidden");
      }

      document.querySelector("#uploaded-file-name").textContent =
        this.files[0]?.name || "Select an Image for the Property";
    });
  }

  /* register property  form */
  const propertyRegistrationForm = document.getElementById(
    "property-registration-form"
  );

  const propertyId = new URLSearchParams(window.location.search).get(
    "propertyId"
  );

  if (propertyId) {
    setLoaderVisibility(true);
    const property = await getPropertyById(propertyId, userData.userId);

    if (!property) {
      window.location.assign(`${baseUrl}/404.html`);

      return;
    }

    const imagePreview = document.querySelector(".property-image-preview");
    imagePreview.src = property.image;
    imagePreview.alt = property.buildingName;
    imagePreview.classList.remove("hidden");

    propertyRegistrationForm.prepend(imagePreview);

    propertyRegistrationForm.elements.buildingName.value =
      property.buildingName;
    propertyRegistrationForm.elements.address.value = property.address;
    propertyRegistrationForm.elements.neighborhood.value =
      property.neighborhood;
    propertyRegistrationForm.elements.squareFeet.value = property.squareFeet;
    propertyRegistrationForm.elements.propertyId.value = property.id;

    if (property.hasParkingGarage) {
      propertyRegistrationForm.elements.parking_yes.checked = true;
    } else {
      propertyRegistrationForm.elements.parking_no.checked = true;
    }

    if (property.hasPublicTransportNearBy) {
      propertyRegistrationForm.elements.hasPublicTransportNearBy_yes.checked = true;
    } else {
      propertyRegistrationForm.elements.hasPublicTransportNearBy_no.checked = true;
    }

    property.workspaceTypes.forEach((type) => {
      propertyRegistrationForm.elements[`type_${type}`].checked = true;
    });
    setLoaderVisibility(false);
  }

  propertyRegistrationForm.addEventListener("submit", async function (event) {
    setLoaderVisibility(true);
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));
    const selectedPropertyTypes = [
      ...document.querySelectorAll("input[name=workspaceTypes]:checked"),
    ];

    let propertyExists;
    if (formData.propertyId) {
      const property = await getPropertyById(
        formData.propertyId,
        userData.userId
      );

      if (!property) {
        window.location.assign(`${baseUrl}/404.html`);

        return;
      }

      propertyExists = property;
    }

    try {
      let imageUrl = "";

      if (formData.image.size > 0) {
        imageUrl = await uploadImage(formData.image);

        if (!imageUrl) {
          throw new Error("Image not uploaded");
        }
      }

      const newProperty = {
        ...formData,
        hasParkingGarage: Boolean(Number(formData.hasParkingGarage)),
        hasPublicTransportNearBy: Boolean(
          Number(formData.hasPublicTransportNearBy)
        ),
        image: imageUrl || propertyExists.image,
        workspaceTypes: selectedPropertyTypes.map((btn) => btn.value),
        ownerId: userData.userId,
        propertyId,
      };

      if (propertyExists) {
        await updateProperty(newProperty);
      } else {
        await createProperty(newProperty);
      }
      window.location.assign(baseUrl);
    } catch (error) {
      console.log(error);
      setLoaderVisibility(false);
    }
  });
});
