/* eslint-env mocha */
/* eslint-disable handle-callback-err: "error" */
var chai = require('chai')
var StaticMap = require('../utils/staticmap')

describe('StaticMap Util', () => {
  it('should generate corect URL', (done) => {
    var trip = createTrip()
    var staticURL = StaticMap.generateStaticMapURL(trip)
    var expected = 'http://maps.google.com/maps/api/staticmap?size=512x512&maptype=hybrid&path=color:red|weight:5|45.123,-123.595|46.456,-124.985|46.856,-124.685&&markers=color:blue|label:S|46.866,-124.185&&markers=color:blue|label:F|45.123,-123.595&AIzaSyD2xZoo-Et69gVY2ot-uwhKcqvQ4e_FP6s'
    chai.expect(staticURL).to.equal(expected)
    done()
  })
})

var createTrip = function () {
  var trip = {
    userId: 0,
    tripName: 'MyTestTrip',
    returnTime: '2017-03-26T22:34:33.649Z',
    contactEmail: 'bollain@gmail.com',
    contactPhone: '7785583029',
    startingLocation: {
      coordinates: [46.866, -124.185]
    },
    endingLocation: {
      coordinates: [45.123, -123.595]
    },
    breadCrumbs: [
      {
        coordinates: [
          45.123,
          -123.595
        ]
      },
      {
        coordinates: [
          46.456,
          -124.985
        ]
      },
      {
        coordinates: [
          46.856,
          -124.685
        ]
      }
    ],
    note: 'string',
    completed: false
  }
  return trip
}
