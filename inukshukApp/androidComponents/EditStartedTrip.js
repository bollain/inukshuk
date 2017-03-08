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
* Currently only allows changing return time of trip
**/
  editTrip(action) {
    var ApiMethod = '';
    var completion = false;
    if (action === 'cancel')
      ApiMethod = 'DELETE';
    else if (action === 'extend')
      ApiMethod = 'PUT'
    else if (action === 'completed') {
      ApiMethod = 'PUT';
      completion = true;
    }

    fetch('http://192.168.1.73:8080/trip', {
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
    .then(response => response.json())
    .then(responseJson => {
      this.props.set('user', JSON.stringify(responseJson));
      _navigator.push({
        id: 'tripSummary',
        user: responseJson
      });
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