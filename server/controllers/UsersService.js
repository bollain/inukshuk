'use strict'

var User = require('../models/User')
var validator = require('validator')
var LOCALE = 'en-CA' // tech debt, put this in config or something

exports.createUser = function (args, res, next) {
  /**
   * Creates a user based on provided information
   *
   * body User The user to be created
   * returns user
   **/
  var params = args.User.value
  var newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    phoneNumber: params.phoneNumber
  }

  User.findOrCreate({email: params.email}, newUser,
    function (err, user, created) {
      if (err) {
        if (err.errors.email) {
          console.log('The email was bad')
          res.statusCode = 401
          res.statusMessage = 'Bad request'
          res.end('Invalid email')
          return
        } else if (err.errors.phoneNumber) {
          console.log('phonenumber was bad')
          res.statusCode = 401
          res.statusMessage = 'Bad request'
          res.end('Phone number too short or too long')
          return
        } else {
          res.statusCode = 401
          res.statusMessage = 'Bad request'
          res.end()
          return
        }
      }
      if (created) {
        console.log('User saved successfully!')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(user))
      } else {
        console.log('The user exists!')
        res.statusCode = 422
        res.statusMessage = 'Bad request'
        res.end('Email exists in database')
      }
    })
}

exports.deleteUser = function (args, res, next) {
  /**
   * Delete `User` with given ID
   *
   * userId Long ID of user
   * no response value expected for this operation
   **/
   // TODO: Need an authentication measure... do we even need to expose this?
  var userId = args.userId.value
  User.findByIdAndRemove(userId, function (err) {
    if (err) {
      console.log(err)
      res.statusCode = 401
      res.statusMessage = 'Bad request'
      res.end()
    }
    console.log('User deleted')
    res.end('User deleted')
  })
}

exports.updateUser = function (args, res, next) {
  /**
   * Updates an existing `User`
   *
   * user User User with updated info
   * returns user
   **/
  var params = args.user.value
  var userId = params.id
  var phoneNumber = params.phoneNumber
  var email = params.email
  // Lets first validate the email / phone...apparently findByIdAndUpdate doesnt
  // run the validators
  if (!validator.isEmail(email)) {
    res.statusCode = 400
    res.statusMessage = 'Bad request'
    res.end('Invalid email')
    return
  }
  if (!validator.isMobilePhone(phoneNumber, LOCALE)) {
    res.statusCode = 400
    res.statusMessage = 'Bad request'
    res.end('Invalid phone number')
    return
  }

  User.findByIdAndUpdate(userId, {phoneNumber: phoneNumber, email: email}, {new: true},
    function (err, user) {
      if (err) {
        console.log('Email in use')
        res.statusCode = 400
        res.statusMessage = 'Bad request'
        res.end('User Email already in use')
        return
      } else if (!user) {
        console.log('User does not exist')
        res.statusCode = 404
        res.statusMessage = 'Bad request'
        res.end('User ID does not exist')
        return
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    })
}

exports.getUser = function (args, res, next) {
  /**
   * Gets `User` with specific ID
   *
   * userId Long ID of user
   * returns user
   **/
  var param = args.userId.value
  console.log(args.userId.value)
  User.find({_id: param}, function (err, user) {
    if (err) {
      console.log(err)
      res.statusCode = 401
      res.statusMessage = 'Bad request'
      res.end()
    }

    if (!user.length) {
      res.statusCode = 404
      res.statusMessage = 'User does not exist'
      res.end('User does not exist')
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user[0]))
    }
  })
}

exports.getUserTrips = function (args, res, next) {
  /**
   * Get all `Trips` for a user
   *
   * userId Long The User for which we want all trips
   * returns tripsCollection
   **/
   // TODO: this
  res.end()
}

exports.searchTrip = function (args, res, next) {
  /**
   * Gets a specific `Trip` associated with a `User`
   *
   * userId String User ID
   * tripId String The ID of a trip
   * returns trip
   **/
   // TODO: Finish this
  res.end()
}
