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
   * @param {string} pieces[].id - unique id for the piece
   * @param {boolean} pieces[].placed - true if piece placed on the board
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

    const cellSize = getComputedStyle(document.documentElement).getPropertyValue('--cell-size').trim()

    // Filter out already placed pieces for rendering
    const unplacedPieces = pieces.filter(p => !p.placed);

    if (unplacedPieces.length === 0) {
      // If no unplaced pieces, maybe show a message or return an empty container
      // The AppController will handle removing/replacing this pane entirely if all are placed.
      // For now, return an empty container.
      return piecesBoard;
    }

    for (let p of unplacedPieces) {
      const piece = this.#uimanager.addElement('div', controlPieces, 'control-piece')
      piece.draggable = true; // Make the piece draggable
      piece.dataset.length = p.length.toString(); // Store piece length
      piece.dataset.orientation = orientation; // Store current orientation
      piece.dataset.pieceId = String(p.id); // Store unique ID for identification

      piece.addEventListener('dragstart', (e) => {
        // Transfer piece data as JSON string
        e.dataTransfer.setData('text/plain', JSON.stringify({
          length: p.length,
          orientation: orientation,
          pieceId: p.id
        }));
        piece.classList.add('dragging'); // Optional: Add class for visual feedback
      });

      piece.addEventListener('dragend', (e) => {
        piece.classList.remove('dragging'); // Optional: Remove class
      });

      // case horizontal
      if (orientation === 'horizontal') {
        piece.style.height = cellSize
        piece.style.width = `${parseFloat(cellSize) * p.length}px`
        controlPieces.classList.remove('control-pieces-vertical')
        controlPieces.classList.add('control-pieces')
      }
      if (orientation === 'vertical') {
        piece.style.height = `${parseFloat(cellSize) * p.length}px`
        piece.style.width = cellSize
        // change the grid to 4 fractions
        controlPieces.classList.remove('control-pieces')
        controlPieces.classList.add('control-pieces-vertical')
      }
      // piece.style.backgroundColor = 'green'
      // piece.style.border = '2px solid black'
    }

    const controlPiecesHint = this.#uimanager.addElement('span', piecesBoard, 'control-pieces-hint')
    controlPiecesHint.textContent = 'Drag and drop pieces on the board to begin...'
    controlPiecesHint.style.color = 'gray'

    return piecesBoard
  }

}

export default PiecesPane
