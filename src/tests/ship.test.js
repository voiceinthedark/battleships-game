import Ship from "../modules/ship.js"

describe('Battleship module tests', () => {
  let ship;
  beforeAll(() => {
    ship = new Ship('battleship', 5);
  })

  describe('Ship instance init', () => {
    test('ship should be an instance of Ship module', () => {
      expect(ship).toBeInstanceOf(Ship)
    })

    test('ship should return the correct name provided in the constructor', () => {
      expect(ship.name).toBe('battleship')
    })

    test('ship should return the provided length', () => {
      expect(ship.length).toBe(5)
    })
  })

  describe('hit method tests', () => {
    let s = new Ship('Carrier', 6, 'horizontal', [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]])
    test('hit on a ship coordinates returns true', () => {
      expect(s.hit([0, 5])).toBeTruthy()

    })
  })

  describe('isSunk method tests', () => {
    let s;
    beforeEach(() => {
      s = new Ship('submarine', 3, 'horizontal', [[0, 3], [0, 4], [0, 5]])
    })
    test('if ship is not fully hit, isSunk returns false', () => {
      expect(s.isSunk()).toBeFalsy()
    })
    test('Ship fully hit returns true', () => {
      s.hit([0, 3])
      s.hit([0, 4])
      s.hit([0, 5])
      expect(s.isSunk()).toBeTruthy()
    })

    test('ship partially hit is not sunk', () => {
      s.hit([0, 3])
      s.hit([0, 4])
      expect(s.isSunk()).toBeFalsy()
    })

  })
})
