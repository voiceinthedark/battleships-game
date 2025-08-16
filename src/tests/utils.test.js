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
})
