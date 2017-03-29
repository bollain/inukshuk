'use strict'

var Login = require('./LoginService')

module.exports.authenticateUser = function authenticateUser (req, res, next) {
  Login.authenticateUser(req.swagger.params, res, next)
}
