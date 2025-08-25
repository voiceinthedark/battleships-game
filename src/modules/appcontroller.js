// appcontroller.js
// @ts-check

import Game from "./game.js"
import GameBoard from "./gameboard.js"
import Player from "./player.js"
import Ship from "./ship.js"
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
  #gameStartTime = null
  /**@type {Array<Object & {id: string, placed: boolean}>} */
  #pieces
  /**@type {GameBoard} */
  #gameboard
  /**@type {Player} */
  #player
  /**@type {Player} */
  #computer
  /**@type {string} */
  #gameMode

  /**@type {Player} */
  #currentPlayerTurn
  /**@type {Player} */
  #currentOpponent
  #isPlayerSwitchPending


  /**
   * @param {HTMLElement} appContainer
   * */
  constructor(appContainer) {
    this.#appContainer = appContainer
    this.#uimanager = new UIManager(this.#appContainer)
    this.#game = null;
    this.#gameStartTime = null
    this.#pieces = []
    this.#gameboard = null
    this.#player = null
    this.#computer = null
    this.#gameMode = 'single' // default mode is single player


    this.#currentPlayerTurn = null;
    this.#currentOpponent = null;
    this.#isPlayerSwitchPending = false;
  }

  /**
   * Set the initial pane to setup the pieces on the board and start the game
   * @param {GameBoard} gameboard 
   * @param {Object[]} pieces 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  setControlPane(gameboard, pieces, player, computer) {
    this.#gameboard = gameboard;
    this.#player = player;
    this.#computer = computer;
    // NOTE FIX for the error of undefined ships object
    this.#player.ships = gameboard.playerShips
    this.#computer.ships = gameboard.computerShips

    // Augment pieces with unique IDs and a 'placed' status *once*
    this.#pieces = pieces.map((p, index) => ({ ...p, id: `piece-${index}-${p.length}`, placed: false, orientation: p.orientation || 'horizontal' }));

    // NOTE pieces is set correctly on setControlPane

    const controlPane = new ControlPane(this.#uimanager)
    const element = controlPane.renderControlPane(this.#pieces, // this.#pieces fixes the problem
      (/**@type {Event} */e) => this.handleRotationCommand(e),
      (/**@type {Event} */e) => this.handleRandomCommand(e),
      (/**@type {Event} */e) => this.handleResetCommand(e),
      (/**@type {Event} */e) => this.handleStartCommand(e),
      (/**@type {Event}*/ e) => this.handleTwoPlayerCommand(e))
    this.#appContainer.appendChild(element)
  }

  /**
   * Set the board on the page
   * @param {GameBoard} gameboard 
   * @param {Player} player 
   * @param {Player} computer 
   * */
  setBoard(gameboard, player, computer) {
    this.#gameboard = gameboard;
    this.#player = player;
    this.#computer = computer;
    // NOTE FIX for the error of undefined ships object
    this.#player.ships = gameboard.playerShips
    this.#computer.ships = gameboard.computerShips

    const board = new BoardController(this.#uimanager)
    const boardUI = board.renderBoard(player,
      (e) => this.handleCellClick(e),
      (e, coords, pieceData) => this.handlePlayerCellDrop(e, coords, pieceData),
      (e, coords) => this.handlePlayerCellDragOver(e, coords),
      (e, coords) => this.handlePlayerCellDragEnter(e, coords),
      (e, coords) => this.handlePlayerCellDragLeave(e, coords), this.#gameMode, true) // show ships for player
    this.#appContainer.appendChild(boardUI)
  }

  /**
   * Handle the cell click on the board
   * @param {Event} e - event object of the click 
   * */
  handleCellClick(e) {
    // WARN: disable clicking the cells after initial game setup
    e.preventDefault()
    if (this.#isPlayerSwitchPending) {
      console.log('Player switch pending, no clicks allowed.');
      return;
    }

    let coordinates
    /** @type {import('./game.js').Result} */
    let turnResult;

    if (e.target instanceof HTMLElement) {
      console.log(`${e.target.dataset.id}`)
      coordinates = e.target.dataset.id.split(',')
    }
    if (this.#game && this.#gameMode === 'two') {
      // Ensure the clicked cell belongs to the current opponent's board
      // The `e.target` for a click on the opponent's board will be a `.board-cell` inside `.opponent-board-for-attack`
      const clickedBoardContainer = e.target.closest('.opponent-board-for-attack');
      if (!clickedBoardContainer) {
        console.log('Click not on opponent\'s board, ignoring.');
        return;
      }

      turnResult = this.#game.playTurn(this.#currentPlayerTurn, this.#currentOpponent, coordinates, this.#gameMode)

      if (turnResult.error) {
        console.log(`Player turn error ${turnResult.error}`)
        return
      }
      if (e.target instanceof HTMLDivElement) {
        this.updateBoard(e.target, turnResult.hit)
      }
      // Check if current player won
      if (turnResult.winner === this.#currentPlayerTurn.name) {
        const modal = new ModalController(this.#uimanager)
        const result = {
          time: {
            name: 'Time',
            value: this.#calculateAndFormatGameTime()
          },
          ships: {
            name: 'Ships left',
            value: this.#currentPlayerTurn.ships.filter(s => !s.isSunk()).length,
          },
          misses: {
            name: 'Missed Shots',
            value: this.#currentOpponent.board.reduce((a, c) => a + c.filter(e => e === -1).length, 0)
          }
        }
        const modalUI = document.querySelector('.modal')
        const m = modal.render(this.#currentPlayerTurn.name, result, (/**@type {Event} */e) => {
          if (modalUI instanceof HTMLDivElement) {
            modalUI.style.display = 'none'
            modalUI.removeChild(m)
            this.#appContainer.classList.remove('blurred')
          }
        })
        modalUI.appendChild(m)
        if (modalUI instanceof HTMLDivElement) {
          modalUI.style.display = 'flex'
          this.#appContainer.classList.add('blurred')
        }

        console.log(`${this.#currentPlayerTurn.name} wins the game!`)
        return;
      }

      if (turnResult.gameOn) {
        // Game continues, trigger player switch modal
        this.#isPlayerSwitchPending = true;
        this.#displaySwitchPlayerModal(this.#currentPlayerTurn.name, this.#currentOpponent.name);
      }
    } else if (this.#game) {
      // Single player game mode
      // Player Turn
      turnResult = this.#game.playTurn(this.#player, this.#computer, coordinates) // Player attacks computer
      if (turnResult.error) {
        console.log(`Player turn error ${turnResult.error}`)
        return
      }
      if (e.target instanceof HTMLDivElement) {
        this.updateBoard(e.target, turnResult.hit)
      }
      // Check if player won
      if (turnResult.winner === 'player') {
        const modal = new ModalController(this.#uimanager)
        const result = {
          time: {
            name: 'Time',
            value: this.#calculateAndFormatGameTime()
          },
          ships: {
            name: 'Ships left',
            value: this.#player.ships.filter(s => !s.isSunk()).length,
          },
          misses: {
            name: 'Missed Shots',
            value: this.#computer.board.reduce((a, c) => a + c.filter(e => e === -1).length, 0)
          }
        }
        const modalUI = document.querySelector('.modal')
        const m = modal.render('Player', result, (/**@type {Event} */e) => {
          if (modalUI instanceof HTMLDivElement) {
            modalUI.style.display = 'none'
            modalUI.removeChild(m)
            this.#appContainer.classList.remove('blurred')
          }
        })
        modalUI.appendChild(m)
        if (modalUI instanceof HTMLDivElement) {
          modalUI.style.display = 'flex'
          this.#appContainer.classList.add('blurred')
        }

        console.log(`${this.#player.name} wins the game!`)
        return;
      }
      if (turnResult.gameOn) {
        // Computer turn
        const computerTurnResult = this.#game.playTurn(this.#computer, this.#player) // Computer attacks player
        // Update the UI for the computer's attack on the player's board
        this.updatePlayerBoardUI(computerTurnResult.coordinates, computerTurnResult.hit);

        // Check if computer won immediately after their turn
        if (computerTurnResult.winner === 'computer') {
          console.log(`${this.#computer.name} wins the game!`);
          const modal = new ModalController(this.#uimanager)
          const result = {
            time: {
              name: 'Time',
              value: this.#calculateAndFormatGameTime()
            },
            ships: {
              name: 'Ships left',
              value: this.#computer.ships.filter(s => !s.isSunk()).length, // Computer wins, so show player's remaining ships
            },
            misses: {
              name: 'Missed Shots',
              value: this.#player.board.reduce((a, c) => a + c.filter(e => e === -1).length, 0) // Computer wins, so show player's missed shots on their board
            }
          }
          const modalUI = document.querySelector('.modal')
          const m = modal.render('Computer', result, (/**@type {Event} */e) => {
            if (modalUI instanceof HTMLDivElement) {
              modalUI.style.display = 'none'
              modalUI.removeChild(m)
              this.#appContainer.classList.remove('blurred')
            }
          })
          modalUI.appendChild(m)
          if (modalUI instanceof HTMLDivElement) {
            modalUI.style.display = 'flex'
            this.#appContainer.classList.add('blurred')
          }
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
    * */
  handleRotationCommand(e) {
    e.preventDefault()
    let orientation;
    // Get current orientation from an unplaced piece, or default to horizontal
    const firstUnplacedPiece = this.#pieces.find(p => !p.placed);
    if (!firstUnplacedPiece) {
      console.log('No pieces left to rotate.');
      this.#displayModalError('All ships have been placed. No pieces to rotate.');
      return;
    }

    if (firstUnplacedPiece.orientation === 'horizontal') {
      orientation = 'vertical'
    } else if (firstUnplacedPiece.orientation === 'vertical') {
      orientation = 'horizontal'
    }
    // Update orientation for all unplaced pieces
    this.#pieces.filter(p => !p.placed).map(p => p.orientation = orientation);

    this.#refreshPiecesPaneUI(); // Re-render the pieces pane with new orientation

  }

  /**
   * @method handleRandomCommand to handle the random placement command
   * @param {Event} e - The event object
   * */
  handleRandomCommand(e) {
    e.preventDefault()
    // clear all the boards
    const oldBoards = document.querySelectorAll('.board-container')
    oldBoards.forEach(board => board.remove())
    this.#gameboard.resetPlayerBoard()
    this.#gameboard.resetComputerBoard()

    this.#player.board = this.#gameboard.playerBoard
    this.#computer.board = this.#gameboard.computerBoard

    // Reset placed status for all pieces before randomizing
    this.#pieces.forEach(p => p.placed = false);

    Utils.randomizeOrientation(this.#pieces)
    Utils.populateBoardRandomly(this.#gameboard, this.#pieces, this.#player)
    this.#player.ships = this.#gameboard.playerShips

    this.#pieces.forEach(p => p.placed = false); // Reset placed status for computer ships
    Utils.randomizeOrientation(this.#pieces)
    Utils.populateBoardRandomly(this.#gameboard, this.#pieces, this.#computer)
    this.#computer.ships = this.#gameboard.computerShips


    const control = document.querySelector('.control-container')
    const bController = new BoardController(this.#uimanager)
    const newBoard = bController.renderBoard(this.#player,
      null,
      (e, coords, pieceData) => this.handlePlayerCellDrop(e, coords, pieceData),
      (e, coords) => this.handlePlayerCellDragOver(e, coords),
      (e, coords) => this.handlePlayerCellDragEnter(e, coords),
      (e, coords) => this.handlePlayerCellDragLeave(e, coords),
      this.#gameMode,
      true // showShips for player's board
    )
    // Remove the old player board if it exists before adding the new one
    const oldPlayerBoardContainer = document.querySelector('.board-container.board-player-container');
    if (oldPlayerBoardContainer) {
      oldPlayerBoardContainer.remove();
    }
    control.before(newBoard) // Assuming the player board is placed before the control container
    this.#refreshPiecesPaneUI(); // Refresh pieces pane, all pieces should be 'placed' if successfully populated
  }

  /**
   * @method to handle the two player mode
   * @param {Event} e 
   * */
  handleTwoPlayerCommand(e) {
    e.preventDefault()

    this.#gameMode = 'two'

    // Clear existing boards
    document.querySelectorAll('.board-container').forEach(board => board.remove());

    this.#gameboard.resetPlayerBoard();
    this.#gameboard.resetComputerBoard();
    this.#player.board = this.#gameboard.playerBoard;
    this.#computer.board = this.#gameboard.computerBoard;

    // Place ships randomly for both players
    this.#pieces.forEach(p => p.placed = false); // Ensure all pieces are available for new random placement
    Utils.randomizeOrientation(this.#pieces);
    Utils.populateBoardRandomly(this.#gameboard, this.#pieces, this.#player);
    this.#player.ships = this.#gameboard.playerShips; // Update player ships after placement

    this.#pieces.forEach(p => p.placed = false); // Reset placed status for computer ships
    Utils.randomizeOrientation(this.#pieces);
    Utils.populateBoardRandomly(this.#gameboard, this.#pieces, this.#computer);
    this.#computer.ships = this.#gameboard.computerShips;

    // Set initial active players
    this.#currentPlayerTurn = this.#player; // Player 1 starts
    this.#currentOpponent = this.#computer; // Player 1 attacks Player 2's board

    // Remove the control pane to prepare for game boards
    const controlContainer = document.querySelector('.control-container');
    const controlPieces = controlContainer.querySelector('.control-pieces-section');
    if (controlPieces) {
      controlPieces.remove();
    }
    const controlPiecesMessage = controlContainer.querySelector('.control-pieces-message');
    if (controlPiecesMessage) {
      controlPiecesMessage.remove();
    }

    this.#renderTwoPlayerBoards(); // Display boards for the first player's turn

    // Disable 'random', 'rotate', 'two-player' buttons, enable 'reset'
    const startButton = document.querySelector('.command-start');
    const randomButton = document.querySelector('.command-random');
    const rotateButton = document.querySelector('.command-rotate');
    const twoplayerButton = document.querySelector('.command-two');
    if (startButton instanceof HTMLButtonElement && randomButton instanceof HTMLButtonElement && rotateButton instanceof HTMLButtonElement && twoplayerButton instanceof HTMLButtonElement) {
      startButton.disabled = true; // Game implicitly started
      randomButton.disabled = true;
      rotateButton.disabled = true;
      twoplayerButton.disabled = true;
    }

    // Initialize game object if it's not already
    if (!this.#game) {
      this.#game = new Game(this.#gameboard, this.#player, this.#computer);
    }
    this.#gameStartTime = Date.now(); // Start game timer
  }

  /**
   * Handle the reset command
   * @param {Event} e 
   * */
  handleResetCommand(e) {
    e.preventDefault()
    this.#gameboard.resetPlayerBoard()
    this.#gameboard.resetComputerBoard()

    this.#player.board = this.#gameboard.playerBoard
    this.#computer.board = this.#gameboard.computerBoard
    this.#player.ships = this.#gameboard.playerShips // Should be empty after resetPlayerBoard
    this.#computer.ships = this.#gameboard.computerShips // Should be empty after resetComputerBoard

    // reset into single player mode
    this.#gameMode = 'single'
    this.#currentPlayerTurn = null;
    this.#currentOpponent = null;
    this.#isPlayerSwitchPending = false;
    this.#game = null; // Clear game instance
    this.#gameStartTime = null; // Reset game time

    // Reset all pieces to 'unplaced' for the pieces pane
    this.#pieces.forEach(p => p.placed = false);

    // Refresh the player board
    this.#refreshPlayerBoardUI(this.#player);
    // Refresh the pieces pane
    this.#refreshPiecesPaneUI();

    // restore the buttons
    const startButton = document.querySelector('.command-start')
    const randomButton = document.querySelector('.command-random')
    const rotateButton = document.querySelector('.command-rotate')
    const twoplayerButton = document.querySelector('.command-two')

    if (startButton instanceof HTMLButtonElement
      && randomButton instanceof HTMLButtonElement
      && rotateButton instanceof HTMLButtonElement
      && twoplayerButton instanceof HTMLButtonElement) {
      startButton.disabled = false
      randomButton.disabled = false
      rotateButton.disabled = false
      twoplayerButton.disabled = false
    }

    const controlPiecesMessage = document.querySelector('.control-pieces-message')
    if (controlPiecesMessage) {
      controlPiecesMessage.remove()
    }

    // Ensure computer board (if present from previous game) is removed
    const controlContainer = document.querySelector('.control-container');
    const computerBoardElement = controlContainer.querySelector('.board-container.board-computer-container'); // Assuming computer board gets this class
    if (computerBoardElement) {
      computerBoardElement.remove();
    }
  }


  /**
   * handle the start of the game
   * @param {Event} e 
   * */
  handleStartCommand(e) {
    e.preventDefault()
    // NOTE make sure there are pieces on the board and player/computer ships are assigned before starting
    if (this.#player.ships.length === 0) {
      this.#displayModalError('You need to setup the board first before starting the game');
      return
    }

    if (this.#computer.ships.length === 0) {
      // NOTE computer not setup on drag and drop method, set the pc up
      Utils.randomizeOrientation(this.#pieces)
      Utils.populateBoardRandomly(this.#gameboard, this.#pieces, this.#computer)
      this.#computer.ships = this.#gameboard.computerShips
    }

    if (this.#gameMode === 'two') {
      // In two-player mode, ships are already placed by handleRandomCommand (called from handleTwoPlayerCommand).
      // The game boards are also rendered by handleTwoPlayerCommand.
      // Buttons should already be disabled. If not, this is a fallback.
      const startButton = document.querySelector('.command-start');
      const randomButton = document.querySelector('.command-random');
      const rotateButton = document.querySelector('.command-rotate');
      const twoplayerButton = document.querySelector('.command-two');

      if (startButton instanceof HTMLButtonElement && randomButton instanceof HTMLButtonElement && rotateButton instanceof HTMLButtonElement && twoplayerButton instanceof HTMLButtonElement) {
        startButton.disabled = true;
        randomButton.disabled = true;
        rotateButton.disabled = true;
        twoplayerButton.disabled = true;
      }
      // Game object and start time already set by handleTwoPlayerCommand
      return; // Don't proceed with single player specific board replacement
    }


    // Need to remove the pieces pane and replace it with computer board
    // Get the control container and replace it with a board-container
    const controlContainer = document.querySelector('.control-container')
    const controlPieces = document.querySelector('.control-pieces-section')
    const bController = new BoardController(this.#uimanager)
    const computerBoard = bController.renderBoard(this.#computer,
      (e) => this.handleCellClick(e), // Attack handler for computer board
      null, null, null, null, // No drag/drop handlers for computer board
      this.#gameMode,
      false // Do not show computer's ships
    )
    if (controlPieces) {
      controlContainer.replaceChild(computerBoard, controlPieces)
    } else {
      controlContainer.appendChild(computerBoard); // If for some reason pieces pane isn't there
    }

    // Buttons beside the reset need to be disabled
    const startButton = document.querySelector('.command-start')
    const randomButton = document.querySelector('.command-random')
    const rotateButton = document.querySelector('.command-rotate')
    const twoplayerButton = document.querySelector('.command-two')

    if (startButton instanceof HTMLButtonElement
      && randomButton instanceof HTMLButtonElement
      && rotateButton instanceof HTMLButtonElement
      && twoplayerButton instanceof HTMLButtonElement) {
      startButton.disabled = true
      randomButton.disabled = true
      rotateButton.disabled = true
      twoplayerButton.disabled = true
    }

    // NOTE fix for sticking message panel
    const controlPiecesMessage = document.querySelector('.control-pieces-message')
    if (controlPiecesMessage) {
      controlPiecesMessage.remove()
    }

    // setup game Object
    this.#game = new Game(this.#gameboard, this.#player, this.#computer);
    this.#gameStartTime = Date.now()

  }

  /**
     * Calculates the elapsed game time and formats it.
     * @returns {string} The formatted time (e.g., "2 minutes 30 seconds").
     */
  #calculateAndFormatGameTime() {
    if (this.#gameStartTime === null) {
      return 'N/A'; // Game was not started or timer already reset
    }

    const endTime = Date.now();
    const elapsedTimeMs = endTime - this.#gameStartTime;
    this.#gameStartTime = null; // Reset the timer after calculation

    const totalSeconds = Math.floor(elapsedTimeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let timeString = '';
    if (minutes > 0) {
      timeString += `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    if (seconds > 0) {
      if (timeString !== '') {
        timeString += ' ';
      }
      timeString += `${seconds} second${seconds === 1 ? '' : 's'}`;
    }
    if (timeString === '') {
      timeString = 'Less than a second';
    }
    return timeString;
  }

  openModal() {
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
    const container = document.querySelector('.modal')
    const modal = new ModalController(this.#uimanager)
    const m = modal.render('Jim', results, (e) => {
      if (container instanceof HTMLDivElement) {
        container.style.display = 'none'
      }
    })
    if (container instanceof HTMLDivElement)
      container.style.display = 'block'
    container.appendChild(m)
  }

  // --- Drag and Drop Helper Methods ---

  /**
   * Helper to get all cells a piece would occupy if placed at startCoords.
   * @param {number[]} startCoords - [row, col] of the starting cell.
   * @param {number} pieceLength - Length of the piece.
   * @param {string} orientation - 'horizontal' or 'vertical'.
   * @param {Array<Array<number>>} playerBoard - The current player's board grid.
   * @returns {Array<Array<number>> | null} An array of [row, col] pairs, or null if out of bounds.
   */
  #getCellsForPlacement(startCoords, pieceLength, orientation, playerBoard) {
    const [startRow, startCol] = startCoords;
    const cells = [];
    const boardSize = playerBoard.length;

    for (let i = 0; i < pieceLength; i++) {
      let row, col;
      if (orientation === 'horizontal') {
        row = startRow;
        col = startCol + i;
      } else { // vertical
        row = startRow + i;
        col = startCol;
      }

      // Check boundaries
      if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return null; // Out of bounds
      }
      cells.push([row, col]);
    }
    return cells;
  }

  /**
   * Checks if a piece placement is valid (within bounds and no overlaps).
   * @param {number[]} startCoords - [row, col] of the starting cell.
   * @param {number} pieceLength - Length of the piece.
   * @param {string} orientation - 'horizontal' or 'vertical'.
   * @param {Array<Array<number>>} playerBoard - The current player's board grid.
   * @returns {boolean} True if placement is valid, false otherwise.
   */
  #isValidPlacement(startCoords, pieceLength, orientation, playerBoard) {
    const cells = this.#getCellsForPlacement(startCoords, pieceLength, orientation, playerBoard);
    if (!cells) return false; // Out of bounds

    // Check for overlaps with existing ships (value 1)
    for (const [r, c] of cells) {
      if (playerBoard[r][c] === 1) {
        return false; // Overlapping
      }
    }
    return true;
  }

  /**
   * Handles dragover event on player board cells for visual feedback.
   * @param {DragEvent} e - The drag event object.
   * @param {number[]} coords - [row, col] of the cell being dragged over.
   */
  handlePlayerCellDragOver(e, coords) {
    e.preventDefault(); // Crucial to allow a drop
  }

  /**
   * Handles dragenter event on player board cells for visual feedback.
   * @param {DragEvent} e - The drag event object.
   * @param {number[]} coords - [row, col] of the cell being entered.
   */
  handlePlayerCellDragEnter(e, coords) {
    e.preventDefault();
    const pieceData = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (pieceData) {
      const isValid = this.#isValidPlacement(coords, pieceData.length, pieceData.orientation, this.#player.board);
      const cellsToHighlight = this.#getCellsForPlacement(coords, pieceData.length, pieceData.orientation, this.#player.board);
      if (cellsToHighlight) {
        cellsToHighlight.forEach(([r, c]) => {
          const el = document.querySelector(`.board-player-container .board-cell[data-id="${r},${c}"]`);
          if (el) {
            el.classList.add(isValid ? 'drag-valid' : 'drag-invalid');
          }
        });
      }
    }
  }

  /**
   * Handles dragleave event on player board cells to remove visual feedback.
   * @param {DragEvent} e - The drag event object.
   * @param {number[]} coords - [row, col] of the cell being left.
   */
  handlePlayerCellDragLeave(e, coords) {
    e.preventDefault();
    // Clear the feedback for the cells that were potentially highlighted by this drag.
    // We cannot use e.dataTransfer.getData here reliably on dragleave,
    // so it's better to clear more broadly or track the active drag.
    // For now, if the drag is still active, we get the pieceData.
    const pieceData = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
    if (pieceData.length && pieceData.orientation) { // Check if pieceData is valid
      this.#clearDragFeedback(coords, pieceData.length, pieceData.orientation);
    }
  }

  /**
   * Handles the drop event to place a piece on the player's board.
   * @param {DragEvent} e - The drag event object.
   * @param {number[]} coords - [row, col] of the cell where the piece was dropped.
   * @param {Object} pieceData - Data about the dropped piece (length, orientation, id).
   */
  handlePlayerCellDrop(e, coords, pieceData) {
    e.preventDefault();
    const [row, col] = coords;
    const { length, orientation, pieceId } = pieceData;

    // Clear any drag feedback for the dropped piece's potential area
    this.#clearDragFeedback(coords, length, orientation);


    if (this.#isValidPlacement([row, col], length, orientation,
      this.#player.board)
      && this.#player.ships.length < 9) {
      // Create a Ship object using the existing Ship class structure
      const newShip = new Ship(pieceId, length, orientation);
      const placementResult = this.#gameboard.placeShip(newShip, coords, this.#player.board); // Pass this.#player.board


      if (placementResult) { // gameboard.placeShip returns true on success, false on failure
        // Mark the piece as placed in the internal array
        const placedPiece = this.#pieces.find(p => p.id === pieceId);
        if (placedPiece) {
          placedPiece.placed = true;
        }

        this.#refreshPlayerBoardUI(this.#player); // Re-render player's board
        this.#refreshPiecesPaneUI(); // Re-render pieces pane to remove the placed piece
      } else {
        // The #gameboard.placeShip already handles out of bounds or collision and returns false.
        // #isValidPlacement should catch most of these, but this is a fallback.
        this.#displayModalError('Failed to place ship due to an internal error or unexpected condition. Please try again.');
      }
    } else {
      console.log('Placement is invalid (out of bounds or overlap).');
      this.#displayModalError('Invalid placement: overlaps with an existing ship or out of bounds.');
    }
  }

  /**
     * Helper to clear drag feedback (e.g., 'drag-valid', 'drag-invalid' classes) from cells.
     * @param {number[]} startCoords - The starting coordinates where the drag effect began.
     * @param {number} pieceLength - The length of the piece being dragged.
     * @param {string} orientation - The orientation of the piece.
     */
  #clearDragFeedback(startCoords, pieceLength, orientation) {
    const cellsToClear = this.#getCellsForPlacement(startCoords, pieceLength, orientation, this.#player.board);
    if (cellsToClear) {
      cellsToClear.forEach(([r, c]) => {
        const el = document.querySelector(`.board-player-container .board-cell[data-id="${r},${c}"]`);
        if (el) {
          el.classList.remove('drag-valid', 'drag-invalid');
        }
      });
    }
  }

  /**
   * Helper to refresh the player's board UI.
   * @param {Player} player - The player whose board to refresh.
   */
  #refreshPlayerBoardUI(player) {
    const oldBoardContainer = document.querySelector('.board-container.board-player-container');
    if (!oldBoardContainer) {
      console.error('Player board container not found for refresh.');
      return;
    }
    const bController = new BoardController(this.#uimanager);
    const newBoardUI = bController.renderBoard(player,
      null,
      (e, coords, pieceData) => this.handlePlayerCellDrop(e, coords, pieceData),
      (e, coords) => this.handlePlayerCellDragOver(e, coords),
      (e, coords) => this.handlePlayerCellDragEnter(e, coords),
      (e, coords) => this.handlePlayerCellDragLeave(e, coords),
      this.#gameMode,
      true // show ships on player's board during setup
    );
    if (oldBoardContainer.parentNode) {
      oldBoardContainer.parentNode.replaceChild(newBoardUI, oldBoardContainer);
    }
  }

  /**
   * Helper to refresh the pieces pane UI.
   */
  #refreshPiecesPaneUI() {
    const controlContainer = document.querySelector('.control-container');
    let oldPiecesPane = controlContainer.querySelector('.control-pieces-section');
    const piecesPane = new PiecesPane(this.#uimanager);

    const firstUnplacedPiece = this.#pieces.find(p => !p.placed);
    const currentOrientation = firstUnplacedPiece ? firstUnplacedPiece.orientation : 'horizontal';

    // FIX: Pass the *full* #pieces array. The PiecesPane class will filter out placed pieces internally.
    const newPiecesPane = piecesPane.renderPane(this.#pieces, currentOrientation);

    if (oldPiecesPane) {
      controlContainer.replaceChild(newPiecesPane, oldPiecesPane);
    } else {
      // If oldPiecesPane wasn't found (e.g., initial setup or after random placement clear),
      // ensure we add it if there are still unplaced pieces.
      // FIX to replace the computer board with pieces elements on reset
      const computerElement = document.querySelector('.control-container .board-container')
      if (computerElement) {
        controlContainer.replaceChild(newPiecesPane, computerElement)
      } else {
        controlContainer.appendChild(newPiecesPane);
      }
      oldPiecesPane = newPiecesPane; // Update reference if newly added
    }

    // After rendering, if there are no unplaced pieces, remove or replace the pane
    if (!firstUnplacedPiece && oldPiecesPane) {
      oldPiecesPane.remove();
      const messageElement = this.#uimanager.addElement('div', controlContainer, 'control-pieces-message');
      messageElement.textContent = 'All ships placed!';
      messageElement.style.textAlign = 'center';
      messageElement.style.padding = '20px';
      messageElement.style.border = '1px dashed #ccc';
    }
  }

  /**
     * Helper to render boards for two-player mode, switching views.
     */
  #renderTwoPlayerBoards() {
    const appContainer = this.#appContainer;
    // Clear all existing board UIs from the app container
    appContainer.querySelectorAll('.board-container').forEach(el => el.remove());

    const bController = new BoardController(this.#uimanager);

    // Render current player's own board (with ships, NOT clickable for attack)
    const currentPlayerOwnBoardUI = bController.renderBoard(
      this.#currentPlayerTurn,
      null, // No attack handler on own board
      null, null, null, null, // No drag/drop during game
      this.#gameMode,
      true // Show ships for the owner's board
    );
    currentPlayerOwnBoardUI.classList.add('current-player-own-board');

    // Render opponent's board (NO ships displayed, IS clickable for attack)
    const opponentBoardUI = bController.renderBoard(
      this.#currentOpponent,
      (e) => this.handleCellClick(e), // Attach attack handler to opponent's board
      null, null, null, null, // No drag/drop during game
      this.#gameMode,
      false // DO NOT show ships for the opponent's board
    );
    opponentBoardUI.classList.add('opponent-board-for-attack');

    // Append boards to the main app container
    const controlContainer = document.querySelector('.control-container')
    controlContainer.before(currentPlayerOwnBoardUI)
    // appContainer.appendChild(currentPlayerOwnBoardUI);
    const controlCommand = document.querySelector('.command-pane')
    controlCommand.before(opponentBoardUI)
    // appContainer.appendChild(opponentBoardUI);
  }

  /**
     * Helper to display a modal for player switching.
     * @param {string} fromPlayerName - The name of the player whose turn just ended.
     * @param {string} toPlayerName - The name of the player whose turn is next.
     */
  #displaySwitchPlayerModal(fromPlayerName, toPlayerName) {
    const modal = new ModalController(this.#uimanager);
    const modalUI = document.querySelector('.modal');
    const m = modal.renderMessage(
      {
        type: 'Player Switch',
        message: `Player ${fromPlayerName}'s turn ended. It's now Player ${toPlayerName}'s turn. Click to continue.`
      },
      (e) => {
        if (modalUI instanceof HTMLDivElement) {
          modalUI.style.display = 'none';
          modalUI.removeChild(m);
          this.#appContainer.classList.remove('blurred');
          this.#isPlayerSwitchPending = false; // Allow clicks again after modal is closed

          // Toggle active and opponent players for the next turn
          const tempPlayer = this.#currentPlayerTurn;
          this.#currentPlayerTurn = this.#currentOpponent;
          this.#currentOpponent = tempPlayer;

          this.#renderTwoPlayerBoards(); // Re-render boards for the new active player
        }
      }
    );
    if (modalUI) {
      modalUI.appendChild(m);
      if (modalUI instanceof HTMLDivElement) {
        modalUI.style.display = 'flex';
        this.#appContainer.classList.add('blurred');
      }
    }
  }

  /**
   * Helper to display error messages in a modal.
   * @param {string} message - The error message to display.
   */
  #displayModalError(message) {
    const modal = new ModalController(this.#uimanager)
    const modalUI = document.querySelector('.modal')
    const m = modal.renderMessage(
      {
        type: 'Error',
        message: message
      },
      (e) => {
        if (modalUI instanceof HTMLDivElement) {
          modalUI.style.display = 'none'
          modalUI.removeChild(m)
          this.#appContainer.classList.remove('blurred')
        }
      })
    if (modalUI) {
      modalUI.appendChild(m)
      if (modalUI instanceof HTMLDivElement) {
        modalUI.style.display = 'flex'
        this.#appContainer.classList.add('blurred')
      }
    }
  }
}

/**
 * @module AppController
 * */
export default AppController
