// appcontroller.js
// @ts-check

import GameBoard from "./gameboard.js"
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
   * @param {GameBoard} gameboard 
   * @param {Object[]} pieces 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  setControlPane(gameboard, pieces, player, computer) {
    const controlPane = new ControlPane(this.#uimanager)
    const element = controlPane.renderControlPane(pieces,
      (/**@type {Event} */e) => this.handleRotationCommand(e, pieces),
      (/**@type {Event} */e) => this.handleRandomCommand(e, gameboard, pieces, player, computer),
      (/**@type {Event} */e) => this.handleResetCommand(e, gameboard, pieces, player, computer),
      (/**@type {Event} */e) => this.handleStartCommand(e, gameboard, player, computer))
    this.#appContainer.appendChild(element)
  }

  /**
   * Set the board on the page
   * @param {GameBoard} gameboard 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  setBoard(gameboard, player, computer) {
    const board = new BoardController(this.#uimanager)
    const boardUI = board.renderBoard(player, (e) => this.handleCellClick(e, gameboard, player, computer))
    this.#appContainer.appendChild(boardUI)
  }

  /**
   * Handle the cell click on the board
   * @param {Event} e 
   * @param {GameBoard} gameboard 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  handleCellClick(e, gameboard, player, computer) {
    // NOTE: need to control where the user clicks
    // TODO: The user is only allowed to click his own board at setup
    // WARN: disable clicking the cells after initial game setup
    e.preventDefault()
    let coordinates  
    let hit
    if (e.target instanceof HTMLElement) {
      console.log(`${e.target.dataset.id}`)
      coordinates = e.target.dataset.id.split(',')
    }
    // TODO start a game loop to switch between turns and check whether a player wins
    // Player Turn
    // NOTE if board cell is already click do nothing
    if(computer.board[coordinates[0]][coordinates[1]] === -1 
      || computer.board[coordinates[0]][coordinates[1]] === 9){
      console.log(`already attacked cell ${coordinates}`)
      return
    }
    // NOTE attack the cell otherwise
    if(computer.board[coordinates[0]][coordinates[1]] === 0 
      || computer.board[coordinates[0]][coordinates[1]] === 1){
      console.log(`attacking cell ${coordinates}`)
      coordinates = coordinates.map(n => parseInt(n))
      hit = gameboard.receiveAttack(coordinates, computer.board)
      // NOTE do something when hit is true
      this.updateBoard(e, hit)
    }

    // TODO Computer Turn
  }

  /**
   * @method updateBoard to update the board after cell click
   * @param {Event} e 
   * @param {boolean} hit 
   * */
  updateBoard(e, hit) {
    if (e.target instanceof HTMLDivElement) {
      if (hit) {
        e.target.style.backgroundColor = 'red'
      } else {
        e.target.style.backgroundColor = 'gray'
      }
    }
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
    } else if (pieces[0].orientation === 'vertical') {
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
   * @param {GameBoard} gameboard 
   * @param {Object[]} pieces 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  handleRandomCommand(e, gameboard, pieces, player, computer) {
    e.preventDefault()
    // clear all the boards
    const oldBoards = document.querySelectorAll('.board-container')
    oldBoards.forEach(board => board.remove())
    gameboard.resetPlayerBoard()
    gameboard.resetComputerBoard()

    player.board = gameboard.playerBoard
    computer.board = gameboard.computerBoard

    Utils.randomizeOrientation(pieces)
    Utils.populateBoardRandomly(gameboard, pieces, player)
    Utils.randomizeOrientation(pieces)
    Utils.populateBoardRandomly(gameboard, pieces, computer)
    player.ships = gameboard.playerShips
    computer.ships = gameboard.computerShips


    // const oldBoard = document.querySelector('.board-container')
    const control = document.querySelector('.control-container')
    const bController = new BoardController(this.#uimanager)
    // WARN handleCellClick check
    const newBoard = bController.renderBoard(player, this.handleCellClick.bind(this))

    control.before(newBoard)
  }

  /**
   * Handle the reset command
   * @param {Event} e 
   * @param {GameBoard} gameboard 
   * @param {Object[]} pieces 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  handleResetCommand(e, gameboard, pieces, player, computer) {
    e.preventDefault()
    gameboard.resetPlayerBoard()
    gameboard.resetComputerBoard()

    player.board = gameboard.playerBoard
    computer.board = gameboard.computerBoard
    player.ships = gameboard.playerShips
    computer.ships = gameboard.computerShips
    // NOTE refresh the board
    const boardContainer = document.querySelector('.board-container')
    const bController = new BoardController(this.#uimanager)
    // WARN check the handleCellClick for errors later on
    const newBoard = bController.renderBoard(player, this.handleCellClick.bind(this))
    const controlContainer = document.querySelector('.control-container')
    const pPane = new PiecesPane(this.#uimanager)
    const p = pPane.renderPane(pieces, 'horizontal')
    // get the computer board
    const computerBoard = controlContainer.querySelector('.board-container')
    // NOTE Fix for pressing the reset button when the computerBoard isn't loaded
    if (computerBoard) {
      controlContainer.replaceChild(p, computerBoard)
    }

    // restore the buttons
    const startButton = document.querySelector('.command-start')
    const randomButton = document.querySelector('.command-random')
    const rotateButton = document.querySelector('.command-rotate')

    if (startButton instanceof HTMLButtonElement
      && randomButton instanceof HTMLButtonElement
      && rotateButton instanceof HTMLButtonElement) {
      startButton.disabled = false
      randomButton.disabled = false
      rotateButton.disabled = false
    }

    this.#appContainer.replaceChild(newBoard, boardContainer)
  }

  /**
   * handle the start of the game
   * @param {Event} e 
   * @param {GameBoard} gameboard 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  handleStartCommand(e, gameboard, player, computer) {
    e.preventDefault()
    // TODO handle the start command
    // NOTE make sure there are pieces on the board and player/computer ships are assigned before starting
    if (gameboard.playerShips.length === 0
      || gameboard.computerShips.length === 0
      || gameboard.computerBoard === null) {
      // TODO make it a modal later on
      console.log('error starting game')
      alert('You need to setup the board first before starting the game')
      return
    }
    // Need to remove the pieces pane and replace it with computer board
    // Get the control container and replace it with a board-container
    const controlContainer = document.querySelector('.control-container')
    const controlPieces = document.querySelector('.control-pieces-section')
    const bController = new BoardController(this.#uimanager)
    const computerBoard = bController.renderBoard(computer, 
      (e) => this.handleCellClick(e, gameboard, player, computer))
    controlContainer.replaceChild(computerBoard, controlPieces)
    // Buttons beside the reset need to be disabled
    const startButton = document.querySelector('.command-start')
    const randomButton = document.querySelector('.command-random')
    const rotateButton = document.querySelector('.command-rotate')

    if (startButton instanceof HTMLButtonElement
      && randomButton instanceof HTMLButtonElement
      && rotateButton instanceof HTMLButtonElement) {
      startButton.disabled = true
      randomButton.disabled = true
      rotateButton.disabled = true

    }
  }
}

/**
 * @module AppController
 * */
export default AppController
