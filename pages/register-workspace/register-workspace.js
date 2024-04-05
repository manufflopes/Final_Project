import {
  uploadImage,
  getPropertyInfo,
  createWorkspace,
  getWorkspaceInfo,
  updateWorkspace,
} from '../../scripts/api.js';
import { baseUrl, apiBaseUrl } from '../../scripts/config.js';
import { userData } from '../../scripts/session.js';
import { setLoaderVisibility } from '../../scripts/domBuilder.js';
import { parseWorkspaceType } from '../../scripts/script.js';

function createWorkspaceTypesSelector(types) {
  const div = document.createElement('div');
  div.classList.add('form-content');
  div.innerHTML = `
        <div class="input-container">
          <label class="base-button" for="type">
              Workspace Type
          </label>
          <select
              class="space-to-fill"
              name="type"
              id="type"
              required
          >
            <option disabled selected value="">
                Select a type
            </option>
          ${types
            .map(function (type) {
              return `<option value="${type}">${parseWorkspaceType(type)}</option>`;
            })
            .join('')}        
          </select>
        </div>
    `;

  return div;
}

function createWorkspaceForm(availableWorkspaceTypes, propertyId) {
  const form = document.createElement('form');
  form.id = 'workspace-registration-form';

  form.innerHTML = `<img class="property-image-preview hidden">`;

  form.innerHTML += createWorkspaceTypesSelector(
    availableWorkspaceTypes
  ).outerHTML;
  form.innerHTML += `
    
    <div class="form-content">
      <div class="input-container">
        <label class="base-button" for="lease-term">Lease term</label>
        <select class="space-to-fill" name="leaseTerm" id="lease-term" required>
            <option disabled selected value="">Select an option</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
        </select>
      </div>
    </div>
    <div class="form-content">
      <div class="input-container">
        <label class="base-button" for="name">Name</label>
        <input type="text" class="space-to-fill" id="name" name="name"
              placeholder="Add the workspace name" required />
      </div>
    </div>    
    <div class="form-content">
      <div class="input-container">
        <label class="base-button" for="places">Places available</label>
        <input type="number" class="space-to-fill" id="places" name="places"
              placeholder="Add the total spaces available" required/>
      </div>
      <div class="input-container">
        <label class="base-button" for="price">Price</label>
        <input type="number" class="space-to-fill" id="price" name="price" required />
      </div>
    </div>
    <div class="form-content">
      <div class="input-container">
        <label class="base-button">Is smoking allowed?</label>
        <div>
            <input type="radio" name="isSmokingAllowed" id="isSmokingAllowed_yes" value="1" required />
            <label class="double-choice" for="isSmokingAllowed_yes">Yes</label>
        </div>
        <div>
            <input type="radio" name="isSmokingAllowed" id="isSmokingAllowed_no" value="0" required />
            <label class="double-choice" for="isSmokingAllowed_no">No</label>
        </div>
      </div>
    </div>
    <div class="form-content">
      <div class="input-container">
        <label class="base-button" for="property-image">Images</label>
        <span class="space-to-fill" id="uploaded-file-name">
              Select an Image for the Workspace</span>
        <img class="upload-btn-image" src="../../assets/svg/upload.svg" alt="Upload Image" />
        <input type="file" id="upload-image-input" name="image" class="hidden" accept=".jpg,.jpeg,.png" />
      </div>
    </div>
    <input type="hidden" name="propertyId" value="${propertyId}">
    <input type="hidden" name="workspaceId">
    <button id="send-button" class="base-button form-submit" type="submit">
        Save
    </button>
    `;

  return form;
}

document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(location.search);
  const propertyId = urlParams.get('propertyId');
  const workspaceId = urlParams.get('workspaceId');

  const main = document.getElementsByTagName('main')[0];

  let propertyData;
  let workspaceData;
  if (propertyId) {
    propertyData = await getPropertyInfo(propertyId);

    const pageTitle = document.getElementsByClassName('page-title')[0];
    pageTitle.innerHTML = `Add Workspace to <span class="property-name-title">${propertyData.buildingName}</span> property`;
  } else if (workspaceId) {
    workspaceData = await getWorkspaceInfo(workspaceId, userData.userId);

    if (!workspaceData) {
      window.location.assign(`${baseUrl}/404.html`);

      return;
    }

    propertyData = await getPropertyInfo(workspaceData.propertyId);
  }

  main.append(
    createWorkspaceForm(
      propertyData.workspaceTypes,
      propertyId || workspaceData.propertyId
    )
  );

  if (workspaceData) {
    const workspaceRegistrationForm = document.getElementById(
      'workspace-registration-form'
    );
    const imagePreview = document.querySelector('.property-image-preview');
    imagePreview.src = workspaceData.image;
    imagePreview.alt = workspaceData.name;
    imagePreview.classList.remove('hidden');

    workspaceRegistrationForm.elements.name.value = workspaceData.name;
    workspaceRegistrationForm.elements.places.value = workspaceData.places;
    workspaceRegistrationForm.elements.price.value = workspaceData.price;
    workspaceRegistrationForm.elements.leaseTerm.value =
      workspaceData.leaseTerm;
    workspaceRegistrationForm.elements.type.value = workspaceData.type;
    workspaceRegistrationForm.elements.propertyId.value =
      workspaceData.propertyId;
    workspaceRegistrationForm.elements.workspaceId.value = workspaceData.id;

    if (workspaceData.isSmokingAllowed) {
      workspaceRegistrationForm.elements.isSmokingAllowed_yes.checked = true;
    } else {
      workspaceRegistrationForm.elements.isSmokingAllowed_no.checked = true;
    }

    setLoaderVisibility(false);
  }

  const uploadImageBtn = document.querySelector('.upload-btn-image');
  const uploadFileInput = document.querySelector('#upload-image-input');
  const imagePreview = document.querySelector('.property-image-preview');

  if (uploadImageBtn) {
    uploadImageBtn.addEventListener('click', function () {
      uploadFileInput.click();
    });
  }

  if (uploadFileInput) {
    uploadFileInput.addEventListener('change', function () {
      if (this.files.length) {
        const reader = new FileReader();
        reader.onload = function () {
          imagePreview.src = reader.result;
          imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(this.files[0]);
      } else {
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
      }

      document.querySelector('#uploaded-file-name').textContent =
        this.files[0]?.name || 'Select an Image for the Workspace';
    });
  }

  const form = document.getElementById('workspace-registration-form');
  form.addEventListener('submit', async function (event) {
    setLoaderVisibility(true);
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    let workspaceExists;
    if (formData.workspaceId) {
      const workspace = await getWorkspaceInfo(
        formData.workspaceId,
        userData.userId
      );

      if (!workspace) {
        window.location.assign(`${baseUrl}/404.html`);

        return;
      }

      workspaceExists = workspace;
    }

    if (!formData.image.size && !workspaceExists) {
      alert('Please select an image for the workspace');
      setLoaderVisibility(false);
      return;
    }

    try {
      let imageUrl = '';

      if (formData.image.size > 0) {
        imageUrl = await uploadImage(formData.image);

        if (!imageUrl) {
          throw new Error('Image not uploaded');
        }
      }

      const newWorkspace = {
        ...formData,
        isSmokingAllowed: Boolean(Number(formData.isSmokingAllowed)),
        image: imageUrl || workspaceExists.image,
        ownerId: userData.userId,
        workspaceId,
      };

      if (workspaceExists) {
        await updateWorkspace(newWorkspace);
      } else {
        await createWorkspace(newWorkspace);
      }

      window.location.assign(
        `${baseUrl}workspaces/?propertyId=${newWorkspace.propertyId}`
      );
    } catch (error) {
      setLoaderVisibility(false);
    }
  });
});
