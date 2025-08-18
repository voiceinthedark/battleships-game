import Square from '../modules/square.js';
import Ship from '../modules/ship.js';

describe('Battleship module tests', () => {
  let ship;
  beforeAll(() => {
    ship = new Ship('battleship', 5, 'horizontal');
  });

  describe('Ship instance init', () => {
    test('ship should be an instance of Ship module', () => {
      expect(ship).toBeInstanceOf(Ship);
    });

    test('ship should return the correct name provided in the constructor', () => {
      expect(ship.name).toBe('battleship');
    });

    test('ship should return the provided length', () => {
      expect(ship.length).toBe(5);
    });
  });

  describe('hit method tests', () => {
    let s = new Ship('Carrier', 6, 'horizontal', [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ]);
    test('hit on a ship coordinates returns true', () => {
      expect(s.hit([0, 5])).toBeTruthy();
    });

    test('empty hits return false', () => {
      expect(s.hit()).toBeFalsy();
    });
    test('out of coords hits are falsy', () => {
      expect(s.hit([1, 1])).toBeFalsy();
    });
  });

  describe('isSunk method tests', () => {
    let s;
    beforeEach(() => {
      s = new Ship('submarine', 3, 'horizontal', [
        [0, 3],
        [0, 4],
        [0, 5],
      ]);
    });
    test('if ship is not fully hit, isSunk returns false', () => {
      expect(s.isSunk()).toBeFalsy();
    });

    test('Ship fully hit returns true', () => {
      s.hit([0, 3]);
      s.hit([0, 4]);
      s.hit([0, 5]);
      expect(s.isSunk()).toBeTruthy();
    });

    test('ship partially hit is not sunk', () => {
      s.hit([0, 3]);
      s.hit([0, 4]);
      expect(s.isSunk()).toBeFalsy();
    });
  });

  describe('coordinates property', () => {
    let s;
    beforeEach(() => {
      s = new Ship('submarine', 3, 'horizontal', [
        [0, 3],
        [0, 4],
        [0, 5],
      ]);
    });
    test('coordinates is an array of length 3', () => {
      expect(s.coordinates).toHaveLength(3);
    });

    test('coordinates is an array of Squares', () => {
      expect(s.coordinates[0]).toBeInstanceOf(Square);
    });

    test('When hit, the ship square is marked true', () => {
      s.hit([0, 3]);
      expect(s.coordinates[0].isHit()).toBeTruthy();
    });

    test('None hit coords are marked false', () => {
      expect(s.coordinates[0].isHit()).toBeFalsy();
    });
  });

  describe('orientation property', () => {
    test('orientation returns the correct default value', () => {
      expect(ship.orientation).toEqual('horizontal');
    });
  });
});
