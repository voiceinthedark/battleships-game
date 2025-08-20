// appcontroller.js
// @ts-check

import Player from "./player.js"
import BoardController from "./UI/boardcontroller.js"
import ControlPane from "./UI/controlPane.js"
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
   * Set the initial pane to setup the pieces on the board and start the game
   * @param {Object[]} pieces 
   * */
  setControlPane(pieces){
    const controlPane = new ControlPane(this.#uimanager)
    const element = controlPane.renderControlPane(pieces)
    this.#appContainer.appendChild(element)
  }

  /**
   * Set the board on the page
   * @param {Player} player 
   * */
  setBoard(player){
    const board = new BoardController(this.#uimanager)
    const boardUI = board.renderBoard(player, this.handleCellClick.bind(this))
    this.#appContainer.appendChild(boardUI)
  }

  /**
   * Handle the cell click on the board
   * @param {Event} e 
   * */
  handleCellClick(e){
    // NOTE: need to control where the user clicks
    // TODO: The user is only allowed to click his own board at setup
    // WARN: disable clicking the cells after initial game setup
    e.preventDefault()
    console.log(`${e.target.dataset.id}`)
  }
}

/**
 * @module AppController
 * */
export default AppController
