
import { getWorkspaceInfo, getBookingInfo } from "../../scripts/api.js";



document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(location.search);
    const bookingID = params.get("bookingId");

   

  const bookingInfo = await getBookingInfo(bookingID);
 const workspaceInfo = await getWorkspaceInfo(bookingInfo.workspaceId)
 
  
 const workspaceBookingConfirmation = document.createElement("div");
  workspaceBookingConfirmation.id = "workspace-booking-confirmation";

  workspaceBookingConfirmation.innerHTML = `
        <h2>Congrats for choose the ${workspaceInfo.name}
        </h2>
        <div>
            <img src="../../images/${workspaceInfo.image}" /></div>
        <div>
            <p>
                The cowork that you lease for  a ${workspaceInfo.leaseTerm} is a ${workspaceInfo.type} with ${workspaceInfo.places} place(s).
            </p>
            <p>The lease will start on ${bookingInfo["booking-date-from"]} and end on ${bookingInfo["booking-date-from"]}.</p>
            <p>The price for the rent is ${workspaceInfo.price}. </p>
            <p>You'll receive an e-mail with all details and directions for payment.</p>
        </div>
        `;


        const main = document.getElementsByTagName("main")[0];
        main.append(workspaceBookingConfirmation);


})
    








