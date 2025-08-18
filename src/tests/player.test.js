import Utils from '../modules/utils.js';
import GameBoard from '../modules/gameboard.js';
import Player from '../modules/player.js';

describe('Player module tests', () => {
  let g;
  let p;
  let c;
  let obj;
  beforeAll(() => {
    g = new GameBoard(10, 10);
    p = new Player('player', g.playerBoard);
    c = new Player('computer', g.computerBoard);
    p.ships = g.playerShips;
    c.ships = g.computerShips;
    obj = [
      { length: 6, orientation: 'horizontal' },
      { length: 5, orientation: 'vertical' },
      { length: 4, orientation: 'vertical' },
      { length: 3, orientation: 'horizontal' },
      { length: 3, orientation: 'vertical' },
    ];
  });

  test('player board is the same as the gameboard playerboard', () => {
    Utils.populateBoardRandomly(g, obj, p);
    expect(p.board).toStrictEqual(g.playerBoard);
  });

  test('computerBoard is the same as the gameboard computerBoard', () => {
    Utils.populateBoardRandomly(g, obj, c);
    expect(c.board).toStrictEqual(g.computerBoard);
  });

  test('player ships are initialized at 5 and are equal to gameboard player ships', () => {
    Utils.populateBoardRandomly(g, obj, p);
    expect(p.ships).toStrictEqual(g.playerShips);
  });
  test('computer ships are initialized at 5 and are equal to gameboard computer ships', () => {
    Utils.populateBoardRandomly(g, obj, c);
    expect(c.ships).toStrictEqual(g.computerShips);
  });
});
