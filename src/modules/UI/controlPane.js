// controlPane.js
// @ts-check

import PiecesPane from "./piecespane.js"
import UIManager from "./uimanager.js"

class ControlPane{
  #uimanager

  /**
   * @constructor
   * @param {UIManager} uimanager 
   * */
  constructor(uimanager){
    this.#uimanager = uimanager
  }

  /**
   * @method renderControlPane to render the control pane on the page
   * @param {Object[]} pieces 
   * @param {number} pieces[].length
   * @param {string} pieces[].orientation
   * @returns {HTMLElement} the control pane element
   * */
  renderControlPane(pieces){
    const controlContainer = document.createElement('div')
    controlContainer.classList.add('control-container')

    const piecesPane = new PiecesPane(this.#uimanager)
    // WARN: change orientation to be dynamic later on
    const ppane = piecesPane.renderPane(pieces, 'horizontal');
    controlContainer.appendChild(ppane)

    

    return controlContainer
  }
}

export default ControlPane
