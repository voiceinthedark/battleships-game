// square.js
// @ts-check

/**
 * @class Square
 * @classdesc Represents the coordinates of the square on the board
 * */
class Square {
  #x
  #y
  #hit

  /**
   * @constructor
   * @param {number} [x=0] - the x coordinate on the board
   * @param {number} [y=0] - the y coordinate on the board
   * @param {boolean} [hit=false] - whether the coordinate is hit or not
   * */
  constructor(x = 0, y = 0, hit = false) {
    this.#x = x
    this.#y = y
    this.#hit = hit
  }

  /**
   * Return the x coordinate
   * @returns {number}
   * */
  get x() {
    return this.#x
  }

  /**
   * Returns the y coordinate
   * @returns {number}
   * */
  get y() {
    return this.#y
  }

  /**
   * Return whether the coordinate is hit or not
   * @returns {boolean}
   * */
  isHit() {
    return this.#hit
  }

  /**
   * Set the hit property of the square
   * @param {boolean} val
   * */
  set hit(val) {
    this.#hit = val
  }

  get [Symbol.toStringTag]() {
    return `Square { x: ${this.#x}, y: ${this.#y} - isHit: ${this.#hit} }`
  }
}

/** @module Square */
export default Square
