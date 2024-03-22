import { userData } from "../../scripts/session.js";
import { addPageOperations, propertyType } from "../../scripts/script.js";
import { fetchWorkspaces } from "../../scripts/api.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";

function addWorkspace(workspaceData, sessionState) {
  const workspace = document.createElement("div");
  workspace.classList.add("workspace");

  const imageSrc = workspaceData.image.includes("http")
    ? workspaceData.image
    : `../../images/${workspaceData.image}`;

  workspace.innerHTML = `
                      <div class="workspace-container">
                        <h2 class="workspace-title">${workspaceData.name}</h2>
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
                            <div class="icons-container">
                              ${isSmokingAllowed(
                                workspaceData.smokingIsAllowed
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

  if (userData && userData?.role == "owner") {
    workspace.innerHTML += `
            <a href="/register-workspace/workspaceId=${workspaceData.id}" class="check-button">Edit</a>
        `;
  } else {
    workspace.innerHTML += `
        <a href="/pages/booking/?workspaceId=${workspaceData.id}" class="check-button">Book Now</a>
    `;
  }
  return workspace;
}

const isSmokingAllowed = (isSmokingAllowed) => {
  return isSmokingAllowed
    ? "<img src='../../assets/svg/smoking-allowed.svg' class='svg-icon'/>"
    : "<img src='../../assets/svg/smoking-not-allowed.svg' class='svg-icon'/>";
};

document.addEventListener("DOMContentLoaded", async function () {
  // addPageOperations(userData, "register-workspace");

  const workspaceSection = document.querySelector(".spaces-section");

  const params = new URLSearchParams(location.search);
  const propertyId = params.get("propertyId");

  console.log(propertyId);
  if (propertyId) {
    setLoaderVisibility(true);
    const spaces = await fetchWorkspaces(propertyId);

    console.log(spaces);

    if (!spaces?.length) {
      workspaceSection.innerHTML =
        "<p>There are no workspaces available for this property</p>";
      return;
    }

    spaces.forEach((workspace) =>
      workspaceSection.append(addWorkspace(workspace))
    );

    setLoaderVisibility(false);
  } else {
    console.log("Nenhuma propriedade selecionada");
  }
});
