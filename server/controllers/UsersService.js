'use strict';

exports.createUser = function(args, res, next) {
  /**
   * Creates a user based on provided information
   *
   * body User The user to be created
   * returns user
   **/
  var examples = {};
  examples['application/json'] = {
  "firstName" : "aeiou",
  "lastName" : "aeiou",
  "phoneNumber" : "aeiou",
  "id" : 123456789,
  "userName" : "aeiou",
  "email" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.deleteUser = function(args, res, next) {
  /**
   * Delete `User` with given ID
   *
   * userId Long ID of user
   * no response value expected for this operation
   **/
  res.end();
}

exports.getUser = function(args, res, next) {
  /**
   * Gets `User` with specific ID
   *
   * userId Long ID of user
   * returns user
   **/
  var examples = {};
  examples['application/json'] = {
  "firstName" : "aeiou",
  "lastName" : "aeiou",
  "phoneNumber" : "aeiou",
  "id" : 123456789,
  "userName" : "aeiou",
  "email" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getUserTrips = function(args, res, next) {
  /**
   * Get all `Trips` for a user
   *
   * userId Long The User for which we want all trips
   * returns tripsCollection
   **/
  var examples = {};
  examples['application/json'] = {
  "trips" : [ {
    "note" : "aeiou",
    "contactEmail" : "aeiou",
    "startingLocation" : {
      "latitude" : 1.3579000000000001069366817318950779736042022705078125,
      "longitude" : 1.3579000000000001069366817318950779736042022705078125
    },
    "tripId" : 123456789,
    "contactPhone" : "aeiou",
    "userId" : 123456789,
    "returnTime" : "2000-01-23T04:56:07.000+00:00"
  } ],
  "userId" : 123
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.searchTrip = function(args, res, next) {
  /**
   * Gets a specific `Trip` associated with a `User`
   *
   * userId String User ID
   * tripId String The ID of a trip
   * returns trip
   **/
  var examples = {};
  examples['application/json'] = {
  "note" : "aeiou",
  "contactEmail" : "aeiou",
  "startingLocation" : {
    "latitude" : 1.3579000000000001069366817318950779736042022705078125,
    "longitude" : 1.3579000000000001069366817318950779736042022705078125
  },
  "tripId" : 123456789,
  "contactPhone" : "aeiou",
  "userId" : 123456789,
  "returnTime" : "2000-01-23T04:56:07.000+00:00"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.updateUser = function(args, res, next) {
  /**
   * Updates an existing `User`
   *
   * user User User with updated info
   * returns user
   **/
  var examples = {};
  examples['application/json'] = {
  "firstName" : "aeiou",
  "lastName" : "aeiou",
  "phoneNumber" : "aeiou",
  "id" : 123456789,
  "userName" : "aeiou",
  "email" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}
