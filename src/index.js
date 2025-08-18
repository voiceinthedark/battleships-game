// import AppController from "modules/appcontroller.js";
// import "./styles/styles.css";
// import "./styles/fontawesome.min.css";
// import "./styles/regular.min.css";
// import "./styles/solid.min.css";
// import "./styles/brands.min.css";

import Ship from './modules/ship.js'
import Utils from './modules/utils.js'
import Player from './modules/player.js'
import GameBoard from './modules/gameboard.js'

// const appContainer = document.getElementById("container");
//
// async function runApp() {
//
// }
//
// runApp();

let g = new GameBoard()
let p = new Player('player', g.playerBoard)
let c = new Player('computer', g.computerBoard)

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

Utils.populateBoardRandomly(g, obj, p)
Utils.populateBoardRandomly(g, obj, c)
p.ships = g.playerShips
c.ships = g.computerShips

p.printBoard()
console.log(p.ships)
c.printBoard()
console.log(c.ships)
