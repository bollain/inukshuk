import React, { Component, PropTypes } from 'react';
import { View, Text, Alert, InteractionManager } from 'react-native';
import { throwCrumbs } from '../scripts/apiCalls.js';

export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [], // array of breadcrumbs stored
      numSent: 0, // number of breadcrumbs sent
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.timer = setInterval(() => {
        this.dropCrumb()
      }, 10000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  dropCrumb() {
    // get current Location
    this.getCrumb()
    // add to the array
    .then((currentLocation) => {
      return new Promise((resolve, reject) => {
        console.log(currentLocation);
        let breadcrumbs = this.state.breadcrumbs;
        breadcrumbs.push(currentLocation);
        this.setState({breadcrumbs: breadcrumbs});
        resolve(breadcrumbs);
      })
    })
    // try to send the array to the server
    .then((breadcrumbs) => {
      // throwCrumbs(this)
      console.log("throwing crumbs")
    })
    .catch((err) => console.error(err));

    // if fails, do nothing (will try to send the aray again)
    // if successful, clear the array
  }

  // Get the current position
  getCrumb() {
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

  render() {
    return(
      <View>
        <Text>{this.state.numSent} breadcrumbs sent</Text>
        <Text>Current crumbs: {JSON.stringify(this.state.breadcrumbs)}</Text>
      </View>
    );
  }
};
