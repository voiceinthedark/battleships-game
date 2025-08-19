// boardcontroller.js
// @ts-check

import Player from "../player.js"
import UIManager from "./uimanager.js"


/**
 * @class BoardController
 * @classdesc UI Class to control the board display on the page
 * */
class BoardController {

  #uimanager
  /**
   * @constructor
   * @param {UIManager} uimanager - the main uimanager of the app
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager
  }

  /**
   * @method renderBoard to display the board on screen
   * @param {Player} player - the board to display, player or computer 
   * @callback handleclick - callback method to apply on each square of the board
   * */
  renderBoard(player, handleclick) {
    let boardContainer = this.#uimanager.addElement('div', this.#uimanager.container, 'board-container')
    let nameSpan = this.#uimanager.addElement('span', boardContainer, 'board-name')
    nameSpan.textContent = `${player.name}`

    let boardPlayer = this.#uimanager.addElement('div', boardContainer, 'board-player');
    for(let i = 0; i < player.board.length; i++){
      for(let j = 0; j < player.board[i].length; j++){
        let boardCell = this.#uimanager.addElement('div', boardPlayer, 'board-cell')
        boardCell.dataset.id = `${i},${j}`
        if(player.board[i][j] === 1){
          boardCell.style.backgroundColor = 'green'
        } 
        if(player.board[i][j] === 9){
          boardCell.style.backgroundColor = 'red'
        }

      }
    }


    return boardContainer
  }
}

export default BoardController
