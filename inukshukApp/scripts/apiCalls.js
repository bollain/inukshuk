import { Alert} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from './localStorage.js';
var localIp = '192.168.1.94';
var mockUserId = 129;

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
* MODIFIES: navigator route (to trip summary page)
* RETURNS: nothing
**/
export function login(comp) {
  console.log(comp.state);
  fetch('http://' + localIp + ':8080/login', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: comp.state.username,
      password: comp.state.password,
    })
  })
  .then(handleErrors)
  .then(response => response.json())
  .then(responseJson => {
    storageSet('user', JSON.stringify(responseJson));
    comp.props.navigator.push({
      id: 'tripSummary',
      user: responseJson
    });
   })
  .catch(function(error) {
    Alert.alert('Can not reach server');
  });
}

/** LOGIN MOCK
* Login without checking credentials (for development/testing)
* REQUIRES: a component, that a user has been created already
* (can be done through sign up)
* MODIFIES: a navigator route (to trip summary page)
* RETURNS: nothing
**/
export function loginMock(comp) {
  console.log(comp.state);
  fetch('http://' + localIp + ':8080/users/' + mockUserId)
  .then(handleErrors)
  .then(response => response.json())
  .then(responseJson => {
    storageSet('user', JSON.stringify(responseJson));
    comp.props.navigator.push({
      id: 'tripSummary',
      user: responseJson,
    });
   })
   .catch(function(error) {
     Alert.alert('Cannot reach server');
   });
}

/** CREATE USER
* Create a user on the inukshuk server with the given information
* REQUIRES: a component with details in state
* MODIFIES: the database of users on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function createUser(comp) {
  let user = {
    id: 0,
    userName: comp.state.userName,
    firstName: comp.state.firstName,
    lastName: comp.state.lastName,
    email: comp.state.email,
    phoneNumber: comp.state.phoneNumber,
  };
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
  .then(function(responseJson) {
    Alert.alert(
      'Success!',
      'Your account has been created.',
      [
        {
          text: 'OK',
          onPress: () => comp.props.navigator.push({
            id: 'tripSummary',
            user: user,
          })
        },
      ],
      { cancelable: false }
    )
  })
  .catch(function(error) {
    Alert.alert('Cannot reach server');
  });
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
export function cancelTrip(comp) {
  fetch('http://' + localIp + ':8080/trips/' + comp.state.trip._id, {
    method: 'DELETE',
  })
  .then(handleErrors)
  .then(
    Alert.alert(
      'Trip Cancelled',
      'We also notified your contact about the cancellation',
      [{ text: 'OK', onPress: () => {
        comp.props.callback(false);
        _navigator.pop();
      }}]
    )
  )
  .catch(function(error) {
    Alert.alert('Can not reach server');
  });
}

/** COMPLETE TRIP
* Complete a trip on the inukshuk server
* REQUIRES: a component with details in state
* MODIFIES: the database of trips on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function completeTrip(comp) {
  fetch('http://' + localIp + ':8080/trips/', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tripId: comp.state.trip._id,
      completed: true
    })
  })
  .then(handleErrors)
  .then(
    Alert.alert(
      'Trip Completed',
      'We also notified your contact that you are safe',
      [{ text: 'OK', onPress: () => {
        comp.props.callback(false);
        _navigator.pop();
      }}]
    )
  )
  .catch(function(error) {
    Alert.alert('Can not reach server');
  });
}

/** EXTEND TRIP
* Extend a trip on the inukshuk server
* REQUIRES: a component with details in state, including a Javascript date
* MODIFIES: the database of trips on the inukshuk server, navigator route
* RETURNS: nothing
**/
export function extendTrip(comp) {
  fetch('http://' + localIp + ':8080/trips/', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tripId: comp.state.newReturnTime,
      completed: true
    })
  })
  .then(handleErrors)
  .then(
    Alert.alert(
      'Trip Extended to ' + comp.state.newReturnTime.toDateString() + ' at ' + comp.state.newReturnTime.toLocaleTimeString().substring(0,5),
      'We also notified your contact of this change',
      [{ text: 'OK', onPress: () => {
        comp.props.callback(false);
        _navigator.pop();
      }}]
    )
  )
  .catch(function(error) {
    Alert.alert('Can not reach server');
  });
}
