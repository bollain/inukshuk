'use strict'

var Trip = require('../models/Trip')
var User = require('../models/User')
var AlertService = require('./AlertService')

/**
 * Create `Trip` for a specific `User`
 *
 * trip Trip Trip Object
 * returns trip
 **/
exports.createTrip = function (args, res, next) {
  var params = args.Trip.value
  var userId = params.userId
  var newTrip = Trip({
    userId: userId,
    returnTime: params.returnTime,
    contactPhone: params.contactPhone,
    contactEmail: params.contactEmail,
    note: params.note,
    completed: false,
    startingLocation: {
      coordinates: [params.startingLocation.latitude,
        params.startingLocation.longitude]}
  })
  // If user does not exist, kill things off
  User.findById(userId, function (err, user) {
    if (err) {
      return handleError(res, err)
    }
    if (!user) {
      res.statusCode = 404
      res.statusMessage = 'User does not exist'
      res.end('User does not exist')
    } else {
      newTrip.save(function (err) {
        if (err) {
          handleError(res, err)
          return
        }
        user.trips.push(newTrip._id)
        user.save(function (err) {
          if (err) {
            handleError(res, err)
          }
        })
          // Create text Alert
        scheduleAlerts(newTrip)
        console.log('Trip created!')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(newTrip))
      })
    }
  })
}

exports.deleteTrip = function (args, res, next) {
  /**
   * Deletes a  Trip
   *
   * tripId Long Id of trip
   * no response value expected for this operation
   **/
   // TODO: need permissions on who can do this....
  var tripId = args.tripId.value
  console.log(tripId)
  Trip.findById(tripId, function (err, trip) {
    if (err) {
      return handleError(res, err)
    }
    if (!trip) {
      res.statusCode = 404
      res.statusMessage = 'Trip does not exist'
      res.end('Trip does not exist')
    } else {
       // Find user.
      User.findById(trip.userId, function (err, user) {
        if (err) {
          return handleError(res, err)
        }
        user.removeTrip(tripId)
        user.save()
      })

      trip.remove(function (err) {
        if (err) {
          return handleError(res, err)
        }
        // Cancel all alerts and update person?
        cancelAlerts(trip._id)
        res.end('Trip deleted')
      })
    }
  })
}

exports.getTrip = function (args, res, next) {
  /**
   * Gets a trip based on a specific Id
   *
   * tripId Long ID of trip
   * returns trip
   **/
  var tripId = args.tripId.value
  Trip.find({_id: tripId}, function (err, trip) {
    if (err) {
      console.log(err)
      res.statusCode = 401
      res.statusMessage = 'Bad request'
      res.end()
    }

    if (!trip.length) {
      res.statusCode = 404
      res.statusMessage = 'Trip does not exist'
      res.end('Trip does not exist')
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(trip))
    }
  })
}

exports.updateTrip = function (args, res, next) {
  /**
   * Update `Trip` details
   *
   * trip Trip JSON object with trip details (optional)
   * no response value expected for this operation
   **/
  var params = args.Trip.value
  Trip.findById(params.tripId, function (err, trip) {
    if (err) {
      handleError(res, err)
      return
    }
    if (!trip) {
      res.statusCode = 404
      res.statusMessage = 'Trip does not exist'
      res.end('Trip does not exist')
    } else {
      trip.returnTime = params.returnTime || trip.returnTime
      trip.contactEmail = params.contactEmail || trip.contactEmail
      trip.contactPhone = params.contactPhone || trip.contactPhone
      trip.startingLocation = params.startingLocation ? updateCoordinates(params.startingLocation) : trip.startingLocation
      trip.note = params.note || trip.note
      trip.completed = params.completed || trip.completed

      trip.save(function (err) {
        if (err) {
          handleError(res, err)
          return
        }
        // If trip is completed cancel your
        // alerts
        if (trip.completed) {
          console.log('Trip completed, cancelling alerts!')
          cancelAlerts(trip._id)
          createReturnedSafelyAlerts(trip.contactPhone, trip.contactEmail)
        }
        // If return time was updated, update alerts
        if (params.returnTime) {
          console.log('Im updating return time')
          updateAlerts(trip)
        }

        console.log('Trip updated!')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(trip))
      })
    }
  })
}

// TODO: What parameters to pass? Maybe a trip object?
var scheduleAlerts = function (trip) {
  // Send confirmation to emerg contaact and user
  // Schedule EMERGENCY alerts
  scheduleSMSAlert(trip._id + '_SMS', trip.contactPhone, trip.returnTime)
  scheduleEmailAlert(trip._id + '_EMAIL', trip.contactEmail, trip.returnTime)
}

// TODO: incorporate node mailer
// ID is a string made up of tripID_EMAIL
var scheduleEmailAlert = function (id, emailAddress, triggerTime) {
  //

}

// ID is a string made up of tripID_SMS
// Push it into the scheduler
var scheduleSMSAlert = function (id, phoneNumber, triggerTime) {
  AlertService.createSMSAlert(id, phoneNumber, triggerTime)
}

// Update Alerts
var updateAlerts = function (trip) {
  // First cancel current alerts
  cancelAlerts(trip._id)
  // Then reschedule them!
  scheduleAlerts(trip)
}

// Cancel scheduled alerts for a trip
var cancelAlerts = function (tripID) {
  // Cancel all scheduled alerts
  AlertService.cancelAlert(tripID + '_SMS')
}

// User does not get one
var createReturnedSafelyAlerts = function (contactPhone, contactEmail) {
  AlertService.sendReturnedSafeSMS(contactPhone)
}

var handleError = function (res, error) {
  var message = ''
  if (!error.errors) {
    // Yikes something is wrong and we can't save...
    message += 'Server error'
  } else if (error.errors.contactEmail) {
    // Email is in wrong format
    message += 'Email format incorrect'
  } else if (error.errors.contactPhone) {
    // Bad phoneNumber
    message += 'Bad phonenumber'
  }
  res.statusCode = 401
  res.statusMessage = 'Bad request'
  res.end(message)
}

var updateCoordinates = function (newCoordinates) {
  var coordinates = [newCoordinates.latitude, newCoordinates.longitude]
  return {coordinates}
}
