'use strict';

exports.createTrip = function(args, res, next) {
  /**
   * Create `Trip` for a specific `User`
   *
   * trip Trip Trip Object (optional)
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

exports.createUser = function(args, res, next) {
  /**
   * Creates `User` a new user in the system
   *
   * user User Create a user
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

exports.deleteTrip = function(args, res, next) {
  /**
   * Delete `Trip`
   *
   * tripId String ID of trip to delete
   * no response value expected for this operation
   **/
  res.end();
}

exports.deleteUser = function(args, res, next) {
  /**
   * Endpoint used for deleting accounts; this is not reversible.
   * Delete `User` from the system
   *
   * userId String The ID of the user that is going to be deleted
   * no response value expected for this operation
   **/
  res.end();
}

exports.getTrip = function(args, res, next) {
  /**
   * Get a `Trip` with a specific id
   *
   * tripId String ID of trip to get
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

exports.getTrips = function(args, res, next) {
  /**
   * Gets all `Trips` associated with a `User`
   *
   * userId String The User for which we want all trips
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

exports.getUser = function(args, res, next) {
  /**
   * Gets a user based on a given ID
   *
   * userId Long ID of user to get
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

exports.updateTrip = function(args, res, next) {
  /**
   * Update `Trip` details
   *
   * trip Trip JSON object with trip details (optional)
   * no response value expected for this operation
   **/
  res.end();
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

