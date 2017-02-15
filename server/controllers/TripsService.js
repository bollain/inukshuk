'use strict';

exports.createTrip = function(args, res, next) {
  /**
   * Create `Trip` for a specific `User`
   *
   * trip Trip Trip Object
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

exports.deleteTrip = function(args, res, next) {
  /**
   * Deletes a  Trip
   *
   * tripId Long Id of trip
   * no response value expected for this operation
   **/
  res.end();
}

exports.getTrip = function(args, res, next) {
  /**
   * Gets a trip based on a specific Id
   *
   * tripId Long ID of trip
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

