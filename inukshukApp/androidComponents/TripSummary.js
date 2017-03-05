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
    this.props.get('note').then((response) => {
      console.log(response);
      this.props.navigator.push({
        id: 'note',
        note: response,
        callback: this.setSummaryNote,
      });
    });
  }
  navStart(){
    this.props.multiGet(['location','contact','return','notes']).then((response) => {
      console.log(response);
      this.props.navigator.push({
        id: 'start',
        location: response[0][1],
        contact: response[1][1],
        return: response[2][1],
        note: response[3][1],
      });
    });
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
            onPress={this.navStart.bind(this)}
            activeOpacity={.8}>
          <Text style={styles.startText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
