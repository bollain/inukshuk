import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, Alert, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';



export default class EditStartedTrip extends Component {
  constructor(prop) {
    super(props);
    this.state={
      trip: this.props.trip
    }
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
      // Double confirmation on API execution
      Alert.alert(title, message, [
         {text: 'OK', onPress: () => execute(ApiMethod, completion)},
         {text: 'CANCEL', onPress: () => console.log('User cancel execution.')},
         ],
         {cancelable: false})
    }
  }

 execute(ApiMethod, completion) {
  fetch('http://' + localIp + ':8080/trip', {
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
      //TODO: put in proper modal for time extension
      Alert.alert('Time extended by this much!')}
   })
  .catch(function(error) {
    Alert.alert('No Cellular Service', 'Can not reach server');
  });
 }

 render() {
  return(
    <View>
      <Text> </Text>
    </View>
  )
 }

}