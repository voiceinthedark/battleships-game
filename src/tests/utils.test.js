import Square from "../modules/square.js"
import Utils from "../modules/utils.js"

describe('Utils helper methods', () => {
  describe('initCoords helper method tests', () => {
    test('initCoords returns an array', () => {
      expect(Utils.initCoords([[0, 2], [0, 3]])).toBeInstanceOf(Array)
    })

    test('the returned array is an array of Squares', () => {
      expect(Utils.initCoords([[0, 2], [0, 3]])[0]).toBeInstanceOf(Square)
    })
  })

  describe('getCoordinatesFromPoint helper method tests', () => {
    test('should return an array', () => {
      expect(Utils.getCoordinatesFromPoint([0, 3], 3, 'horizontal')).toBeInstanceOf(Array)
    })

    test('should return an array of the exact length', () => {
      expect(Utils.getCoordinatesFromPoint([0, 3], 3, 'horizontal')).toHaveLength(3)
    })
    test('should return correct coordinates', () => {
      expect(Utils.getCoordinatesFromPoint([0, 3], 3, 'horizontal')).toContainEqual([0, 5])
    })
    test('should return correct coordinates', () => {
      expect(Utils.getCoordinatesFromPoint([0, 3], 3, 'horizontal')).not.toContainEqual([0, 6])
    })

    test('should take into accont orientation', () => {
      expect(Utils.getCoordinatesFromPoint([0, 3], 4, 'vertical')).toContainEqual([3, 3])
      expect(Utils.getCoordinatesFromPoint([0, 3], 4, 'vertical')).not.toContainEqual([3, 4])
      expect(Utils.getCoordinatesFromPoint([0, 3], 4, 'vertical')).not.toContainEqual([0, 6])
    })

  })

  describe('isIntersect method tests', () => {
    let coords = [[0,3], [0,4], [0,5]]
    let coords2 = [[0,0], [1,0], [2,0]]
    let board = [
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
    test('returns true if there is a collision point on the board', () => {
      expect(Utils.isInteresect(coords, board)).toBeTruthy()
    })

    test('Should return false if there are no collision', () => {
      expect(Utils.isInteresect(coords2, board)).toBeFalsy()
    })
  })

  describe('pointOfCollision method tests', () => {
    let coords = [[0,3], [0,4], [0,5]]
    let coords2 = [[0,0], [1,0], [2,0]]
    let board = [
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
    test('method should return the exact point of collision', () => {
      expect(Utils.pointOfCollision(coords, board)).toEqual([0, 4])
    })

    test('method should return null when there is no collision', () => {
      expect(Utils.pointOfCollision(coords2, board)).toBeNull()
    })
  })
})
