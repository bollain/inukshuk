import { Alert} from 'react-native';
var localIp = '192.168.1.94';
var mockUserId = 113;

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
    comp.props.set('user', JSON.stringify(responseJson));
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
    comp.props.set('user', JSON.stringify(responseJson));
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
* MODIFIES: the database of users on the inukshuk server
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
        {text: 'OK',
        onPress: () => comp.props.navigator.push({
          id: 'tripSummary',
          user: user,
        })},
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
 * MODIFIES: the database of users on the inukshuk server
 * RETURNS: true if success, else false
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
       comp.props.set('user', JSON.stringify(user))
       .catch((err) => console.error(err));
     }
   )
   .catch((err) => Alert.alert('Error', err.message));
 }
