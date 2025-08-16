// utils.js
// @ts-check

import Square from "./square.js";

/**
 * @class Utils
 * @classdesc helper class
 * */
class Utils {
  constructor() {
  }
  /**
     * initialize the coordinates into an array of Sqaures
     * @param {Array<Array>} coords 
     * */
  static initCoords(coords) {
    let res = []

    for (let c of coords) {
      res.push(new Square(c[0], c[1]))
    }
    return res;
  }

  /**
   * helper function to extract coordinates of a ship
   * @param {Array[number]} point - The starting location of the ship 
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
   * */
  static isInteresect(coords, board) {
    return coords.some(c => {
      if (board[c[0]][c[1]] === 1) {
        return true
      }
      return false
    })

  }
}

export default Utils;
