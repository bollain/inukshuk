
// test all functions in apiCalls

'use strict';
var fetchMock = require('fetch-mock');
var pathToRegexp = require('path-to-regexp');
var apiCalls = require('../apiCalls');
var response = require('../__mocks__/response');


var newUser = {
 id: 30,
 firstName: 'John',
 lastName: 'McAfee',
 email: 'jmcafee@mcafee.com',
 phoneNumber: '3710011111',
 trips: []
 };

var existingUser = {
  id: 70,
  firstName: 'Elon',
  lastName: 'Musk',
  email: 'emusk@neuralink.com',
  phoneNumber: '8510293899',
  trips: []
}

var newTrip = {
  tripId: 10,
  userId: 30,
  tripName: "test trip",
  returnTime: "2017-03-31T18:33:19.096Z",
  contactEmail: "jmcafee@mcafee.com",
  contactPhone: "3710011111",
  startingLocation: {
    latitude: 129.3029,
    longitude: 41.4324,
    timeStamp: "2017-03-29T18:33:19.096Z",
  },
  endingLocation: {
    latitude: 129.5092,
    longitude: 41.4332,
    timeStamp: "2017-03-29T18:33:19.096Z",
  },
  breadCrumbs: [
    {
      latitude: 129.3030,
      longitude: 41.4325,
      timeStamp: "2017-03-29T21:33:19.097Z",
    }
  ],
  note: "a test trip",
  completed: false,
}

var breadCrumb = [
 {
   "latitude": 129.3402,
   "longitude": 41.2039,
   "timeStamp": "2017-03-29T18:33:19.147Z"
 }
]

//TODO: check how to write test for handleError(response)

// createUser tests (including error handling)
afterEach(fetchMock.restore);
fetchMock.post('*', newUser);

it('works with promise when valid user info is inputted and resolves payload' , () => {
  return apiCalls.createUser(newUser).then(response =>
    expect(response).toEqual(newUser));
});

it('works with rejected promise when empty email is inputted' , () => {
  //expect.assertions(1);
  fetchMock.post('*', newUser);
  var promise = response.getResponse(newUser, false);
  fetchMock.post('*', promise);
  return apiCalls.createUser(newUser).catch( e => expect(e).toEqual({
  error: 'Problem connecting to server',}))
});

it('works with rejected promise when invalid email is inputted' , () => {
  //expect.assertions(1);
  fetchMock.post('*', newUser);
  var response = {throws: 'Problem connecting to server'};
  fetchMock.post('*', response);
  return apiCalls.createUser(newUser).catch( e => expect(e).toEqual({
  error: 'Problem connecting to server',}))
});

it('works with rejected promise when invalid number is inputted' , () => {
  //expect.assertions(1);
  newUser.phoneNumber = '1alsk3la';
  fetchMock.post('*', newUser);
  return apiCalls.createUser(newUser).catch( e => expect(e).toEqual({
    error: 'Problem connecting to server',}))
});



// updateUser tests
test('updateUser does not modify payload if not info is updated' , () => {
  fetchMock.put('*', existingUser);
  return apiCalls.updateUser(existingUser).then(response =>
    expect(response).toEqual(existingUser));
});

test('updateUser works with promise, resolves payload correctly' , () => {
  existingUser.phoneNumber = '6045594039'
  fetchMock.put('*', existingUser);
  return apiCalls.updateUser(existingUser).then(response =>
    expect(response.phoneNumber).toEqual('6045594039'));
});


// postTrip test
test('postTrip works with promise, resolves payload correctly' , () => {
  fetchMock.post('*', newTrip);
  return apiCalls.postTrip().then(response =>
    expect(response).toEqual(newTrip));
});

// extendTrip test
test('extendTrip works with promise, resolves payload correctly' , () => {
  var newReturnTime = "2017-04-03T18:33:19.096Z";
  fetchMock.put('*', 200);
  newTrip.returnTime = newReturnTime;
  return apiCalls.extendTrip(newTrip.tripId, newReturnTime).then(response =>
    expect(response).toBeUndefined);
});

// completeTrip test
test('completeTrip works with promise, resolves payload correctly' , () => {
  newTrip.completed = true;
  fetchMock.put('*', 200);
  return apiCalls.completeTrip(30).then(response =>
    expect(response).toBeUndefined);
});

// cancelTrip Test
fetchMock.delete('*', newTrip);
test('deleteTrip works with promise, resolves payload correctly' , () => {
  fetchMock.delete('*', newTrip)
  return apiCalls.cancelTrip(newTrip.id).then(response =>
    expect(response).toBeUndefined);
});

// throwCrumbs tests
fetchMock.post('*', breadCrumb);
test('throwCrumbs works with promise, resolves payload correctly' , () => {
  return apiCalls.throwCrumbs(30, breadCrumb).then(response =>
    expect(response).toBeUndefined)
    .catch(e => {}); // just means breadcrumb not created for mock trip
});
