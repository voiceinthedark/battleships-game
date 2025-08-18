// game.js
// @ts-check

import GameBoard from "./gameboard.js";
import Player from "./player.js";
import Utils from "./utils.js";


class Game {
  #gameboard
  #player
  #computer

  /**
   * @constructor
   * @param {GameBoard} gameboard 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  constructor(gameboard, player, computer) {
    this.#gameboard = gameboard
    this.#player = player
    this.#computer = computer
  }

  run() {
    // event loop
    let gameOn = true;
    this.#player.turn = true;
    this.#computer.turn = false;
    let coords;
    let hit;
    let loops = 0

    while (gameOn) {
      loops++
      if (this.#player.turn) {
        coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
        // PERF: increase efficiency by double by skipping already missed cells
        while (this.#computer.board[coords[0]][coords[1]] === -1) {
          coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
        }
        hit = this.#gameboard.receiveAttack(coords, this.#gameboard.computerBoard)
        this.#player.turn = false
        this.#computer.turn = true
        if (hit) {
          console.log(`${this.#player.name} scored a hit at ${coords}`)
        } else {
          console.log(`${this.#player.name} missed at ${coords}`)
        }
      }
      if (this.#computer.turn) {
        coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
        while (this.#player.board[coords[0]][coords[1]] === -1) {
          coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
        }
        hit = this.#gameboard.receiveAttack(coords, this.#gameboard.playerBoard)
        this.#computer.turn = false
        this.#player.turn = true
        if (hit) {
          console.log(`${this.#computer.name} scored a hit at ${coords}`)
        } else {
          console.log(`${this.#computer.name} missed at ${coords}`)
        }
      }

      if (this.#gameboard.shipsSunk(this.#player.ships)) {
        gameOn = false
        console.log(`${this.#computer.name} wins the game by sinking the entire fleet of ${this.#player.name}`)
        console.log(`${this.#computer.name} had ${this.#computer.ships.filter(s => !s.isSunk()).length} ship(s) left`)
        console.log(`Game finished in ${loops} turns`)
        console.log(`${this.#player.name} board:`)
        Utils.printBoard(this.#player.board)
        console.log(`${this.#computer.name} board:`)
        Utils.printBoard(this.#computer.board)
      } else if (this.#gameboard.shipsSunk(this.#computer.ships)) {
        gameOn = false
        console.log(`${this.#player.name} wins the game by sinking the entire fleet of ${this.#computer.name}`)
        console.log(`${this.#player.name} had ${this.#player.ships.filter(s => !s.isSunk()).length} ship(s) left`)
        console.log(`Game finished in ${loops} turns`)
        console.log(`${this.#player.name} board:`)
        Utils.printBoard(this.#player.board)
        console.log(`${this.#computer.name} board:`)
        Utils.printBoard(this.#computer.board)
      }
    }
  }
}

export default Game;
