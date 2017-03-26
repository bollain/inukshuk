import React, { Component, PropTypes } from 'react';
import { View, Text, Alert, InteractionManager, Switch } from 'react-native';
import { throwCrumbs } from '../scripts/apiCalls.js';
import BackgroundJob from 'react-native-background-job';

// Set up the breadcrumbs job and register
const breadcrumbsJob = {
  jobKey: "breadcrumbs",
  job: () => dropCrumb()
};
BackgroundJob.register(breadcrumbsJob);

// Define the breadcrumbs schedule
var breadcrumbsSchedule = {
  jobKey: "breadcrumbs",
  timeout: 10000,
  period: 600000,
}

// Set up an array of breadcrumbs to be synced with the server
var breadcrumbsArr = [];
var numSent = 0;

export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSent: 0, // number of breadcrumbs sent
      isBreadcrumbs: false, // set whether breadcrumbs is on
    }
  }

  componentWillUnmount() {
    BackgroundJob.cancel({jobKey: 'breadcrumbs'});
  }

  // Schedule or cancel the breadcrumbs job depending on the toggle
  setBreadcrumbs(value) {
    if (value) {
      Alert.alert(
        'Are you sure?',
        'This feature runs in the background when your screen is off and uses extra mobile data and ',
        [
          {text: 'No'},
          { text: 'Yes', onPress: () => {
            this.setState({isBreadcrumbs: value});
            BackgroundJob.schedule(breadcrumbsSchedule);
          }}
        ]
      )
    } else {
      this.setState({isBreadcrumbs: value});
      BackgroundJob.cancel({jobKey: 'breadcrumbs'});
    }
  }

  render() {
    return(
      <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Text style={{marginLeft: 18, marginTop: 12, marginBottom: 8}}>
          {this.state.isBreadcrumbs ? 'ON' : 'OFF'}
        </Text>
        <Switch
          style={{margin: 8, marginRight:17}}
          onValueChange={(value) => this.setBreadcrumbs(value)}
          value={this.state.isBreadcrumbs} />
      </View>
    );
  }
};

// Get and push breadcrumbs to the server
function dropCrumb() {
  // get current position
  getCrumb()
  // add to the array
  .then((currentLocation) => {
    return new Promise((resolve, reject) => {
      console.log(currentLocation);
      breadcrumbsArr.push(currentLocation);
      resolve();
    })
  })
  // try to send the array to the server
  .then(() => {
    // throwCrumbs(this)
    console.log(breadcrumbsArr);
    console.log("throwing crumbs")
  })
  // Increment count of crumbs sent
  .then(() => {
    return new Promise((resolve, reject) => {
      numSent = numSent + breadcrumbsArr.length;
      resolve();
    })
  })
  // Clear the local storage of breadcrumbs
  .then(() => {
    return new Promise((resolve, reject) => {
      // breadcrumbs = [];
      console.log(numSent);
      resolve();
    })
  })
  .catch((err) => console.error(err));
}

// Get the current position
function getCrumb() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          timeStamp: new Date(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        alert(JSON.stringify(error))
      },
    );
  });
}
