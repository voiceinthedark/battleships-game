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
   * @param {Player} attackingPlayer - the player whose turn to play 
   * @param {Player} targetPlayer 
   * @param {Array} [coordinates=null] - the coordinates of the attack of the player exclusively
   * @param {string} [gamemode='single'] - The gamemode of the game
   * @returns {Result} result - an object containing, hit, gameOn, and winner if any
   * */
  playTurn(attackingPlayer, targetPlayer, coordinates = null, gamemode = 'single') {
    let coords;
    let hit = false
    let gameOn = true
    let winner = ''

    if (gamemode === 'two') {
      if (!coordinates) {
        console.error('Coordinates must be provided in two-player mode.');
        return { hit: false, gameOn: true, winner: '', error: 'no coordinates provided' };
      }
      coords = coordinates.map((n) => parseInt(n));
      // Check if the cell on the target player's board has already been attacked
      if (targetPlayer.board[coords[0]][coords[1]] === -1 || targetPlayer.board[coords[0]][coords[1]] === 9) {
        console.log(`Cell ${coords} on ${targetPlayer.name}'s board already attacked.`);
        return { hit: false, gameOn: true, winner: '', coordinates: coords, error: "Already attacked" };
      }
      hit = this.#gameboard.receiveAttack(coords, targetPlayer.board);
      if (this.#gameboard.shipsSunk(targetPlayer.ships)) {
        gameOn = false;
        winner = attackingPlayer.name; // The attacking player wins
      }
      return { hit, gameOn, winner, coordinates: coords };
    } else { // Single player mode
      if (attackingPlayer.name === 'player') { // Human player turn in single player
        if (!coordinates) {
          console.error('Player should provide coordinates');
          return { hit: false, gameOn: true, winner: '', error: 'no coordinates provided' }
        }
        coords = coordinates.map((n) => parseInt(n))
        if (targetPlayer.board[coords[0]][coords[1]] === -1 || targetPlayer.board[coords[0]][coords[1]] === 9) {
          console.log(`already attacked cell ${coords}`)
          return { hit: false, gameOn: true, winner: '', coordinates: coords, error: "Already attacked" }
        }
        hit = this.#gameboard.receiveAttack(coords, targetPlayer.board); // Player attacks computer's board
        if (this.#gameboard.shipsSunk(targetPlayer.ships)) { // Check if computer's ships are sunk
          gameOn = false;
          winner = attackingPlayer.name;
        }
        return { hit, gameOn, winner, coordinates: coords };
      } else if (attackingPlayer.name === 'computer') { // Computer turn in single player
        coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)];
        // Ensure computer doesn't attack already attacked cells
        while (targetPlayer.board[coords[0]][coords[1]] === -1 || targetPlayer.board[coords[0]][coords[1]] === 9) {
          coords = [Math.floor(Math.random() * this.#gameboard.height), Math.floor(Math.random() * this.#gameboard.width)];
        }
        hit = this.#gameboard.receiveAttack(coords, targetPlayer.board); // Computer attacks player's board
        if (this.#gameboard.shipsSunk(targetPlayer.ships)) { // Check if player's ships are sunk
          gameOn = false;
          winner = attackingPlayer.name;
        }
        return { hit, gameOn, winner, coordinates: coords };
      }
    }
    return { hit: false, gameOn: true, winner: '', error: 'Unknown player type or game mode' };
  }

}

export default Game;
