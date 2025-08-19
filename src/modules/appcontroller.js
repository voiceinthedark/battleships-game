// appcontroller.js
// @ts-check

import Player from "./player.js"
import BoardController from "./UI/boardcontroller.js"
import UIManager from "./UI/uimanager.js"

/**
 * @class
 * @classdesc App controller, to control the flow of data between the front and the back
 * */
class AppController {
  #appContainer
  #uimanager
  /**
   * @param {HTMLElement} appContainer
   * */
  constructor(appContainer) {
    this.#appContainer = appContainer
    this.#uimanager = new UIManager(this.#appContainer)
  }

  /**
   * Set the board on the page
   * @param {Player} player 
   * */
  setBoard(player){
    const board = new BoardController(this.#uimanager)
    const boardUI = board.renderBoard(player, () => {})
    this.#appContainer.appendChild(boardUI)
  }
}

/**
 * @module AppController
 * */
export default AppController
