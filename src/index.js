// import AppController from "modules/appcontroller.js";
// import "./styles/styles.css";
// import "./styles/fontawesome.min.css";
// import "./styles/regular.min.css";
// import "./styles/solid.min.css";
// import "./styles/brands.min.css";

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


// event loop
let gameOn = true;
p.turn = true;
c.turn = false;
let coords;
let hit;
let loops = 0

while (gameOn) {
  loops++
  if (p.turn) {
    coords = [Math.floor(Math.random() * g.height), Math.floor(Math.random() * g.width)]
    hit = g.receiveAttack(coords, g.computerBoard)
    p.turn = false
    c.turn = true
    if (hit) {
      console.log(`${p.name} scored a hit at ${coords}`)
    } else {
      console.log(`${p.name} missed at ${coords}`)
    }
  }
  if (c.turn) {
    coords = [Math.floor(Math.random() * g.height), Math.floor(Math.random() * g.width)]
    hit = g.receiveAttack(coords, g.playerBoard)
    c.turn = false
    p.turn = true
    if (hit) {
      console.log(`${c.name} scored a hit at ${coords}`)
    } else {
      console.log(`${c.name} missed at ${coords}`)
    }
  }

  if (g.shipsSunk(p.ships)) {
    gameOn = false
    console.log(`${c.name} wins the game by sinking the entire fleet of ${p.name}`)
    console.log(`${c.name} had ${c.ships.filter(s => !s.isSunk()).length} ship(s) left`)
    console.log(`Game finished in ${loops} turns`)
    console.log(`${p.name} board:`)
    Utils.printBoard(p.board)
    console.log(`${c.name} board:`)
    Utils.printBoard(c.board)
  } else if (g.shipsSunk(c.ships)) {
    gameOn = false
    console.log(`${p.name} wins the game by sinking the entire fleet of ${c.name}`)
    console.log(`${p.name} had ${p.ships.filter(s => !s.isSunk()).length} ship(s) left`)
    console.log(`Game finished in ${loops} turns`)
    console.log(`${p.name} board:`)
    Utils.printBoard(p.board)
    console.log(`${c.name} board:`)
    Utils.printBoard(c.board)
  }
}
