// player.js
// @ts-check

import Ship from "./ship.js";
import format from "@stdlib/string-format"
import clc from "cli-color"

/**
 * @class Player
 * @classdesc Player module
 * */
class Player {
  /**@type {string} */
  #name;
  /**@type {Array<Array>} */
  #board;
  /** @type {Array<Ship>} */
  #ships;
  /**@type {boolean} */
  #turn;

  /**
   * @constructor
   * @param {string} name
   * @param {Array<Array>} board 
   * */
  constructor(name, board) {
    this.#name = name
    this.#board = board
  }

  get name() {
    return this.#name
  }

  get board() {
    return this.#board
  }
  /**
   * Set the board of the player
   * @param {Array<Array>} val 
   * */
  set board(val) {
    this.#board = val
  }

  get ships() {
    return this.#ships
  }

  /**
   * Set the player ships
   * @param {Array<Ship>} val 
   * */
  set ships(val) {
    this.#ships = val
  }

  get turn() {
    return this.#turn
  }

  /**
   * Set the turn of the player
   * @param {boolean} val 
   * */
  set turn(val) {
    this.#turn = val
  }

  /**
   * @method printBoard to print the player board
   * */
  printBoard() {
    let row = '    '
    let c = 0
    // add Header
    for (let i = 0; i < this.board[0].length; i++) {
      row += format('% 3d  ', i)
    }
    row += '\n'
    row += '    '
    for (let i = 0; i < this.board[0].length; i++) {
      row += ` ____`
    }
    row += '\n'
    for (let h of this.board) {
      row += format('% 3d|', c++)
      for (let w of h) {
        if (w === 1) {
          row += format(clc.bgGreen('% 3d  '), w)
        }
        else {
          row += format('% 3d  ', w)
        }
      }
      row += '\n'
    }
    console.log(row)
  }
}

/** @module Player */
export default Player;
