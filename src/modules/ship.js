// ship.js
// @ts-check

import Square from "./square.js"
import Utils from "./utils.js"

/**
 * @class
 * @classdesc Ship module that contain data for the ship objects
 * */
class Ship {
  #name
  #length
  #hits
  #orientation
  /**
   * coordinates of the ship
   * an array of objects of the form {x: number, y: number, hit: boolean}
   * @type {Array<Square>} */
  #coordinates

  /**@constructor
   * @param {string} name - name of the ship (Carrier, battleship etc.)
   * @param {number} length - length of the ship, how many squares it occupies
   * @param {string} [orientation='horizontal'] - orientation of the ship (default: horizontal)
   * @param {Array[]} [coordinates=[]] - coordinates of the ship on the board 
   * */
  constructor(name, length, orientation = 'horizontal', coordinates = []) {
    this.#name = name
    this.#length = length
    this.#hits = 0
    this.#orientation = orientation
    // initialize Square[]
    this.#coordinates = Utils.initCoords(coordinates)
  }

  /**
   * Get the name of the ship (Carrier, battleship etc.)
   * @returns {string}
   * */
  get name() {
    return this.#name
  }

  /**
   * Get the length of the ship in square units
   * @returns {number}
   * */
  get length() {
    return this.#length
  }

  /**
   * Get the orientation of the ship, whether horizontal or vertical
   * @returns {string}
   * */
  get orientation() {
    return this.#orientation
  }

  /**
   * @method getter for the coordinates of the ship
   * an array of objects of the form {x: number, y: number, hit: boolean}
   * @returns {Array<Square>}
   * */
  get coordinates() {
    return this.#coordinates
  }

  /**
   * Set the coordinates of the ship
   * @param {Array<Square>} val 
   * */
  set coordinates(val) {
    this.#coordinates = val
  }

  /**
   * @method to simulate battle ship being hit
   * @param {Array<number>} [coords=[]] - the coordinate that was hit
   * @returns {boolean}
   * */
  hit(coords = []) {
    if(coords.length <= 0) return false;
    let idx = this.#coordinates.findIndex(
      (s) => s.x === coords[0] && s.y === coords[1])
    if (idx >= 0 && !this.coordinates[idx].isHit()) {
      this.#coordinates[idx].hit = true // set the hit property of the square
      this.#hits++;
      return true;
    }
    return false
  }

  /**
   * @method to assert whether the ship has been sunk or not
   * @returns {boolean}
   * */
  isSunk() {
    if (this.#hits < this.#length)
      return false
    return true
  }
}

/**@module Ship */
export default Ship;
