import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';

var nativeImageSource = require('nativeImageSource');

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //trip: this.props.trip,
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
         {text: 'OK', onPress: () => execute(ApiMethod, completion)},
         {text: 'CANCEL', onPress: () => console.log('User cancel execution.')},
         ],
         {cancelable: false})
    }
  }
  /**
  * API method call to server
  * param: tripId, method, and trip completion status
  **/
  execute(ApiMethod, completion) {
    fetch('http://' + localIp + ':8080/trips/{' + trip._id + '}', {
      method: ApiMethod,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId: this.state.tripId,
        userId: this.state.userId,
        returnTime: this.state.return,
        contactEmail: this.state.contact.emails,
        contactPhone: this.state.contact.phones,
        startingLocation: {
           latitude: this.state.location.latitude,
           longitude: this.state.location.longitude,
        },
        note: '',
        completed: completion
      })
    })
    .then(handleErrors)
    .then(responseJson => {
      if (ApiMethod === 'DELETE' ) {
        _navigator.push({
          id: 'tripSummary',
          user: responseJson})}
      else if (APIMethod === 'PUT' && completion) {
        //this.props.set('trip', JSON.stringify(responseJson));
        _navigator.push({
          id: 'tripSummary',
          user: responseJson})}
      else if (APIMethod === 'PUT' && !completion) {
        //this.props.set('trip', JSON.stringify(responseJson));
        Alert.alert('Time extended by this much!')}
     })
    .catch(function(error) {
      Alert.alert('No Cellular Service', 'Can not reach server');
    });
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
          <Text>You told {this.props.contact.firstName} that you would be back from {this.props.location.latitute},{this.props.location.longitude} by {this.props.return.month}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={() => this.set()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => this.remove()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Add Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => this.remove()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

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
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
