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
  }

  navLocation(){
    this.props.navigator.push({
      id: 'location'
    })
  }
  navContacts(){
    this.props.navigator.push({
      id: 'contact'
    })
  }
  navReturn(){
    this.props.navigator.push({
      id: 'return'
    })
  }
  navNotes(){
    this.props.navigator.push({
      id: 'note'
    })
  }
  render() {

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
              <Text style={styles.tripDetailText}>Where are you going?</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navContacts.bind(this)}>
              <Text style={styles.tripDetailText}>Who should know?</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navReturn.bind(this)}>
              <Text style={styles.tripDetailText}>When will you be back?</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navNotes.bind(this)}>
                <View style = {styles.innerDetail}>
                  <Text style={styles.tripDetailText}>What more should your contact know?</Text>
                  {checkIcon}
                </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={styles.start}
            onPress={this.startTrip}
            activeOpacity={.8}>
          <Text style={styles.startText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  startTrip() {
    Alert.alert('Oops! Not ready yet.')
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
