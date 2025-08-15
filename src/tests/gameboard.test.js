import GameBoard from "../modules/gameboard.js"

describe('Gameboard module tests', () => {
  let gameboard;
  beforeAll(() => {
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
})
