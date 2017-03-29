'use-strict'
/* eslint-env mocha */
/* eslint-disable handle-callback-err: "error" */
// var chai = require('chai')
var AlertService = require('../controllers/AlertService')
var sinon = require('sinon')
var nodemailer = require('nodemailer')
var config = require('config')
var twilioClient = require('../utils/twilioClient')


describe('Alerts', () => {
  it('Should send confirmation text', (done) => {
    var twilioStub = sinon.stub(twilioClient, 'sendSms')
    var trip = createTrip()
    var user = createUser()

    AlertService.confirmEmergencyContactSMS(trip, user)
    sinon.assert.called(twilioStub)
    twilioStub.restore()
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

var createUser = function () {
  var user = {
    id: 12,
    created_at: '2017-03-27T06:00:35.060Z',
    updated_at: '2017-03-28T22:29:47.341Z',
    email: 'boll@gmail.com',
    firstName: 'string',
    lastName: 'string',
    phoneNumber: '7785583029',
    __v: 34,
    trips: []
  }
  return user
}
