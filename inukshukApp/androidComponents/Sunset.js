import React, { Component, PropTypes } from 'react';
import { Text, Alert } from 'react-native';
import { toTwentyFour, padTime } from '../scripts/datesAndTimes.js';


export default class Sunset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sunset: '...',
    }
  }

  componentDidMount() {
    this.getSunset(
      this.props.returnDate,
      this.props.location.latitude,
      this.props.location.longitude
    );
  }

  getSunset(myDate, lat, lon) {
    let now = new Date();
    let offset = now.getTimezoneOffset();
    console.log(myDate);
    let url = 'http://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lon +
              '&date=' + myDate.getFullYear() + '-' + padTime(myDate.getMonth() + 1) + '-' +
              padTime(myDate.getDate());
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.results.sunset);
      let sunsetTimeArray = toTwentyFour(responseJson.results.sunset);
      console.log(sunsetTimeArray);
      var sunsetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunsetTimeArray[0], sunsetTimeArray[1], 0, 0);
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
