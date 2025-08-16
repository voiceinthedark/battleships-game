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
}

export default Utils;
