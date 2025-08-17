// import AppController from "modules/appcontroller.js";
// import "./styles/styles.css";
// import "./styles/fontawesome.min.css";
// import "./styles/regular.min.css";
// import "./styles/solid.min.css";
// import "./styles/brands.min.css";

import Ship from "./modules/ship.js";
import Utils from "./modules/utils.js";

// const appContainer = document.getElementById("container");
//
// async function runApp() {
//
// }
//
// runApp();

let s = new Ship('Carrier', 5, 'vertical', Utils.getCoordinatesFromPoint([3, 3], 5, 'vertical'))
console.log(s)
