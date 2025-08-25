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
   * @param {(event: Event) => void} [handleComputerCellClick] - callback method to apply on each square of the board
   * @param {(event: DragEvent, coords: number[], pieceData: object) => void} [handlePlayerCellDrop] - callback for dropping pieces on player's board
   * @param {(event: DragEvent, coords: number[]) => void} [handlePlayerCellDragOver] - callback for drag over on player's board
   * @param {(event: DragEvent, coords: number[]) => void} [handlePlayerCellDragEnter] - callback for drag enter on player's board
   * @param {(event: DragEvent, coords: number[]) => void} [handlePlayerCellDragLeave] - callback for drag leave on player's board
   * @param {string} [gamemode='single'] - gamemode single or two [default: single]
   * @param {boolean} [showShips=false] - Whether to visually display the ships on this board (e.g., for owner's board)
   * @returns {HTMLElement} The board container element.
   * */
  renderBoard(player,
    handleComputerCellClick,
    handlePlayerCellDrop,
    handlePlayerCellDragOver,
    handlePlayerCellDragEnter,
    handlePlayerCellDragLeave,
    gamemode = 'single',
    showShips = false) {

    let boardContainer = document.createElement('div')
    boardContainer.classList.add('board-container')
    if (player.name === 'player') {
      boardContainer.classList.add('board-player-container');
    } else {
      boardContainer.classList.add('board-computer-container'); // Add container class for computer too for consistency
    }

    let nameSpan = this.#uimanager.addElement('span', boardContainer, 'board-name')
    nameSpan.textContent = `${player.name}`

    let boardElement = this.#uimanager.addElement('div', boardContainer, 'board-player');
    if (player.name === 'computer') {
      boardElement.classList.remove('board-player')
      boardElement.classList.add('board-computer')
    }

    for (let i = 0; i < player.board.length; i++) {
      for (let j = 0; j < player.board[i].length; j++) {
        let boardCell = this.#uimanager.addElement('div', boardElement, 'board-cell')
        boardCell.dataset.id = `${i},${j}`

        // Apply visual styles for placed ships if showShips is true
        if (player.board[i][j] === 1 && showShips) {
          boardCell.style.backgroundColor = 'green'
        }
        // Apply visual styles for hit/missed cells (for both boards if applicable)
        if (player.board[i][j] === 9) { // Assuming 9 for hit
          boardCell.style.backgroundColor = 'red'
        } else if (player.board[i][j] === -1) { // Assuming -1 for miss
          boardCell.style.backgroundColor = 'gray'
        }

        // Attach attack listener if provided
        if (handleComputerCellClick) {
          boardCell.addEventListener('click', handleComputerCellClick)
        }

        // Attach drag-and-drop listeners only if gamemode is single and player's own board
        if (gamemode === 'single' && player.name === 'player' && handlePlayerCellDrop) {
          boardCell.addEventListener('dragover', (e) => {
            e.preventDefault(); // This is crucial to allow a drop
            if (handlePlayerCellDragOver) handlePlayerCellDragOver(e, [i, j]);
          });
          boardCell.addEventListener('drop', (e) => {
            e.preventDefault();
            if (handlePlayerCellDrop) {
              const pieceData = JSON.parse(e.dataTransfer.getData('text/plain'));
              handlePlayerCellDrop(e, [i, j], pieceData);
            }
          });
          boardCell.addEventListener('dragenter', (e) => {
            e.preventDefault(); // Also important for dragenter to work consistently
            if (handlePlayerCellDragEnter) handlePlayerCellDragEnter(e, [i, j]);
          });
          boardCell.addEventListener('dragleave', (e) => {
            if (handlePlayerCellDragLeave) handlePlayerCellDragLeave(e, [i, j]);
          });
        }
      }
    }
    return boardContainer
  }
}

export default BoardController
