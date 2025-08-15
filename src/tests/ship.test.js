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
    test('hitting a ship should return true when hit', () => {
      expect(ship.hit()).toBeTruthy()
    })
  })

  describe('isSunk method tests', () => {
    test('if ship is not fully hit, isSunk returns false', () => {
      expect(ship.isSunk()).toBeFalsy()
    })
    test('Ship fully hit returns true', () => {
      ship.hit()
      ship.hit()
      ship.hit()
      ship.hit()
      ship.hit()
      expect(ship.isSunk()).toBeTruthy()
    })
  })
})
