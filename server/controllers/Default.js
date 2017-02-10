'use strict';

var url = require('url');

var Default = require('./DefaultService');

module.exports.createTrip = function createTrip (req, res, next) {
  Default.createTrip(req.swagger.params, res, next);
};

module.exports.createUser = function createUser (req, res, next) {
  Default.createUser(req.swagger.params, res, next);
};

module.exports.deleteTrip = function deleteTrip (req, res, next) {
  Default.deleteTrip(req.swagger.params, res, next);
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  Default.deleteUser(req.swagger.params, res, next);
};

module.exports.getTrip = function getTrip (req, res, next) {
  Default.getTrip(req.swagger.params, res, next);
};

module.exports.getTrips = function getTrips (req, res, next) {
  Default.getTrips(req.swagger.params, res, next);
};

module.exports.getUser = function getUser (req, res, next) {
  Default.getUser(req.swagger.params, res, next);
};

module.exports.searchTrip = function searchTrip (req, res, next) {
  Default.searchTrip(req.swagger.params, res, next);
};

module.exports.updateTrip = function updateTrip (req, res, next) {
  Default.updateTrip(req.swagger.params, res, next);
};

module.exports.updateUser = function updateUser (req, res, next) {
  Default.updateUser(req.swagger.params, res, next);
};
