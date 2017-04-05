import { Alert} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from './localStorage.js';

var localIp = 'inukshuk.me';
var localPort = 1985;
// var localIp = '192.168.1.90';
// var localPort = 8080;
var mockUserId = 260;

/** HANDLE ERRORS
* Handle any errors while communicating with the server
* REQUIRES: a response object
* MODIFIES: nothing
* RETURNS: the given response object
**/
function handleErrors(response) {
  if (!response.ok) {
    console.error(response);
    throw Error("Problem connecting to server");
  }
  return response;
}

/** LOGIN
* Login to retrieve account information
* REQUIRES: a component, that a user has been created already
* (can be done through sign up)
* MODIFIES: the database of users on the inukshuk server
* RETURNS: JSON response or an error message
**/
export function login(email, password) {
  console.log(email);
  console.log(password);
  console.log('http://' + localIp + ':' + localPort + '/login');
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/login', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
    .then(response => {
      if (response.status == 400) {
        reject('Email not found');
      }
      else if (response.status == 401) {
        reject('Email and password do not match');
      }
      return response;
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      resolve(responseJson);
    })
    .catch((error) => {
      reject('Can not reach server')
    });
  })
}

/** LOGIN MOCK
* Login without checking credentials (for development/testing)
* REQUIRES: a component, that a user has been created already
* (can be done through sign up)
* MODIFIES: the database of users on the inukshuk server
* RETURNS: JSON response or an error message
**/
export function loginMock(username, password) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/users/' + mockUserId)
    .then(handleErrors)
    .then(response => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject('Can not reach server')
    });
  })
}

/** CREATE USER
* Create a user on the inukshuk server with the given information
* REQUIRES: user object with firstName, lastName, email and
* phoneNumber
* MODIFIES: the database of users on the inukshuk server
* RETURNS: JSON response or error message
**/
export function createUser(user) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (response.status == 401) {
        reject('Bad request');
      }
      else if (response.status == 422) {
        reject('Email already registered');
      }
      return response;
    })
    .then(response => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject('Can not reach server')
    });
  })
}

/** UPDATE USER
* Update user info on the inukshuk server
* REQUIRES: user object with id, username, firstName, lastName, email and
* phoneNumber
* MODIFIES: the database of users on the inukshuk server
* RETURNS: JSON response or error message
**/
export function updateUser(user) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/users', {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (response.status == 400) {
        reject('Invalid user');
      }
      else if (response.status == 404) {
        reject('User not found');
      }
      return response;
    })
    .then(response => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject('Can not reach server')
    });
  })
}

 /** POST TRIP
 * Post a trip to inukshuk server
 * REQUIRES: a trip object with location, contact, return, note
 * MODIFIES: the database of trips on the inukshuk server
 * RETURNS: JSON response or error message
 **/
export function postTrip(trip) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/trips', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trip),
    })
    .then(response => {
      if (response.status == 400) {
        reject('Invalid user');
      }
      return response;
    })
    .then(response => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject(error)
    });
  })
}

/** CANCEL TRIP
* Delete a trip from the inukshuk server
* REQUIRES: a tripId
* MODIFIES: the database of trips on the inukshuk server
* RETURNS: nothing
**/
export function cancelTrip(tripId) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/trips/' + tripId, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.status == 200) {
        resolve();
      }
      else if (response.status == 403) {
        reject('Forbidden');
      }
      else if (response.status == 404) {
        reject('Trip not found');
      }
    })
    .catch((error) => {
      reject('Can not reach server');
    });
  })
}

/** COMPLETE TRIP
* Completes a trip on the inukshuk server
* REQUIRES: a trip id
* MODIFIES: the database of trips on the inukshuk server
* RETURNS: nothing
**/
export async function completeTrip(tripId) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/trips/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId: tripId,
        completed: true
      })
    })
    .then(response => {
      if (response.status == 200) {
        resolve();
      }
      else if (response.status == 403) {
        reject('Invalid ID');
      }
      else if (response.status == 404) {
        reject('Resource not found');
      }
    })
    .catch((error) => {
      reject('Can not reach server');
    })
  })
}

/** EXTEND TRIP
* Extend a trip on the inukshuk server
* REQUIRES: a tripId and a new return date
* MODIFIES: the database of trips on the inukshuk server
* RETURNS: nothing
**/
export function extendTrip(tripId, newReturnDate) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/trips/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId: tripId,
        returnTime: newReturnDate,
      })
    })
    .then(response => {
      if (response.status == 200) {
        resolve();
      }
      else if (response.status == 403) {
        reject('Invalid ID');
      }
      else if (response.status == 404) {
        reject('Resource not found');
      }
    })
    .catch((error) => {
      reject('Can not reach server');
    });
  })
}

/** THROW CRUMBS
* Add breadcrumbs to the database
* REQUIRES: tripId and an array of objects with lat, lon and timestamp
* MODIFIES: the database of trips on the inukshuk server, the local store of
* unposted breadcrumbs
* RETURNS: nothing
**/
export function throwCrumbs(tripId, breadcrumbs) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':' + localPort + '/trips/' + tripId + '/breadcrumbs/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(breadcrumbs),
    })
    .then(response => {
      if (response.status == 400) {
        reject('Invalid Trip ID');
      }
      else if (response.status == 404) {
        reject('Resource not found');
      }
      return response;
    })
    .then(response => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject('Error posting breadcrumbs to the server');
    });
  })
}
