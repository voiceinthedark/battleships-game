import Ship from "../modules/ship.js";
import GameBoard from "../modules/gameboard.js"

describe('Gameboard module tests', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new GameBoard();
  })

  describe('Gameboard instance tests', () => {
    test('default instance of gameboard initialize the object correctly', () => {
      expect(gameboard).toBeInstanceOf(GameBoard)
    })

    test('default instance returns a width and height of 14 for the gameboard', () => {
      expect(gameboard.height).toBe(14)
      expect(gameboard.width).toBe(14)
    })
  })

  describe('gambeboards properties tests', () => {
    test('playerBoard returns an array', () => {
      expect(gameboard.playerBoard).toBeInstanceOf(Array)
    })
    test('computerBoard returns an array', () => {
      expect(gameboard.computerBoard).toBeInstanceOf(Array)
    })

    test('playerBoard is of 14 length by default', () => {
      expect(gameboard.playerBoard).toHaveLength(14)
    })
    test('playerBoard is filled with 0s', () => {
      expect(gameboard.playerBoard.every(a => a.every(b => b === 0))).toBeTruthy()
    })
  })

  describe('placeShip method tests', () => {
    test('placing ship inside bounds return true', () => {
      let ship = new Ship('test', 5, 'horizontal', [[0, 5], [0, 6], [0, 7], [0, 8], [0, 9]])
      expect(gameboard.placeShip(ship, [0, 5], gameboard.playerBoard)).toBeTruthy()
    })

    test('placing ship outside of bounds should return false', () => {
      let ship = new Ship('test', 5, 'horizontal')
      expect(gameboard.placeShip(ship, [0, 11], gameboard.playerBoard)).toBeFalsy()
    })

    test('if another ship occupies a cell placeShip should return false', () => {
      let ship = new Ship('t1', 5, 'horizontal')
      let ship2 = new Ship('t2', 3, 'vertical')
      // They collide at [0, 5]
      expect(gameboard.placeShip(ship, [0, 5], gameboard.playerBoard)).toBeTruthy()
      expect(gameboard.placeShip(ship2, [0, 5], gameboard.playerBoard)).toBeFalsy()
    })

    test('placing two ships that do not collide works correctly', () => {
      let s = new Ship('t1', 5, 'horizontal')
      let s2 = new Ship('t2', 3, 'vertical')

      expect(gameboard.placeShip(s, [0, 0], gameboard.playerBoard)).toBeTruthy()
      expect(gameboard.placeShip(s2, [4, 5], gameboard.playerBoard)).toBeTruthy()
      expect(gameboard.playerShips).toHaveLength(2)
    })


  })
})
