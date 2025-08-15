// gameboard.js
// @ts-check


/**
 * @class GameBoard
 * @classdesc gameboard module to control the placement of ships and register attacks
 * on the board
 * */
class GameBoard{
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
  constructor(height = 14, width = 14){
    this.#height = height;
    this.#width = width;
    this.#playerShips = [] // an array containing a list of Ship objects
    this.#computerShips = [] // an array for the computer's Ship objects
    this.#playerBoard = [] // Array of arrays represing the board
    this.#computerBoard = []
    this.#fillTheBoard(this.#playerBoard)
    this.#fillTheBoard(this.#computerBoard)
  }

  get width(){
    return this.#width
  }

  get height(){
    return this.#height
  }

  get playerBoard(){
    return this.#playerBoard
  }

  get computerBoard(){
    return this.#computerBoard
  }

  /**
   * @method helper function to fill the boards and initialize it
   * @param {Array<Array>} board 
   * */
  #fillTheBoard(board){
    for(let i = 0; i < this.#height; i++){
      let arr = new Array(14);
      arr = arr.fill(0)
      board.push(arr)
    }
  }

  /**
   * @method to place the ship on the board
   * @param {number} start - start between 0 and width or height - length 
   * @param {string} orientation - Either vertical or horizontal
   * @param {Array<Array>} board - The board where the ship should be placed (computer or player)
   * */
  placeShip(start, orientation, board){
    // TODO: place ship on the coordinates provided with 
    // the orientation taken into account

  }

  /**
   * @method to receive the attack on the board
   * */
  receiveAttack(){
    // TODO: receive an attack on the board and calculate 
    // hits and misses according to each player

  }

  /**
   * @method to return whether all the ships have been sunk
   * @param {*} player - The player whose fleet to be checked 
   * @returns {boolean}
   * */
  shipsSunk(player){
    // TODO: check the player fleet for whether his fleet has been sunk
    return false;
  }
}

/** @module GameBoard */
export default GameBoard;
