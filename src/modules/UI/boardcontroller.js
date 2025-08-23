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
   * @returns {HTMLElement} The board container element.
   * */
  renderBoard(player, 
    handleComputerCellClick, 
    handlePlayerCellDrop, 
    handlePlayerCellDragOver, 
    handlePlayerCellDragEnter, 
    handlePlayerCellDragLeave) {
    let boardContainer = document.createElement('div')
    boardContainer.classList.add('board-container')
    if (player.name === 'player') {
      boardContainer.classList.add('board-player-container');
    }

    let nameSpan = this.#uimanager.addElement('span', boardContainer, 'board-name')
    nameSpan.textContent = `${player.name}`

    let boardElement = this.#uimanager.addElement('div', boardContainer, 'board-player'); // Renamed from boardPlayer for clarity
    if (player.name === 'computer') {
      boardElement.classList.remove('board-player')
      boardElement.classList.add('board-computer')
    }

    for (let i = 0; i < player.board.length; i++) {
      for (let j = 0; j < player.board[i].length; j++) {
        let boardCell = this.#uimanager.addElement('div', boardElement, 'board-cell')
        boardCell.dataset.id = `${i},${j}`

        // Apply visual styles for placed ships on player's board
        if (player.board[i][j] === 1 && player.name === 'player') {
          boardCell.style.backgroundColor = 'green'
        }
        // Apply visual styles for hit/missed cells (for both boards if applicable)
        if (player.board[i][j] === 9) { // Assuming 9 for hit
          boardCell.style.backgroundColor = 'red'
        } else if (player.board[i][j] === -1) { // Assuming -1 for miss
          boardCell.style.backgroundColor = 'gray'
        }


        if (player.name === 'computer') {
          // Only on computer board add handle click on the cells for attacking
          boardCell.addEventListener('click', handleComputerCellClick)
        } else if (player.name === 'player') {
          // Add drag-and-drop listeners to player's board cells
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
