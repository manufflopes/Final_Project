import { userData } from "../../scripts/session.js";
import { addPageOperations, propertyType } from "../../scripts/script.js";
import { fetchWorkspaces } from "../../scripts/api.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";

function addWorkspace(workspaceData, userSessionData) {
  const workspace = document.createElement("div");
  workspace.classList.add("workspace");

  const isTheOwner =
    userSessionData?.role == "owner" &&
    userSessionData?.userId == workspaceData.ownerId;

  const imageSrc = workspaceData.image.includes("http")
    ? workspaceData.image
    : `../../images/${workspaceData.image}`;

  workspace.innerHTML = `
                      <div class="workspace-container">
                        <h2 class="workspace-title">
                          ${workspaceData.name}
                          ${
                            isTheOwner
                              ? `<span class="manage" data-workspace-id="${workspaceData.id}">
                                  <img src="../../assets/setting.png" class="manage-icon" />
                                </span>`
                              : ""
                          }
                        </h2>
                        <img class="workspace-image" src="${imageSrc}" />
                        <div class="workspace-info">
                          <div class="info-container">
                            <label>Price:</label>
                            <span>
                              ${new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(workspaceData.price)}
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Lease Term:</label>
                            <span>
                              ${
                                workspaceData.leaseTerm
                                  .charAt(0)
                                  .toUpperCase() +
                                workspaceData.leaseTerm.slice(1)
                              }
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Availability Date</label>
                            <span>
                              ${new Date(
                                workspaceData.availabilityDate
                              ).toLocaleDateString("en-CA")}
                            </span>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Smoking rule</label>
                            <div class="icons-container">
                              ${isSmokingAllowed(
                                workspaceData.isSmokingAllowed
                              )}
                            </div>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Workspace Type</label>
                            <div class="icons-container">
                              ${propertyType(workspaceData.type, "../../")}
                            </div>
                          </div>
                        </div>
                      </div>`;

  // if (sessionState && sessionState?.role == "owner") {
  //   workspace.innerHTML += `
  //           <a href="/register-workspace/workspaceId=${workspaceData.id}" class="check-button">Edit</a>
  //       `;
  // } else {
  //   workspace.innerHTML += `
  //       <a href="/pages/booking/?workspaceId=${workspaceData.id}" class="check-button">Book Now</a>
  //   `;
  // }
  return workspace;
}

const isSmokingAllowed = (isSmokingAllowed) => {
  console.log(isSmokingAllowed);
  return isSmokingAllowed
    ? "<img src='../../assets/svg/smoking-allowed.svg' class='svg-icon'/>"
    : "<img src='../../assets/svg/smoking-not-allowed.svg' class='svg-icon'/>";
};

document.addEventListener("DOMContentLoaded", async function () {
  const workspaceSection = document.querySelector(".spaces-section");

  const params = new URLSearchParams(location.search);
  const propertyId = params.get("propertyId");

  addPageOperations(userData, "register-workspace/?propertyId=" + propertyId);

  console.log(propertyId);
  if (propertyId) {
    setLoaderVisibility(true);
    const spaces = await fetchWorkspaces(propertyId);

    console.log("spaces", spaces);

    if (!spaces?.length) {
      const noContentSection = document.querySelector(".no-content-available");
      noContentSection.innerHTML =
        "<p class='none-available'>There are not workspaces available for this property</p>";
      setLoaderVisibility(false);
      return;
    }

    spaces.forEach((workspace) =>
      workspaceSection.append(addWorkspace(workspace, userData))
    );

    const manageIcons = document.querySelectorAll(".manage");

    manageIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const workspaceId = icon.dataset.workspaceId;
        window.location.assign(
          `/pages/register-workspace/?workspaceId=${workspaceId}`
        );
      });
    });

    setLoaderVisibility(false);
  } else {
    console.log("Nenhuma propriedade selecionada");
  }
});
