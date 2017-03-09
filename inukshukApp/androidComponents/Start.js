import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';

var nativeImageSource = require('nativeImageSource');
var localIp = '192.168.1.73';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip: this.props.tripJson,
      return: this.props.return,
      timer: {
        hours: 12,
        minutes: 10,
        seconds: 30,
      },
    }
    this.set = this.set.bind(this);
    this.remove = this.remove.bind(this);
  }
  set() {
    this.props.set('return', this.state.return)
    .then(this.props.callback(this.state.return))
    .then(_navigator.pop());
  }
  remove() {
    this.props.remove('return')
    .then(this.props.callback(null))
    .then(_navigator.pop());
  }

  //TODO: make the async storage have no values using callback with clearTrip in tripSummary.js
  endStartPage() {
    _navigator.push({
      id: 'tripSummary',
    })
  }

  /**
  * Handles trip edition from start page.
  * including trip completion, extension, and deletion
  **/
  editTrip(action) {
    var ApiMethod = '';
    var completion = false;
    var title = '';
    var message = '';

    if (action === 'extend') {
      ApiMethod = 'PUT';
      //TODO: bring up modal for time to modify trip.return
      execute(ApiMethod, completion)
    }
    else {
      if (action === 'cancel') {
          ApiMethod = 'DELETE';
          title = 'Cancelling A Trip'
          message = 'Are you sure you want to cancel the trip?'
      }
      else if (action === 'completed') {
        ApiMethod = 'PUT';
        completion = true;
        title = 'Ending A Trip';
        message = 'Are you sure you want to end this trip?'
      }
      // Double confirmation on API execution for deleting/completing trips
      Alert.alert(title, message, [
         {text: 'OK', onPress: () => this.execute(ApiMethod, completion)},
         {text: 'CANCEL', onPress: () => console.log('User regretted.')},
         ],
         {cancelable: false})
    }
  }
  /**
  * API method call to server
  * param: method, and trip completion status
  **/
  execute(ApiMethod, completion) {

  // trip deletion
  if (ApiMethod == 'DELETE')
  {
    fetch('http://' + localIp + ':8080/trips/' + this.state.trip._id, {method: ApiMethod})
     .then(handleErrors)
     .then(Alert.alert(
       'Trip Cancelled',
       'We also notified your contact about the cancellation',
       [{ text: 'OK', onPress: this.endStartPage()}]
       ))
     .catch(function(error) {
       Alert.alert('No Cellular Service', 'Can not reach server')})
  }
  // trip modification
  else {
    console.log(this.state.trip);
    fetch('http://' + localIp + ':8080/trips/', {
      method: ApiMethod,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId: this.state.trip._id,
        userId: this.state.trip.userId,
        returnTime: this.state.trip.returnTime,
        contactEmail: this.state.trip.contactEmail,
        contactPhone: this.state.trip.contactPhone,
        startingLocation: {
           latitude: this.state.trip.startingLocation.coordinates[0],
           longitude: this.state.trip.startingLocation.coordinates[1],
        },
        note: this.state.trip.note,
        completed: completion
      })
    })
    .then(handleErrors)
    .then(
      Alert.alert(
       'Trip Completed',
       'Good job!',
       [{ text: 'OK', onPress: this.endStartPage()}])
    )
    .catch(function(error) {
      Alert.alert('No Cellular Service', 'Can not reach server');
    })}
  }

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        navIcon={nativeImageSource({
                          android: 'ic_arrow_back_white_24dp',
                          width: 64,
                          height: 64
                        })}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'#FFFFFF'}/>
        <View style={styles.textContainer}>
          <Text>You told {this.props.contact.firstName} that you would be back from
              latitude  {this.state.trip.startingLocation.coordinates[0]},
              longitude  {this.state.trip.startingLocation.coordinates[1]}
                 by {this.props.return.month}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={() => this.editTrip('completed')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>End Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.extend}
              onPress={() => this.remove()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Extend Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => this.editTrip('cancel')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

function handleErrors(response) {
    if (!response.ok) {
      if (response.status == 400) {
        throw Error("User not found");
      }
      else if (response.status == 404) {
        throw Error("Invalid user");
      }
      else if (response.status == 403) {
        throw Error("Forbidden: not access to server");
      }
    }
    return response;
}

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',
     alignItems: 'stretch',
     backgroundColor: 'white',
   },
   toolbar: {
     height: 60,
     backgroundColor: '#00aaf1',
   },
   textContainer: {
     justifyContent: 'flex-start',
   },
   buttonContainer: {
     marginTop: 10,
     flexDirection: 'row',
     justifyContent: 'center',
   },
   submit: {
     backgroundColor: 'green',
     padding: 18,
   },
   remove: {
     backgroundColor: 'red',
     padding: 18,
   },
   extend: {
     backgroundColor: 'blue',
     padding: 18,
   },
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
