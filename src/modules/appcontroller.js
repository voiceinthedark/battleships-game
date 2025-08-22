// appcontroller.js
// @ts-check

import Game from "./game.js"
import GameBoard from "./gameboard.js"
import Player from "./player.js"
import BoardController from "./UI/boardcontroller.js"
import ControlPane from "./UI/controlPane.js"
import ModalController from "./UI/modalController.js"
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
  /**@type {Game} */
  #game
  /**
   * @param {HTMLElement} appContainer
   * */
  constructor(appContainer) {
    this.#appContainer = appContainer
    this.#uimanager = new UIManager(this.#appContainer)
    this.#game = null;
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
   * @param {Event} e - event object of the click 
   * @param {GameBoard} gameboard - the gameboard
   * @param {Player} player - the player
   * @param {Player} computer - the computer
   * */
  handleCellClick(e, gameboard, player, computer) {
    // WARN: disable clicking the cells after initial game setup
    e.preventDefault()
    let coordinates
    /** @type {import('./game.js').Result} */
    let playerTurnResult;
    /** @type {import('./game.js').Result} */
    let computerTurnResult;
    if (e.target instanceof HTMLElement) {
      console.log(`${e.target.dataset.id}`)
      coordinates = e.target.dataset.id.split(',')
    }
    if (this.#game) {
      // Player Turn
      playerTurnResult = this.#game.playTurn(player, coordinates)
      if (playerTurnResult.error) {
        console.log(`Player turn error ${playerTurnResult.error}`)
        return
      }
      if (e.target instanceof HTMLDivElement) {
        this.updateBoard(e.target, playerTurnResult.hit)
      }
      // Check if player won
      if (playerTurnResult.winner === 'player') {
        // TODO: Stop the game and declare winner player
        // TODO: Show a summary of time and turns taken to beat the game
        console.log(`${player.name} wins the game!`)
        return;
      }
      if (playerTurnResult.gameOn) {
        // Computer turn
        computerTurnResult = this.#game.playTurn(computer)
        // Update the UI for the computer's attack on the player's board
        this.updatePlayerBoardUI(computerTurnResult.coordinates, computerTurnResult.hit);

        // Check if computer won immediately after their turn
        if (computerTurnResult.winner === 'computer') {
          console.log(`${computer.name} wins the game!`);
          // TODO: Stop the game, declare winner, show summary
          return; // Game is over
        }
      }
    }
  }


  /**
   * @method updateBoard to update the board after cell click
   * @param {HTMLDivElement} cellElement - a dom element representing a cell 
   * @param {boolean} hit 
   * */
  updateBoard(cellElement, hit) {
    if (cellElement instanceof HTMLDivElement) {
      if (hit) {
        cellElement.style.backgroundColor = 'red'
      } else {
        cellElement.style.backgroundColor = 'gray'
      }
    }
  }


  /**
   * method to update the playerboard after computer attack
   * @param {Array<number>} coordinates - [row, col] of the attacked cell 
   * @param {boolean} hit - Whether the attack was a hit or a miss 
   * */
  updatePlayerBoardUI(coordinates, hit) {
    const playerBoardElement = document.querySelector('.board-container .board-player')
    if (playerBoardElement) {
      const cellElement = playerBoardElement.querySelector(`[data-id="${coordinates[0]},${coordinates[1]}"]`)
      if (cellElement instanceof HTMLDivElement) {
        this.updateBoard(cellElement, hit)
      }
    } else {
      console.error('Player board element not found for UI update');

    }


  }

  /**
   * @method handleRotationCommand to handle the rotation of the pieces on the board
   * @param {Event} e - the event object
   * @param {Object[]} pieces the pieces array that needs to be rotated
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
   * @param {Event} e - The event object
   * @param {GameBoard} gameboard - the gameboard object
   * @param {Object[]} pieces - the pieces object
   * @param {Player} player - the player
   * @param {Player} computer - the computer
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

    // setup game Object
    this.#game = new Game(gameboard, player, computer);
  }

  openModal(){
    const results = {
      time: {
        name: 'Time',
        value: '1 minute 34 seconds',
      },
      ships: {
        name: 'Ships left',
        value: 3,
      },
      misses: {
        name: 'Missed Shots',
        value: 54,
      },
    }
    const modal = new ModalController(this.#uimanager)
    const m = modal.render('Jim', results, ()=> {})
    document.querySelector('.modal').appendChild(m)
  }
}

/**
 * @module AppController
 * */
export default AppController
