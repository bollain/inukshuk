/* eslint-env mocha */
/* eslint-disable handle-callback-err: "error" */
var chai = require('chai')
var chaiHttp = require('chai-http')
var index = require('../index.js')
var sinon = require('sinon')
var should = chai.should() // eslint-disable-line
var Trip = require('../models/Trip')
var User = require('../models/User')
var AlertService = require('../controllers/AlertService')

chai.use(chaiHttp)

describe('Trip', () => {
  beforeEach((done) => { // Before each test we empty the database
    Trip.remove({}, (err) => {
      if (err) {} // I dont like this hack but the linter complains
    })
    User.remove({}, (err) => {
      if (err) {}
    })
    done()
  })

  /* Test the POST endpoint */
  describe('POST Trip', () => {
    it('Should post a trip and create alerts', (done) => {
      // First stub some stuff
      var confirmEmergencyContactSMS = sinon.stub(AlertService, 'confirmEmergencyContactSMS')
      var confirmEmergencyContactEmail = sinon.stub(AlertService, 'confirmEmergencyContactEmail')
      var createEmailAlert = sinon.stub(AlertService, 'createEmailAlert')
      var createSMSAlert = sinon.stub(AlertService, 'createSMSAlert')

      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        var trip = createTrip()
        trip.userId = user._id
        if (err) { console.log(err) }
        chai.request(index)
              .post('/trips')
              .send(trip)
              .end((err, res) => {
                if (err) { console.log(err) }
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('_id')
                // Confirm all my AlertService stubs were called
                sinon.assert.called(confirmEmergencyContactSMS)
                sinon.assert.called(confirmEmergencyContactEmail)
                sinon.assert.called(createEmailAlert)
                sinon.assert.called(createSMSAlert)
                // And now restore them
                confirmEmergencyContactEmail.restore()
                confirmEmergencyContactSMS.restore()
                createEmailAlert.restore()
                createSMSAlert.restore()
                done()
              })
      })
    })

    it('Should not create a trip for non-existent user', (done) => {
      var trip = createTrip()
      chai.request(index)
          .post('/trips')
          .send(trip)
          .end((err, res) => {
            if (err) { }
            res.should.have.status(404)
            done()
          })
    })

    it('Should not create a trip with a bad contact email', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        var trip = createTrip()
        trip.userId = user._id
        trip.contactEmail = 'bademail'
        if (err) {}
        chai.request(index)
              .post('/trips')
              .send(trip)
              .end((err, res) => {
                if (err) { }
                res.should.have.status(401)
                done()
              })
      })
    })

    it('Should not create a trip with a bad contact phone', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'pepito@gmail.com'
      })
      existingUser.save((err, user) => {
        var trip = createTrip()
        trip.userId = user._id
        trip.contactPhone = '420'
        if (err) {}
        chai.request(index)
              .post('/trips')
              .send(trip)
              .end((err, res) => {
                if (err) { }
                res.should.have.status(401)
                done()
              })
      })
    })
  })

  describe('/DELETE Trip', () => {
    it('Should delete a trip', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'miguelito@gmail.com'
      })
      existingUser.save((err, user) => {
        var trip = new Trip({
          userId: user._id,
          tripName: 'MyTestTrip',
          returnTime: '2017-03-26T22:34:33.649Z',
          contactEmail: 'bollain@gmail.com',
          contactPhone: '7785583029',
          startingLocation: {
            latitude: 0,
            longitude: 0
          },
          endingLocation: {
            latitude: 0,
            longitude: 0
          },
          breadCrumbs: [
            {
              latitude: 0,
              longitude: 0
            }
          ],
          note: 'string',
          completed: false
        })
        if (err) { console.log(err) }

        trip.save((err, trip) => {
          if (err) { console.log(err) }
          chai.request(index)
              .delete('/trips/' + trip._id)
              .end((err, res) => {
                res.should.have.status(200)
                if (err) {}
                done()
              })
        })
      })
    })

    it('Should fail on non-existent trips', (done) => {
      chai.request(index)
          .delete('/trips/' + 420)
          .end((err, res) => {
            res.should.have.status(404)
            if (err) {}
            done()
          })
    })
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
      latitude: 0,
      longitude: 0
    },
    endingLocation: {
      latitude: 0,
      longitude: 0
    },
    breadCrumbs: [
      {
        latitude: 0,
        longitude: 0
      }
    ],
    note: 'string',
    completed: false
  }
  return trip
}
