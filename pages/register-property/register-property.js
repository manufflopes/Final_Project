import { createProperty } from "../../scripts/api.js";
import { baseUrl } from "../../scripts/config.js";
import { userData } from "../../scripts/session.js";

async function uploadImage(file) {
  const fileExtension = file.name.toLocaleLowerCase().split(".").pop();

  if (!["png", "jpg", "jpeg"].includes(fileExtension)) {
    throw new Error('Only "png", "jpg" and "jpeg" images are allowed.');
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Client-ID 72accd0cd22bdf8",
      },
    });

    const { success, data } = await response.json();

    console.log(success, data);

    if (!success) {
      throw new Error("Image not uploaded");
    }

    return data.link;
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  /* upload image trick */
  const uploadImageBtn = document.querySelector(".upload-btn-image");
  const uploadFileInput = document.querySelector("#upload-image-input");

  if (uploadImageBtn) {
    uploadImageBtn.addEventListener("click", function () {
      uploadFileInput.click();
    });
  }

  if (uploadFileInput) {
    uploadFileInput.addEventListener("change", function () {
      document.querySelector("#uploaded-file-name").textContent =
        this.files[0]?.name || "Select an Image for the Property";
    });
  }

  /* register property  form */
  const propertyRegistrationForm = document.getElementById(
    "property-registration-form"
  );

  propertyRegistrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));
    const selectedPropertyTypes = [
      ...document.querySelectorAll("input[name=workspaceTypes]:checked"),
    ];

    try {
      const imageUrl = await uploadImage(formData.image);

      if (!imageUrl) {
        throw new Error("Image not uploaded");
      }

      const newProperty = {
        ...formData,
        hasParkingGarage: Boolean(Number(formData.hasParkingGarage)),
        hasPublicTransportNearBy: Boolean(
          Number(formData.hasPublicTransportNearBy)
        ),
        image: imageUrl,
        workspaceTypes: selectedPropertyTypes.map((btn) => btn.value),
        ownerId: userData.userId,
      };

      console.log(newProperty);

      await createProperty(newProperty);
      window.location.assign(baseUrl);
    } catch (error) {
      console.log(error);
    }
  });
});
