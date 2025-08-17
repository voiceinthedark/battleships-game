import Ship from "../modules/ship.js";
import GameBoard from "../modules/gameboard.js"
import Square from "../modules/square.js";

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
    test('boards are distinct, placing ships in same coordinates on different board is valid', () => {
      let s = new Ship('t1', 5, 'horizontal')
      let s2 = new Ship('t2', 3, 'vertical')

      expect(gameboard.placeShip(s, [5, 5], gameboard.playerBoard)).toBeTruthy()
      expect(gameboard.placeShip(s2, [5, 5], gameboard.computerBoard)).toBeTruthy()
    })
    test('A generic ship will get assigned its coordinates by placeship method', () => {
      let s = new Ship('t1', 3, 'horizontal')
      gameboard.placeShip(s, [5, 5], gameboard.playerBoard);
      expect(s.coordinates).toHaveLength(3)
      expect(s.coordinates.at(0)).toBeInstanceOf(Square)
      expect(s.coordinates.at(0)).toEqual(new Square(5, 5))
      expect(s.coordinates.at(0)).not.toEqual(new Square(5, 3))
    })
  })

  describe('receiveAttack method tests', () => {
    let g = new GameBoard()
    let s = new Ship('Carrier', 6, 'horizontal')
    let s2 = new Ship('Destroyer', 5, 'vertical')
    let s3 = new Ship('Gunboat', 2, 'horizontal')

    let c = new Ship('Carrier', 6, 'horizontal')
    let c2 = new Ship('Destroyer', 5, 'vertical')
    let c3 = new Ship('Gunboat', 2, 'horizontal')
    beforeAll(() => {
      g.placeShip(s, [0, 0], g.playerBoard)
      g.placeShip(s2, [4, 6], g.playerBoard)
      g.placeShip(s3, [8, 9], g.playerBoard)

      g.placeShip(c, [0, 0], g.computerBoard)
      g.placeShip(c2, [8, 4], g.computerBoard)
      g.placeShip(c3, [10, 3], g.computerBoard)
    })
    test('Hitting an empty space on the board is a miss', () => {
      expect(g.receiveAttack([1, 1], g.playerBoard)).toBeFalsy()
    })
    test('The miss hit is marked on the corresponding board', () => {
      g.receiveAttack([1, 1], g.playerBoard)
      expect(g.playerBoard[1][1]).toEqual(-1)
    })
    test('hitting a ship square will causes the ship to be hit on that square', () => {
      g.receiveAttack([0, 4], g.playerBoard)
      expect(g.playerBoard[0][4]).toEqual(9)
    })
    test('the hit ship will get one if its squares marked', () => {
      g.receiveAttack([0, 4], g.playerBoard)
      expect(g.playerShips.at(0).coordinates.at(4).isHit()).toBeTruthy()
    })
    test('computer board hits are distinct from playerBoard hits', () => {
      g.receiveAttack([0, 4], g.playerBoard)
      expect(g.computerBoard[0][4]).toEqual(1)
      expect(g.playerBoard[0][4]).toEqual(9)
    })
    test('computer ships hit are distinct and calculated separately from player ships', () => {
      expect(g.computerBoard[9][4]).toEqual(1)
      g.receiveAttack([9, 4], g.computerBoard) // computer Destroyer (2) hit
      expect(g.computerBoard[9][4]).toEqual(9)
      expect(g.playerBoard[9][4]).toEqual(0)
    })
  })
})
