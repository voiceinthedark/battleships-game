// piecespane.js
// @ts-check

import UIManager from "./uimanager.js"

/**
 * @class PiecesPane
 * @classdesc render the pieces to be placed on the board
 * */
class PiecesPane {
  #uimanager
  /**
   * @constructor
   * @param {UIManager} uimanager 
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager
  }

  /**
   * @method renderPane to render the pieces pane on the page
   * @param {Object[]} pieces - Array of objects that designate the pieces
   * @param {number} pieces[].length - length of the piece
   * @param {string} pieces[].orientation - orientation of the piece
   * @param {string} orientation - orientation of the pieces, vertical or horizontal 
   * @returns {HTMLElement} the pieces board
   * */
  renderPane(pieces, orientation) {
    const piecesBoard = document.createElement('div')
    piecesBoard.classList.add('control-pieces-section')
    const pieceName = this.#uimanager.addElement('span', piecesBoard, 'control-pieces-name')
    pieceName.textContent = 'Your fleet'
    const controlPieces = this.#uimanager.addElement('div', piecesBoard, 'control-pieces')
    for (let p of pieces) {
      // NOTE Every piece is a unit that contains length pieces
      // NOTE in case of horizontal orientation the width of the piece is 50px * length, height is 50px
      // NOTE in vertical orientation width is 50px while height is 50px * length
      // TODO place the pieces on the board
      // TODO allow drag and drop of the pieces onto the player board
      const piece = this.#uimanager.addElement('div', controlPieces, 'contol-piece')
      // case horizontal
      if (orientation === 'horizontal') {
        piece.style.height = '50px'
        piece.style.width = `${50 * p.length}px`
      }
      if (orientation === 'vertical') {
        piece.style.height = `${50 * p.length}px`
        piece.style.width = '50px'
      }
      piece.style.backgroundColor = 'green'
      piece.style.border = '2px solid black'

    }

    return piecesBoard
  }

}

export default PiecesPane
