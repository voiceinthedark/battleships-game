import Square from '../modules/square.js';

describe('Square module tests', () => {
  let square;
  beforeAll(() => {
    square = new Square();
  });

  describe('Square initiation', () => {
    test('default initialization correctly applied', () => {
      expect(square.x).toBe(0);
      expect(square.y).toBe(0);
      expect(square.isHit()).toBeFalsy();
    });
  });
});
