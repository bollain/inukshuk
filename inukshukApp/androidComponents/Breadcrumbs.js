import React, { Component, PropTypes } from 'react';
import { View, Text, Alert, InteractionManager } from 'react-native';
import { throwCrumbs } from '../scripts/apiCalls.js';
import BackgroundJob from 'react-native-background-job';

// var lat = 36.7201600;
// var lng = -4.4203400;

const backgroundJob = {
  jobKey: "breadcrumbs",
  job: () => dropCrumb()
};

// function fetchSunset() {
//   fetch('http://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng)
//   .then((response) => response.json())
//   .then((jsonResponse) => {
//     console.log(JSON.stringify(jsonResponse))
//   })
//   .catch((err) => console.error(err))
// }

var breadcrumbsArr = [];
var numSent = 0;

BackgroundJob.register(backgroundJob);

export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSent: 0, // number of breadcrumbs sent
    }
  }

  componentDidMount() {
    var backgroundSchedule = {
      jobKey: "breadcrumbs",
      timeout: 10000,
      period: 1000,
    }

    BackgroundJob.schedule(backgroundSchedule);

    InteractionManager.runAfterInteractions(() => {
      this.timer = setInterval(() => {
        dropCrumb()
      }, 1000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return(
      <View>
        <Text>{this.state.numSent} breadcrumbs sent</Text>
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
