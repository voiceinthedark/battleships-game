// player.js
// @ts-check

import Ship from './ship.js'
import format from '@stdlib/string-format'
import clc from 'cli-color'

/**
 * @class Player
 * @classdesc Player module
 * */
class Player {
  /**@type {string} */
  #name
  /**@type {Array<Array>} */
  #board
  /** @type {Array<Ship>} */
  #ships
  /**@type {boolean} */
  #turn

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
  
}

/** @module Player */
export default Player
