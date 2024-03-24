
import { getMyBookings } from "../../scripts/api.js";
import{setLoaderVisibility} from "../../scripts/domBuilder.js"
import{userData} from "../../scripts/session.js"



document.addEventListener("DOMContentLoaded", async function () {
    setLoaderVisibility(true)
    

   

  
 
  
 const myBookings = document.createElement("div");
 myBookings.id = "my-bookings";
const bookings = await getMyBookings(userData.userId)
if(!bookings.length){
return
}


 myBookings.innerHTML = bookings.map(booking => {
    return `
        <div>
            <strong>Reference: </strong>${booking.id}
            <strong>Date: </strong>${booking["booking-date-from"]}
        </div>
    `
 }).join("")


        const main = document.getElementsByTagName("main")[0];
        main.append(myBookings);


        setLoaderVisibility(false)
})
    







