import { Alert} from 'react-native';
var localIp = '192.168.1.94';
var mockUserId = 113;

/* HANDLE ERRORS
Handle any errors while communicating with the server
REQUIRES: a response object
MODIFIES: nothing
RETURNS: the given response object
*/
function handleErrors(response) {
  if (!response.ok) {
    throw Error("Problem connecting to server");
  }
  return response;
}

/* LOGIN
Login to retrieve account information
REQUIRES: a component, that a user has been created already
(can be done through sign up)
MODIFIES: navigator route (to trip summary page)
RETURNS: nothing
*/
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

/* LOGIN MOCK
Login without checking credentials (for development/testing)
REQUIRES: a component, that a user has been created already
(can be done through sign up)
MODIFIES: a navigator route (to trip summary page)
RETURNS: nothing
*/
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
