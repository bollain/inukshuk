import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet } from 'react-native';

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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',
     alignItems: 'stretch',
   },
   toolbar: {
     backgroundColor: '#00aaf1',
     height: 60,
   },
   tripDetailsContainer: {
     flexDirection: 'column',
     justifyContent: 'flex-start',
     alignItems: 'stretch',
   },
   tripDetail: {
     height: 60,
     padding: 18,
   },
   tripDetailText: {
     fontSize: 16,
   }
});
