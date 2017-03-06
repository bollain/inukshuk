import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, Alert, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';

var nativeImageSource = require('nativeImageSource');

import Icon from 'react-native-vector-icons/MaterialIcons';
const checkIcon = <Icon name="check-circle" size={24} color="green" />;

export default class TripSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      contact: null,
      return: null,
      note: null,
      user: this.props.user,
    };
    console.log('constructing summary')
    this.setSummaryNote = this.setSummaryNote.bind(this);
    this.setSummaryLocation = this.setSummaryLocation.bind(this);
    this.setSummaryReturn = this.setSummaryReturn.bind(this);
    this.setSummaryContact = this.setSummaryContact.bind(this);
  }

  navLocation(){
    this.props.get('location').then((response) => {
      this.props.navigator.push({
        id: 'location',
        location: response,
        callback: this.setSummaryLocation,
      });
    });
  }
  navContacts(){
    this.props.get('contact').then((response) => {
      this.props.navigator.push({
        id: 'contact',
        contact: response,
        callback: this.setSummaryContact,
      });
    });
  }
  navReturn(){
    this.props.get('return').then((response) => {
      this.props.navigator.push({
        id: 'return',
        return: response,
        callback: this.setSummaryReturn,
      });
    });
  }
  navNotes(){
    this.props.get('notes').then((response) => {
      this.props.navigator.push({
        id: 'note',
        note: response,
        callback: this.setSummaryNote,
      });
    });
  }
  navUser(){
    //TODO: set up profile button
  }

  async setSummaryNote(currentNote) {
    await this.setState({note: currentNote});
  }

  async setSummaryLocation(currentLocation) {
    await this.setState({location: currentLocation});
  }

  async setSummaryContact(currentContact) {
    await this.setState({contact: currentContact});
  }

  async setSummaryReturn(currentReturn) {
    await this.setState({return: currentReturn});
  }

  async setSummaryUser(currentUser) {
    await this.setState({user: currentUser});
  }

  render() {
    // Set check marks if details have been provided
    let noteCheck = (this.state.note != null ? checkIcon : null);
    let locationCheck = (this.state.location != null ? checkIcon : null);
    let returnCheck = (this.state.return != null ? checkIcon : null);
    let contactCheck = (this.state.contact != null ? checkIcon : null);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}/>
        <View style={styles.tripDetailsContainer}>
          <ScrollView>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navLocation.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>Where are you going?</Text>
                {locationCheck}
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navContacts.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>Who should know?</Text>
                {contactCheck}
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navReturn.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>When will you be back?</Text>
                {returnCheck}
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navNotes.bind(this)}>
                <View style = {styles.innerDetail}>
                  <Text style={styles.tripDetailText}>What more should your contact know?</Text>
                  {noteCheck}
                </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={styles.start}
            onPress={this.startTrip.bind(this)}
            activeOpacity={.8}>
          <Text style={styles.startText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  startTrip() {
    console.log(this.props.user);
    fetch('http://localhost:8080/trips', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          tripId: 0,
          userId: this.props.user._id,
          returnTime: '2017-07-09T00:51:16.224Z',
          contactEmail: 'nanstchen@gmail.com',
          contactPhone: '7788334289',
          startingLocation: {
            latitude: 49.2504,
            longitude: -123.1094,
          },
          note: this.state.note,
      })
    })
    .then(handleErrors)
    .then(response => response.json())
    .then(function(responseJson) {
      Alert.alert(
        'Success!',
        'Your trip has been created!',
        [
          {text: 'OK', onPress: () => Alert.alert('Start Page Under Development')},
        ],
        { cancelable: false }
      )
    })
  }
}

function handleErrors(response) {
  if (!response.ok) {
    if (response.status == 400) {
      throw Error("Please log out and then try again");
    }
  }
  return response;
}

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',

   },
   toolbar: {
     backgroundColor: '#00aaf1',
     height: 60,
   },
   tripDetailsContainer: {
     flex: 4,
     flexDirection: 'column',
     justifyContent: 'flex-start',
     alignItems: 'stretch',
   },
   tripDetail: {
     padding: 18,
     borderBottomWidth: 2,
     borderBottomColor: '#e6e6e6'
   },
   tripDetailText: {
     fontSize: 16,
   },
   innerDetail: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   startContainer: {
     flex: 1,
     justifyContent: 'flex-end',
     alignItems: 'stretch'
   },
   start: {
     backgroundColor: 'green',
     padding: 18,
   },
   startText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
