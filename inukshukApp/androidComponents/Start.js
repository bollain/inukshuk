import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';

var nativeImageSource = require('nativeImageSource');

// To pad time
var pad = "00"

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sunset: null,
    }
    this.getSunset = this.getSunset.bind(this);
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
      let sunsetTimeArray = this.toTwentyFour(responseJson.results.sunset);
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

  // Return array of hours and minutes given a string formatted AM/PM time
  toTwentyFour(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    return [hours, minutes];
  }

  padTime(num) {
    return pad.substring(0, pad.length - num.toString().length) + num.toString();
  }

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        navIcon={nativeImageSource({
                          android: 'ic_arrow_back_white_24dp',
                          width: 64,
                          height: 64
                        })}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'#FFFFFF'}/>
        <View style={styles.textContainer}>
          <Text>You told {this.props.contact.firstName} that you would be back from {this.props.location.latitude},{this.props.location.longitude} by {this.props.return.month}</Text>
          <Text>{this.state.sunset}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={console.log('hello')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => console.log('press')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Add Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => console.log('press')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',
     alignItems: 'stretch',
     backgroundColor: 'white',
   },
   toolbar: {
     height: 60,
     backgroundColor: '#00aaf1',
   },
   textContainer: {
     justifyContent: 'flex-start',
   },
   buttonContainer: {
     marginTop: 10,
     flexDirection: 'row',
     justifyContent: 'center',
   },
   submit: {
     backgroundColor: 'green',
     padding: 18,
   },
   remove: {
     backgroundColor: 'red',
     padding: 18,
   },
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
