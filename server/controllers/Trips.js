'use strict';

var url = require('url');

var Trips = require('./TripsService');

module.exports.createTrip = function createTrip (req, res, next) {
  Trips.createTrip(req.swagger.params, res, next);
};

module.exports.deleteTrip = function deleteTrip (req, res, next) {
  Trips.deleteTrip(req.swagger.params, res, next);
};

module.exports.getTrip = function getTrip (req, res, next) {
  Trips.getTrip(req.swagger.params, res, next);
};

module.exports.updateTrip = function updateTrip (req, res, next) {
  Trips.updateTrip(req.swagger.params, res, next);
};
