// modalcontroller.js
// @ts-check

/**
 * @typedef Results
 * @property {Object} time
 * @property {string} time.name
 * @property {string} time.value
 * @property {object} ships
 * @property {string} ships.name
 * @property {number} ships.value
 * @property {object} misses
 * @property {string} misses.name
 * @property {number} misses.value
 * */

import Player from "../player.js"
import UIManager from "./uimanager.js"

class ModalController {
  #uimanager

  /**
   * @constructor 
   * @param {UIManager} uimanager 
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager
  }

  /**
   * method render to render the modal on the screen
   * @param {string} winner 
   * @param {Results} results 
   * @param {(event: Event) => void} handleClickCallback 
   * @returns {HTMLElement} the modal-container element
   * */
  render(winner, results, handleClickCallback) {
    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container')

    const nameSpan = this.#uimanager.addElement('span', modalContainer, 'modal-name')
    nameSpan.textContent = `${winner} wins the game!`

    const summaryTable = this.#uimanager.addElement('table', modalContainer, 'modal-summary')
    for (const [key, categoryData] of Object.entries(results)) {
      const trow = this.#uimanager.addElement('tr', summaryTable, 'summary-row')

      const tdName = this.#uimanager.addElement('td', trow, 'summary-element')
      tdName.textContent = categoryData.name

      const tdValue = this.#uimanager.addElement('td', trow, 'summary-element')
      tdValue.textContent = String(categoryData.value) // Ensure value is a string for textContent
    }

    const keySpan = this.#uimanager.addElement('span', modalContainer, 'modal-key')
    keySpan.textContent = 'Click anywhere to close...'

    // FIX the keypress event
    modalContainer.addEventListener('keypress', handleClickCallback)
    modalContainer.addEventListener('click', handleClickCallback)

    return modalContainer
  }

  /**
   * Method to render a message to the user
   * @param {Object} obj 
   * @param {string} obj.type
   * @param {string} obj.message
   * @param {(event: Event) => void} handleClickCallback 
   * */
  renderMessage(obj, handleClickCallback){
    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container')
    const typeSpan = this.#uimanager.addElement('span', modalContainer, 'modal-type')
    typeSpan.textContent = `${obj.type}`

    const msgSpan = this.#uimanager.addElement('span', modalContainer, 'modal-message')
    msgSpan.textContent = `${obj.message}`

    const closeSpan = this.#uimanager.addElement('span', modalContainer, 'modal-key')
    closeSpan.textContent = 'Click anywhere to close...'

    modalContainer.addEventListener('click', handleClickCallback)

    return modalContainer
  }
}

export default ModalController
