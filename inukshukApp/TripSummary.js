import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';

export default class TripSummary extends Component {
  navLocation(){
    this.props.navigator.push({
      id: 'location'
    })
  }
  navContacts(){
    this.props.navigator.push({
      id: 'contacts'
    })
  }
  navReturn(){
    this.props.navigator.push({
      id: 'return'
    })
  }
  navNotes(){
    this.props.navigator.push({
      id: 'notes'
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
              <Text style={styles.tripDetailText}>What more should your contact know?</Text>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={styles.start}
            onPress={this.startTrip}
            activeOpacity={.8}>
          <Text style={styles.startText}>Start Trip</Text>
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
