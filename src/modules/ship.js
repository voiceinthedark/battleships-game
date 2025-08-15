// ship.js
// @ts-check

/**
 * @class
 * @classdesc Ship module that contain data for the ship objects
 * */
class Ship{
  #name
  #length
  #hits
  /**@constructor
   * @param {string} name 
   * @param {number} length 
   * */
  constructor(name, length){
    this.#name = name
    this.#length = length
    this.#hits = 0
  }

  get name(){
    return this.#name
  }

  get length(){
    return this.#length
  }

  /**
   * @method to simulate battle ship being hit
   * @returns {boolean}
   * */
  hit(){
    this.#hits++;
    return true
  }

  /**
   * @method to assert whether the ship has been sunk or not
   * @returns {boolean}
   * */
  isSunk(){
    if(this.#hits < this.#length)
      return false
    return true
  }
}

/**@module Ship */
export default Ship;
