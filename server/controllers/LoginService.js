'use strict'
var User = require('../models/User')

exports.authenticateUser = function (args, res, next) {
  /**
   * Authenticates a user
   *
   * user info AuthRequest Credentials
   * no response value expected for this operation
   **/
  var credentials = args.authRequest.value
  User.findOne({email: credentials.email}, (err, user) => {
    if (err) {
      console.log(err)
      res.statusCode = 500
      res.statusMessage = 'Server error'
      res.end()
      return
    }
    if (!user) {
      res.statusCode = 400
      res.statusMessage = 'User not found'
      res.end('User not found')
      return
    }
    user.comparePassword(credentials.password, (err, isMatch) => {
      if (err) {
        res.statusCode = 500
        res.statusMessage = 'Server error'
        res.end()
        return
      }
      if (!isMatch) {
        res.statusCode = 401
        res.statusMessage = 'Unauthorized'
        res.end('Bad password')
        return
      }
      var result = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
    })
  })
}
