import { isSimilarLocation } from './weather.utils'

describe('Weather Utils', () => {
  describe('isSimilarLocation', () => {
    it('Should properly determine distances between locations', () => {
      const budapest6 = { latitude: 47.5134983, longitude: 19.0649846 }
      const budapest7 = { latitude: 47.501443, longitude: 19.075021 }
      expect(isSimilarLocation(budapest6, budapest7)).toBeTrue()

      const vecses = { latitude: 47.405926, longitude: 19.258626 }
      expect(isSimilarLocation(budapest6, vecses)).toBeFalse()

      const zsambok = { latitude: 47.54264950960202, longitude: 19.607144903616344 }
      const dany = { latitude: 47.52277257966394, longitude: 19.55684812300936 }
      expect(isSimilarLocation(dany, zsambok)).toBeTrue()

      const nairobi = { latitude: -1.2712870140731503, longitude: 36.789373142136355 }
      const pavlohrad = { latitude: 48.53929579758578, longitude: 35.86726080333544 }
      expect(isSimilarLocation(nairobi, pavlohrad)).toBeFalse()

      const someLocation1 = { latitude: -13.11223, longitude: 54.222334 }
      const someLocation2 = { latitude: 13.11223, longitude: -54.222334 }
      expect(isSimilarLocation(someLocation1, someLocation2)).toBeFalse()

      const someLocation3 = { latitude: -13.11223, longitude: -54.222334 }
      const someLocation4 = { latitude: 13.11223, longitude: 54.222334 }
      expect(isSimilarLocation(someLocation3, someLocation4)).toBeFalse()
    })
  })
})
