// gameboard.js
// @ts-check

import Ship from "./ship.js"
import Utils from "./utils.js"


/**
 * @class GameBoard
 * @classdesc gameboard module to control the placement of ships and register attacks
 * on the board
 * */
class GameBoard {
  #height
  #width
  #playerShips
  #computerShips
  /**@type {Array<Array>} */
  #playerBoard
  /** @type {Array<Array>} */
  #computerBoard

  /**
   * @constructor
   * @param {number} [height=14] height of the board (default 14) 
   * @param {number} [width=14] width of the board (default 14)
   * */
  constructor(height = 14, width = 14) {
    this.#height = height;
    this.#width = width;
    this.#playerShips = [] // an array containing a list of Ship objects
    this.#computerShips = [] // an array for the computer's Ship objects
    this.#playerBoard = [] // Array of arrays represing the board
    this.#computerBoard = []
    this.#fillTheBoard(this.#playerBoard)
    this.#fillTheBoard(this.#computerBoard)
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get playerBoard() {
    return this.#playerBoard
  }

  get computerBoard() {
    return this.#computerBoard
  }

  get playerShips() {
    return this.#playerShips
  }

  get computerShips() {
    return this.#computerShips
  }

  /**
   * @method helper function to fill the boards and initialize it
   * @param {Array<Array>} board 
   * */
  #fillTheBoard(board) {
    for (let i = 0; i < this.#height; i++) {
      let arr = new Array(14);
      arr = arr.fill(0)
      board.push(arr)
    }
  }

  /**
   * @method to place the ship on the board
   * @param {Ship} ship 
   * @param {Array<number>} start - start between 0 and width or height - length 
   * @param {Array<Array>} board - The board where the ship should be placed (computer or player)
   * @returns {boolean}
   * */
  placeShip(ship, start, board) {
    if (!this.#checkBoundaries(ship, start, board)) return false

    // Check for collision
    // WARNING: Take care that ships can't overlap
    let coords = Utils.getCoordinatesFromPoint(start, ship.length, ship.orientation)
    if (Utils.isInteresect(coords, board))
      return false;

    // if Ship is not initiated with coordinates assign calculated ones
    if(ship.coordinates.length <= 0){
      ship.coordinates = Utils.initCoords(coords);
    }

    // WARN: player board and computer board are distinct
    // NOTE Assess where the ship should be located on the board
    // NOTE horizontal on the x axis, i.e the inner array
    // NOTE vertical on the y axis
    if (board === this.playerBoard) {
      // fill player board with 1 for occupied
      for (let i = 0; i < ship.length; i++) {
        if (ship.orientation === 'horizontal') {
          this.playerBoard[start[0]][start[1] + i] = 1
        } else if (ship.orientation === 'vertical') {
          this.playerBoard[start[0] + i][start[1]] = 1
        }
      }
      // add ship to player fleet
      // NOTE Add the ship to the corresponding ship tables
      this.#playerShips.push(ship)
    }
    if (board === this.computerBoard) {
      // fill computer board
      for (let i = 0; i < ship.length; i++) {
        if (ship.orientation === 'horizontal') {
          this.computerBoard[start[0]][start[1] + i] = 1
        } else if (ship.orientation === 'vertical') {
          this.computerBoard[start[0] + i][start[1]] = 1
        }
      }

      // NOTE: add ship to computer's fleet
      this.#computerShips.push(ship)
    }
    return true;
  }

  /**
   * helper method to check if the ship falls into boundary
   * @param {Ship} ship 
   * @param {Array<number>} start 
   * @param {Array<Array>} board 
   * */
  #checkBoundaries(ship, start, board) {
    if (ship.orientation === 'horizontal') {
      if (start[1] + ship.length > board[0].length) {
        return false
      }
    }

    if (ship.orientation === 'vertical') {
      if (start[0] + ship.length > board.length) {
        return false
      }
    }
    return true
  }

  /**
   * @method to receive the attack on the board
   * @param {Array<number>} coords 
   * @param {Array<Array>} board 
   * */
  receiveAttack(coords, board) {
    // TODO: receive an attack on the board and calculate 
    // hits and misses according to each player

  }

  /**
   * @method to return whether all the ships have been sunk
   * @param {*} player - The player whose fleet to be checked 
   * @returns {boolean}
   * */
  shipsSunk(player) {
    // TODO: check the player fleet for whether his fleet has been sunk
    return false;
  }
}

/** @module GameBoard */
export default GameBoard;
