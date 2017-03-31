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
  describe('/POST Trip', () => {
    it('Should post a trip and create alerts', (done) => {
      // First stub some stuff
      var confirmEmergencyContactSMS = sinon.stub(AlertService, 'confirmEmergencyContactSMS')
      var confirmEmergencyContactEmail = sinon.stub(AlertService, 'confirmEmergencyContactEmail')
      var createEmailAlert = sinon.stub(AlertService, 'createEmailAlert')
      var createSMSAlert = sinon.stub(AlertService, 'createSMSAlert')
      var confirmAlertsWithUser = sinon.stub(AlertService, 'confirmAlertsWithUser')

      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
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
                sinon.assert.called(confirmAlertsWithUser)
                // And now restore them
                confirmEmergencyContactEmail.restore()
                confirmEmergencyContactSMS.restore()
                createEmailAlert.restore()
                createSMSAlert.restore()
                confirmAlertsWithUser.restore()
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
        email: 'bollain@gmail.com',
        password: 'miguelito'
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
        email: 'pepito@gmail.com',
        password: 'miguelito'
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
        email: 'miguelito@gmail.com',
        password: 'miguelito'
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

  describe('/GET Trip', () => {
    it('Should get an existing trip', (done) => {
      let someUser = new User({
        firstName: 'Linus',
        lastName: 'Torvalds',
        phoneNumber: '7785580000',
        email: 'linux@gnu.com',
        password: 'miguelito'
      })
      someUser.save((err, user) => {
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
              .get('/trips/' + trip._id)
              .end((err, res) => {
                res.should.have.status(200)
                res.body[0].should.have.property('userId').eql(user._id)
                res.body[0].should.have.property('tripName').eql('MyTestTrip')
                res.body[0].should.have.property('contactPhone').eql('7785583029')
                res.body[0].should.have.property('contactEmail').eql('bollain@gmail.com')
                if (err) {}
                done()
              })
        })
      })
    })

    it('Should give error on non-existent trip', (done) => {
      chai.request(index)
          .get('/trips/' + 420)
          .end((err, res) => {
            res.should.have.status(404)
            if (err) {}
            done()
          })
    })
  })

  describe('/PUT Trip', () => {
    it('Should return error when updating a non-existent trip', (done) => {
      var fakeTrip = createTrip()
      fakeTrip.tripId = 420
      chai.request(index)
          .put('/trips')
          .send(fakeTrip)
          .end((err, res) => {
            res.should.have.status(404)
            if (err) {}
            done()
          })
    })

    it('Should not update a trip with invalid email/phone', (done) => {
      // First create a user
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        // Now save a trip
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
        // Save the trip
        trip.save((err, trip) => {
          if (err) { console.log(err) }
          // Update the trip
          var tripUpdate = {
            tripId: trip._id,
            contactEmail: 'bademail',
            startingLocation: {
              latitude: 0,
              longitude: 0
            },
            endingLocation: {
              latitude: 0,
              longitude: 0
            }
          }
          chai.request(index)
              .put('/trips')
              .send(tripUpdate)
              .end((err, res) => {
                res.should.have.status(401)
                if (err) {}
                done()
              })
        })
      })
    })

    it('Should send alerts when trip completed', (done) => {
      // Stub out the AlertService calls
      var cancelAlert = sinon.stub(AlertService, 'cancelAlert')
      var returnedSafeSMS = sinon.stub(AlertService, 'sendReturnedSafeSMS')
      var returnedSafeEmail = sinon.stub(AlertService, 'sendReturnedSafeEmail')
      // First create a user
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583076',
        email: 'charlie@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        // Now save a trip
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
        // Save the trip
        trip.save((err, trip) => {
          if (err) { console.log(err) }
          // Complete the trip
          var tripUpdate = {
            tripId: trip._id,
            completed: true
          }
          // PUT IT
          chai.request(index)
              .put('/trips')
              .send(tripUpdate)
              .end((err, res) => {
                res.should.have.status(200)
                if (err) {}
                sinon.assert.called(cancelAlert)
                sinon.assert.called(returnedSafeSMS)
                sinon.assert.called(returnedSafeEmail)

                cancelAlert.restore()
                returnedSafeSMS.restore()
                returnedSafeEmail.restore()
                done()
              })
        })
      })
    })

    it('Should update alerts when time changed', (done) => {
        // Stub out the AlertService calls
      var cancelAlert = sinon.stub(AlertService, 'cancelAlert')
      var createEmailAlert = sinon.stub(AlertService, 'createEmailAlert')
      var createSMSAlert = sinon.stub(AlertService, 'createSMSAlert')
      var updateEmergencyContactSMS = sinon.stub(AlertService, 'updateEmergencyContactSMS')
      var updateEmergencyContactEmail = sinon.stub(AlertService, 'updateEmergencyContactEmail')
        // First create a user
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583076',
        email: 'charlie@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
          // Now save a trip
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
          // Save the trip
        trip.save((err, trip) => {
          if (err) { console.log(err) }
            // Complete the trip
          var tripUpdate = {
            tripId: trip._id,
            returnTime: '2017-03-26T22:34:33.649Z'
          }
            // PUT IT
          chai.request(index)
                .put('/trips')
                .send(tripUpdate)
                .end((err, res) => {
                  res.should.have.status(200)
                  if (err) {}
                  sinon.assert.called(cancelAlert)
                  sinon.assert.called(createEmailAlert)
                  sinon.assert.called(createSMSAlert)
                  sinon.assert.called(updateEmergencyContactSMS)
                  sinon.assert.called(updateEmergencyContactEmail)

                  cancelAlert.restore()
                  createEmailAlert.restore()
                  createSMSAlert.restore()
                  updateEmergencyContactSMS.restore()
                  updateEmergencyContactEmail.restore()
                  done()
                })
        })
      })
    })
  })

  describe('/POST breadCrumbs', () => {
    it('Should update breadCrumbs for valid trip', (done) => {
          // First create a user
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583076',
        email: 'charlie@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
            // Now save a trip
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
          note: 'string',
          completed: false
        })
        if (err) { console.log(err) }
            // Save the trip
        trip.save((err, trip) => {
          if (err) { console.log(err) }
          var bCrumz = [
            {
              'latitude': 42,
              'longitude': 420,
              'timeStamp': '2017-03-27T05:58:57.412Z'
            },
            {
              'latitude': 67,
              'longitude': 45,
              'timeStamp': '2017-03-27T05:58:57.412Z'
            }
          ]

            // Post the crumbs
          chai.request(index)
                  .post('/trips/' + trip._id + '/breadcrumbs')
                  .send(bCrumz)
                  .end((err, res) => {
                    if (err) { console.log(err) }
                    res.should.have.status(200)
                    res.body[0].should.have.property('coordinates')
                    res.body[0].should.have.property('timeStamp')
                    res.body.length.should.equal(2)
                    done()
                  })
        })
      })
    })

    it('Should not post crumbz to a non-existent trip', (done) => {
      var bCrumz = [
        {
          'latitude': 42,
          'longitude': 420,
          'timeStamp': '2017-03-27T05:58:57.412Z'
        },
        {
          'latitude': 67,
          'longitude': 45,
          'timeStamp': '2017-03-27T05:58:57.412Z'
        }
      ]

        // Post the crumbs
      chai.request(index)
              .post('/trips/' + 420 + '/breadcrumbs')
              .send(bCrumz)
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
