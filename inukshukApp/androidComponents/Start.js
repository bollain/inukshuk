import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView, InteractionManager } from 'react-native';

import Countdown from './Countdown';

var nativeImageSource = require('nativeImageSource');
var localIp = '128.189.242.29';

// To pad time
var pad = "00"

export default class Start extends Component {
  constructor(props) {
    super(props);
    let returnTime = this.props.return;
    this.state = {
      sunset: null,
      trip: this.props.trip,
      return: this.props.return,
      returnDate: new Date(returnTime.year, returnTime.month, returnTime.day, returnTime.hour, returnTime.minute, 0, 0),
      timer: {
        hours: 12,
        minutes: 10,
        seconds: 30,
      },
    }
    this.getSunset = this.getSunset.bind(this);
  }

  componentWillMount() {
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

  //TODO: make the async storage have no values using callback with clearTrip in tripSummary.js
  end() {
    this.props.callback(false);
    _navigator.pop();
  }

  /**
  * Handles trip editing from start page.
  * including trip completion, extension, and deletion
  **/
  editTrip(action) {
    var ApiMethod = '';
    var completion = false;
    var title = '';
    var message = '';

    if (action === 'extend') {
      ApiMethod = 'PUT';
      //TODO: bring up modal for time to modify trip.return
      execute(ApiMethod, completion)
    }
    else {
      if (action === 'cancel') {
          ApiMethod = 'DELETE';
          title = 'Cancelling A Trip'
          message = 'Are you sure you want to cancel the trip?'
      }
      else if (action === 'completed') {
        ApiMethod = 'PUT';
        completion = true;
        title = 'Ending A Trip';
        message = 'Are you sure you want to end this trip?'
      }
      // Double confirmation on API execution for deleting/completing trips
      Alert.alert(title, message, [
         {text: 'OK', onPress: () => this.execute(ApiMethod, completion)},
         {text: 'CANCEL', onPress: () => console.log('User regretted.')},
         ],
         {cancelable: false})
    }
  }
  /**
  * API method call to server
  * param: method, and trip completion status
  **/
  execute(ApiMethod, completion) {
    // trip deletion
    if (ApiMethod == 'DELETE')
    {
      fetch('http://' + localIp + ':8080/trips/' + this.state.trip._id, {method: ApiMethod})
       .then(handleErrors)
       .then(Alert.alert(
         'Trip Cancelled',
         'We also notified your contact about the cancellation',
         [{ text: 'OK', onPress: this.end()}]
         ))
       .catch(function(error) {
         Alert.alert('No Cellular Service', 'Can not reach server')})
    }
    // trip modification
    else {
      console.log(this.state.trip);
      fetch('http://' + localIp + ':8080/trips/', {
        method: ApiMethod,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: this.state.trip._id,
          userId: this.state.trip.userId,
          returnTime: this.state.trip.returnTime,
          contactEmail: this.state.trip.contactEmail,
          contactPhone: this.state.trip.contactPhone,
          startingLocation: {
             latitude: this.state.trip.startingLocation.coordinates[0],
             longitude: this.state.trip.startingLocation.coordinates[1],
          },
          note: this.state.trip.note,
          completed: completion
        })
      })
      .then(handleErrors)
      .then(
        Alert.alert(
         'Trip Completed',
         'Good job!',
         [{ text: 'OK', onPress: this.end()}])
      )
      .catch(function(error) {
        Alert.alert('No Cellular Service', 'Can not reach server');
      });
    }
  }

  render() {
    console.log(this.props);
    let returnDate = this.state.returnDate.toDateString();
    let returnTime = this.state.returnDate.toLocaleTimeString().substring(0,5);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title='Trip'
                        titleColor={'#FFFFFF'}/>
        <View style={styles.textContainer}>
          <Text style={styles.textLeft}>
            <Text>You told </Text>
            <Text style={{fontStyle: 'italic'}}>{this.props.contact.firstName} </Text>
            <Text>that you would be back from </Text>
            <Text style={{fontStyle: 'italic'}}>{this.props.location.latitude},{this.props.location.longitude} </Text>
            <Text>by </Text>
            <Text style={{fontStyle: 'italic'}}>{returnTime} on {returnDate}</Text>
          </Text>
          <View style={{marginTop: 10, marginBottom: 20, alignItems: 'center',}}>
            <Image
              style={{opacity:0.6, marginBottom: 5, width: 50, height:50}}
              source={require('../img/ic_timer_black_24dp.png')}
            />
            <Text style={styles.textCenter}>Your trip will end in</Text>
            <Text style={[styles.textCenter, {fontSize:20,fontWeight:'bold'}]}>
              <Countdown endDate={this.state.returnDate} />
            </Text>
          </View>
          <View style={{marginTop: 10, marginBottom: 20, alignItems: 'center',}}>
            <Image
              style={{opacity:0.6, marginBottom: 5, width: 50, height:25}}
              source={require('../img/ic_wb_sunny_black_24dp.png')}
            />
            <Text style={styles.textCenter}>Tonight the sun sets at</Text>
            <Text style={[styles.textCenter, {fontSize:20,fontWeight:'bold'}]}>{this.state.sunset}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.submit}
                onPress={() => this.editTrip('completed')}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>End Trip</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.extend}
                onPress={() => this.remove()}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Extend Trip</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.remove}
                onPress={() => this.editTrip('cancel')}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Cancel Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

function handleErrors(response) {
    if (!response.ok) {
      if (response.status == 400) {
        throw Error("User not found");
      }
      else if (response.status == 404) {
        throw Error("Invalid user");
      }
      else if (response.status == 403) {
        throw Error("Forbidden: not access to server");
      }
    }
    return response;
}

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
     flex: 4,
     justifyContent: 'flex-start',
     margin: 10,
   },
   textLeft: {
     fontSize: 16,
     textAlign: 'left',
   },
   textCenter: {
     fontSize: 16,
     textAlign: 'center',
   },
   buttonContainer: {
     alignItems: 'flex-end',
   },
   buttons: {
     flexDirection: 'row',
   },
   button: {
     flex: 1,
     alignItems: 'stretch',
   },
   submit: {
     backgroundColor: 'green',
     padding: 18,
   },
   remove: {
     backgroundColor: 'red',
     padding: 18,
   },
   extend: {
     backgroundColor: 'blue',
     padding: 18,
   },
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
