// appcontroller.js
// @ts-check

import Player from "./player.js"
import BoardController from "./UI/boardcontroller.js"
import ControlPane from "./UI/controlPane.js"
import PiecesPane from "./UI/piecespane.js"
import UIManager from "./UI/uimanager.js"
import Utils from "./utils.js"

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
  setControlPane(pieces) {
    const controlPane = new ControlPane(this.#uimanager)
    const element = controlPane.renderControlPane(pieces,
      (/**@type {Event} */e) => this.handleRotationCommand(e, pieces),
    (/**@type {Event} */e) => this.handleRandomCommand(e, pieces))
    this.#appContainer.appendChild(element)
  }

  /**
   * Set the board on the page
   * @param {Player} player 
   * */
  setBoard(player) {
    const board = new BoardController(this.#uimanager)
    const boardUI = board.renderBoard(player, this.handleCellClick.bind(this))
    this.#appContainer.appendChild(boardUI)
  }

  /**
   * Handle the cell click on the board
   * @param {Event} e 
   * */
  handleCellClick(e) {
    // NOTE: need to control where the user clicks
    // TODO: The user is only allowed to click his own board at setup
    // WARN: disable clicking the cells after initial game setup
    e.preventDefault()
    console.log(`${e.target.dataset.id}`)
  }

  /**
   * @method handleRotationCommand to handle the rotation of the pieces on the board
   * @param {Event} e 
   * @param {Object[]} pieces 
    * */
  handleRotationCommand(e, pieces) {
    e.preventDefault()
    let orientation;
    if (pieces[0].orientation === 'horizontal') {
      orientation = 'vertical'
    } else if(pieces[0].orientation === 'vertical'){
      orientation = 'horizontal'
    }
    pieces.map(p => p.orientation = orientation)
    const piecesPane = new PiecesPane(this.#uimanager)
    const controlContainer = document.querySelector('.control-container')
    const oldPane = document.querySelector('.control-pieces-section')
    const ppane = piecesPane.renderPane(pieces, orientation)
    controlContainer.replaceChild(ppane, oldPane)
  }

  /**
   * @method handleRandomCommand to handle the random placement command
   * @param {Event} e 
   * @param {Object[]} pieces 
   * */
  handleRandomCommand(e, pieces){
    e.preventDefault()
    console.log('random')
    // TODO: randomize the orientation of the pieces then place the pieces randomly
    Utils.randomizeOrientation(pieces)
    console.log(pieces)
  }
}

/**
 * @module AppController
 * */
export default AppController
