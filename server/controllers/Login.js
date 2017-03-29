'use strict';

var url = require('url');

var Login = require('./LoginService');

module.exports.authenticateUser = function authenticateUser (req, res, next) {
  Login.authenticateUser(req.swagger.params, res, next);
};
