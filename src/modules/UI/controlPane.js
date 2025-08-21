// controlPane.js
// @ts-check

import OptionsPane from "./optionspane.js"
import PiecesPane from "./piecespane.js"
import UIManager from "./uimanager.js"

class ControlPane {
  #uimanager

  /**
   * @constructor
   * @param {UIManager} uimanager 
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager
  }

  /**
   * @method renderControlPane to render the control pane on the page
   * @param {Object[]} pieces 
   * @param {number} pieces[].length
   * @param {string} pieces[].orientation
   * @param {(event: Event) => void} handleRotationCommand 
   * @param {(event: Event) => void} handleRandomCommand 
   * @param {(event: Event) => void} handleResetCommand
   * @returns {HTMLElement} the control pane element
   * */
  renderControlPane(pieces, handleRotationCommand, handleRandomCommand, handleResetCommand) {
    const controlContainer = document.createElement('div')
    controlContainer.classList.add('control-container')

    const piecesPane = new PiecesPane(this.#uimanager)
    // WARN: change orientation to be dynamic later on
    const ppane = piecesPane.renderPane(pieces, 'horizontal');
    controlContainer.appendChild(ppane)

    const commandPane = new OptionsPane(this.#uimanager)
    const options = commandPane.renderPane(handleRotationCommand,
      handleRandomCommand, handleResetCommand)
    controlContainer.appendChild(options)

    return controlContainer
  }
}

export default ControlPane
