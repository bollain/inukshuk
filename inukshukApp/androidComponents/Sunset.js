import React, { Component, PropTypes } from 'react';
import { Text, Alert } from 'react-native';
import { toTwentyFour } from '../scripts/datesAndTimes.js';


export default class Sunset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sunset: '...',
    }
  }

  componentDidMount() {
    this.getSunset();
  }

  getSunset() {
    let now = new Date();
    let offset = now.getTimezoneOffset();
    console.log(offset);
    let lat = this.props.location.latitude;
    let lon = this.props.location.longitude;
    let url = 'http://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lon + '&date=today';
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.results.sunset);
      let sunsetTimeArray = toTwentyFour(responseJson.results.sunset);
      var sunsetDate = new Date(now.getFullYear(), now.getMonth(), now.getDay(), sunsetTimeArray[0], sunsetTimeArray[1], 0, 0);
      sunsetDate.setMinutes(sunsetDate.getMinutes() - offset);
      let hours = (sunsetDate.getHours()<10?'0':'') + sunsetDate.getHours();
      let minutes = (sunsetDate.getMinutes()<10?'0':'') + sunsetDate.getMinutes();
      this.setState({sunset: hours + ':' + minutes});
    })
    .catch((error) => {
      Alert.alert('Can not reach sunset server');
    });
  }

  render() {
    return(
      <Text>{this.state.sunset}</Text>
    );
  }
};
