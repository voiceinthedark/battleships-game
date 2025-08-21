import AppController from "./modules/appcontroller.js";
import "./styles/styles.css"
// import "./styles/fontawesome.min.css";
// import "./styles/regular.min.css";
// import "./styles/solid.min.css";
// import "./styles/brands.min.css";

// import Utils from './modules/utils.js'
import Player from './modules/player.js'
import GameBoard from './modules/gameboard.js'
// import Game from './modules/game.js'



let g = new GameBoard()
let p = new Player('player', g.playerBoard)
let c = new Player('computer', g.computerBoard)
// let game = new Game(g, p, c);

let obj = [
  { length: 6, orientation: 'horizontal' },
  { length: 5, orientation: 'vertical' },
  { length: 5, orientation: 'horizontal' },
  { length: 4, orientation: 'vertical' },
  { length: 4, orientation: 'horizontal' },
  { length: 3, orientation: 'horizontal' },
  { length: 3, orientation: 'vertical' },
  { length: 2, orientation: 'vertical' },
  { length: 2, orientation: 'horizontal' },
]

// Utils.populateBoardRandomly(g, obj, p)
// Utils.populateBoardRandomly(g, obj, c)
// p.ships = g.playerShips
// c.ships = g.computerShips

// game.run()
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById("container");

  if (!appContainer) {
    console.error("Error: HTML element with ID 'container' not found. Ensure your HTML has an element like <div id=\"container\"></div>.");
    return;
  }

  function runApp() {
    const appcontroller = new AppController(appContainer)
    appcontroller.setBoard(g, p, c)
    appcontroller.setControlPane(g, obj, p, c)
    // appcontroller.setBoard(c)
  }

  runApp();
});

