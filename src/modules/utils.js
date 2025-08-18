// utils.js
// @ts-check

import GameBoard from './gameboard.js'
import Player from './player.js'
import Ship from './ship.js'
import Square from './square.js'

/**
 * @class Utils
 * @classdesc helper class
 * */
class Utils {
  constructor() {}
  /**
   * initialize the coordinates into an array of Sqaures
   * @param {Array<Array>} coords
   * @returns {Array<Square>}
   * */
  static initCoords(coords) {
    let res = []

    for (let c of coords) {
      res.push(new Square(c[0], c[1]))
    }
    return res
  }

  /**
   * helper function to extract coordinates of a ship
   * @param {Array<number>} point - The starting location of the ship
   * @param {number} length - the length of the ship
   * @param {string} orientation - the orientation of the ship
   * @returns {Array<Array>}
   * */
  static getCoordinatesFromPoint(point, length, orientation) {
    let res = []
    for (let i = 0; i < length; i++) {
      if (orientation === 'horizontal') {
        res.push([point[0], point[1] + i])
      }
      if (orientation === 'vertical') {
        res.push([point[0] + i, point[1]])
      }
    }
    return res
  }

  /**
   * helper method to check if the set of coordinates collides with others on the board
   * @param {Array<Array>} coords
   * @param {Array<Array>} board
   * @returns {boolean}
   * */
  static isInteresect(coords, board) {
    return coords.some((c) => {
      if (board[c[0]][c[1]] === 1) {
        return true
      }
      return false
    })
  }

  /**
   * helper method to return the point of collision on the board
   * @param {Array<Array>} coords
   * @param {Array<Array>} board
   * @returns {Array | null}
   * */
  static pointOfCollision(coords, board) {
    if (!this.isInteresect(coords, board)) return null

    return coords.filter((c) => board[c[0]][c[1]] === 1).pop()
  }

  /**
   * @method helper function to fill the boards and initialize it
   * @param {Array<Array>} board
   * @param {number} height
   * @param {number} width
   * */
  static fillTheBoard(board, height, width) {
    for (let i = 0; i < height; i++) {
      let arr = new Array(width)
      arr = arr.fill(0)
      board.push(arr)
    }
  }

  /**
   * Method to populate the board at random coords, it accepts an array of Objects with length and orientation
   * @param {GameBoard} gameboard
   * @param {Object[]} objects
   * @param {number} objects[].length - length of the ship
   * @param {string} objects[].orientation - orientation of the ship
   * @param {Player} player
   * */
  static populateBoardRandomly(gameboard, objects, player) {
    // PERF: using set instead of an array for efficiency
    let occupied = new Set()
    for (let o of objects) {
      let start
      let coords
      let coordsStr
      let collision

      do {
        start = this.generateCoordinatePoint(gameboard, o.length, o.orientation)
        coords = this.getCoordinatesFromPoint(start, o.length, o.orientation)
        coordsStr = coords.map((c) => c.toString()) // Convert coordinate arrays to strings

        // Check for collisions with previously occupied cells
        collision = coordsStr.some((cStr) => occupied.has(cStr))

        const outOfBounds = coords.some(
          ([r, c]) =>
            r < 0 || r >= gameboard.height || c < 0 || c >= gameboard.width
        )
        if (outOfBounds) {
          collision = true // Mark as collision if out of bounds
        }
      } while (collision) // Keep generating until no collision and within bounds

      coords.forEach((c) => occupied.add(c.toString())) // Add the new ship's coordinates (as strings) to the occupied set
      gameboard.placeShip(
        new Ship('a1', o.length, o.orientation, coords),
        start,
        player.board
      )
    }
  }

  /**
   * Generate coordinate point
   * @param {GameBoard} gameboard
   * @param {number} len
   * @param {string} orientation
   * @returns {number[]}
   * */
  static generateCoordinatePoint(gameboard, len, orientation) {
    let maxh, maxw
    switch (orientation) {
      case 'horizontal':
        maxw = gameboard.width - len
        maxh = gameboard.height
        break
      case 'vertical':
        maxw = gameboard.width
        maxh = gameboard.height - len
        break
    }
    return [this.randomNb(0, maxh - 1), this.randomNb(0, maxw - 1)]
  }

  /**
   * Generate a random number between min and max
   * @param {number} min
   * @param {number} max
   * @returns {number}
   * */
  static randomNb(min, max) {
    return min + Math.floor(Math.random() * max)
  }
}

export default Utils
