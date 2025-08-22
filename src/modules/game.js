// game.js
// @ts-check
/**
   * result returned after playing a turn
   * @typedef Result
   * @property {boolean} hit
   * @property {boolean} gameOn
   * @property {string} winner
   * @property {Array<number>} [coordinates] - the coordinates attacked
   * @property {string} [error] - error message if turn is invalid
   * */

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

  /**
   * @method run to start a game simulation
   * */
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

  

  /**
   * @method playTurn to let the player/computer play a turn
   * @param {Player} player - the player whose turn to play 
   * @param {Array} [coordinates=null] - the coordinates of the attack of the player exclusively
   * @returns {Result} result - an object containing, hit, gameOn, and winner if any
   * */
  playTurn(player, coordinates = null) {
    let coords;
    let hit = false
    let gameOn = true
    let winner = ''
    // Computer turn
    if (player.name === 'computer') {
      coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
      while (this.#player.board[coords[0]][coords[1]] === -1 || this.#player.board[coords[0]][coords[1]] === 9) {
        coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)]
      }
      hit = this.#gameboard.receiveAttack(coords, this.#player.board)
      if (this.#gameboard.shipsSunk(this.#player.ships)) {
        // game over computer wins
        gameOn = false
        winner = 'computer'
      }
      return { hit, gameOn, winner, coordinates: coords }
    }
    // Player turn
    if (player.name === 'player') {
      if (!coordinates) {
        console.error('Player should provide coordinates');
        return { hit: false, gameOn: true, winner: '', error: 'no coordinates provided' }
      }

      coords = coordinates.map((n) => parseInt(n))
      if (this.#computer.board[coords[0]][coords[1]] === -1
        || this.#computer.board[coords[0]][coords[1]] === 9) {
        console.log(`already attacked cell ${coords}`)
        return { hit: false, gameOn: true, winner: '', coordinates: coords, error: "Already attacked" }
      }
      // NOTE attack the cell otherwise
      hit = this.#gameboard.receiveAttack(coords, this.#computer.board);
      if (this.#gameboard.shipsSunk(this.#computer.ships)) {
        gameOn = false;
        winner = 'player';
      }
      return { hit, gameOn, winner, coordinates: coords };
    }
    return { hit: false, gameOn: true, winner: '', error: 'Unknown player type' };
  }

}

export default Game;
