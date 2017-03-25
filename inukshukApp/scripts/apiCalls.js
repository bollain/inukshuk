import { Alert} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from './localStorage.js';
var localIp = '192.168.1.90';
var mockUserId = 222;

/** HANDLE ERRORS
* Handle any errors while communicating with the server
* REQUIRES: a response object
* MODIFIES: nothing
* RETURNS: the given response object
**/
function handleErrors(response) {
  if (!response.ok) {
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
export function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':8080/login', {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username,
        password: password,
      })
    })
    .then(handleErrors)
    .then(response => response.json())
    .then(responseJson => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject("Can not reach server")
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
    fetch('http://' + localIp + ':8080/users/' + mockUserId)
    .then(handleErrors)
    .then(response => response.json())
    .then(responseJson => {
      resolve(responseJson);
     })
     .catch((error) => {
       reject("Can not reach server")
     });
  })
}

/** CREATE USER
* Create a user on the inukshuk server with the given information
* REQUIRES: user object with username, firstName, lastName, email and
* phoneNumber
* MODIFIES: the database of users on the inukshuk server
* RETURNS: JSON response or error message
**/
export function createUser(user) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':8080/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
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

/** UPDATE USER
* Update user info on the inukshuk server
* REQUIRES: a component with details in state
* MODIFIES: the database of users on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function updateUser(comp) {
  let user = {
    id: comp.state.id,
    userName: comp.state.userName,
    firstName: comp.state.firstName,
    lastName: comp.state.lastName,
    email: comp.state.email,
    phoneNumber: comp.state.phoneNumber,
  };
  fetch('http://' + localIp + ':8080/users', {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(handleErrors)
  .then(
    Alert.alert(
      'Success!',
      'Your account has been updated',
      [
        {text: 'OK', onPress: () => {
          comp.props.callback(user)
          .then(comp.props.navigator.pop())
          .catch((err) => console.error(err));
        }},
      ],
      { cancelable: false }
    )
  )
  .then(() => {
      storageSet('user', JSON.stringify(user))
      .catch((err) => console.error(err));
    }
  )
  .catch((err) => Alert.alert('Error', err.message));
}

 /** POST TRIP
 * Post a trip to inukshuk server
 * REQUIRES: a component with details in state
 * MODIFIES: the database of trips on the inukshuk server, navigator route
 * RETURNS: nothing
 **/
export function postTrip(comp) {
  // TODO: server should take chosen email/number and not require both
  var ce = (comp.state.contact.emails.length > 0 ? comp.state.contact.emails[0].email : 'ehauner@gmail.com');
  var tel = (comp.state.contact.phones.length > 0 ? comp.state.contact.phones[0].number : '6046523447');
  tel = tel.replace(/\D+/g, "");
  var returnTime = new Date(comp.state.return.year, comp.state.return.month, comp.state.return.day, comp.state.return.hour, comp.state.return.minute, 0,0);
  fetch('http://' + localIp + ':8080/trips', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        tripId: 0,
        userId: comp.props.user._id,
        returnTime: returnTime,
        contactEmail: ce,
        contactPhone: tel,
        startingLocation: {
          latitude: comp.state.location.latitude,
          longitude: comp.state.location.longitude,
        },
        note: comp.state.note,
        completed: false,
    })
  })
  .then(handleErrors)
  .then(response => response.json())
  .then((responseJson) => {
    //comp.props.set('tripId', responseJson._id);
    Alert.alert(
      'Success!',
      'Your trip has been created!',
      [
        {text: 'OK', onPress: () => comp.navStart(responseJson)},
      ],
      { cancelable: false }
    );
  })
  .catch((err) => console.error(err));
}

/** CANCEL TRIP
* Delete a trip from the inukshuk server
* REQUIRES: a component with details in state
* MODIFIES: the database of trips on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function cancelTrip(tripId) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':8080/trips/' + tripId, {
      method: 'DELETE',
    })
    .then(handleErrors)
    .then(() => resolve())
    .catch(function(error) {
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
    fetch('http://' + localIp + ':8080/trips/', {
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
    .then(handleErrors)
    .then(() => resolve())
    .catch(function(error) {
      reject('Can not reach server');
    })
  })
}

/** EXTEND TRIP
* Extend a trip on the inukshuk server
* REQUIRES: a component with details in state, including a Javascript date
* MODIFIES: the database of trips on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function extendTrip(tripId, newReturnDate) {
  return new Promise((resolve, reject) => {
    fetch('http://' + localIp + ':8080/trips/', {
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
    .then(handleErrors)
    .then(() => resolve())
    .catch(function(error) {
      reject('Can not reach server');
    });
  })
}
