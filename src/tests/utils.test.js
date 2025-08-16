import Square from "../modules/square.js"
import Utils from "../modules/utils.js"

describe('Utils helper methods', () => {
  describe('initCoords helper method tests', () => {
    test('initCoords returns an array', () => {
      expect(Utils.initCoords([[0,2], [0,3]])).toBeInstanceOf(Array)
    })

    test('the returned array is an array of Squares', () => {
      expect(Utils.initCoords([[0,2], [0,3]])[0]).toBeInstanceOf(Square)
    })
  })
})
