import { userData } from "../../scripts/session.js";
import { addPageOperations } from "../../scripts/script.js";

document.addEventListener("DOMContentLoaded", function () {
  addPageOperations(userData, "register-property");
});
