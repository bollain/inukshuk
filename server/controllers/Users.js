'use strict'

var Users = require('./UsersService')

module.exports.createUser = function createUser (req, res, next) {
  Users.createUser(req.swagger.params, res, next)
}

module.exports.deleteUser = function deleteUser (req, res, next) {
  Users.deleteUser(req.swagger.params, res, next)
}

module.exports.getUser = function getUser (req, res, next) {
  Users.getUser(req.swagger.params, res, next)
}

module.exports.getUserTrips = function getUserTrips (req, res, next) {
  Users.getUserTrips(req.swagger.params, res, next)
}

module.exports.searchTrip = function searchTrip (req, res, next) {
  Users.searchTrip(req.swagger.params, res, next)
}

module.exports.updateUser = function updateUser (req, res, next) {
  Users.updateUser(req.swagger.params, res, next)
}
