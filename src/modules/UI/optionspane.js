// optionspane.js
// @ts-check

import UIManager from "./uimanager.js"

/**
 * @class OptionsPane
 * @classdesc class responsible for rendering the options buttons
 * */
class OptionsPane {
  #uimanager

  /**
   * @constructor
   * @param {UIManager} uimanager 
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager
  }

  /**
   * @method renderPane to render the command pane on the page
   * @param {(event: Event) => void} handleRotationCommand
   * @param {(even: Event) => void} handleRandomCommand 
   * @param {(event: Event) => void} handleResetCommand
   * @param {(event: Event) => void} handleStartCommand 
   * */
  renderPane(handleRotationCommand, handleRandomCommand, 
    handleResetCommand, handleStartCommand) {
    const commandPane = document.createElement('div')
    commandPane.classList.add('command-pane')

    const commandName = this.#uimanager.addElement('span', commandPane, 'command-name')
    commandName.textContent = 'Game controls'

    const rotateCommand = this.#uimanager.addElement('button', commandPane, 'command-rotate')
    rotateCommand.textContent = 'Rotate Pieces'
    rotateCommand.addEventListener('click', handleRotationCommand)

    const randomCommand = this.#uimanager.addElement('button', commandPane, 'command-random')
    randomCommand.textContent = 'Random Placement'
    randomCommand.addEventListener('click', handleRandomCommand)

    const resetCommand = this.#uimanager.addElement('button', commandPane, 'command-reset')
    resetCommand.textContent = "Reset Pieces"
    resetCommand.addEventListener('click', handleResetCommand)

    const startCommand = this.#uimanager.addElement('button', commandPane, 'command-start')
    startCommand.textContent = 'Start'
    startCommand.addEventListener('click', handleStartCommand)

    return commandPane
  }
}

export default OptionsPane
