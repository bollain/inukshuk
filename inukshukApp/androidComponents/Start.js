import React, { Component, PropTypes } from 'react';
import { View,
  Text,
  Image,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  TextInput,
  AsyncStorage,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView,
  InteractionManager
} from 'react-native';

import { completeTrip, cancelTrip } from '../scripts/apiCalls.js';

import { toMonth, toWeekday, padTime, toTwentyFour } from '../scripts/datesAndTimes.js'

import Countdown from './Countdown';

var nativeImageSource = require('nativeImageSource');
var localIp = '192.168.1.94';

export default class Start extends Component {
  constructor(props) {
    super(props);
    let returnTime = this.props.return;
    this.state = {
      sunset: null,
      trip: this.props.trip,
      return: this.props.return,
      returnDate: new Date(returnTime.year, returnTime.month, returnTime.day, returnTime.hour, returnTime.minute, 0, 0),
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

  // Confirm, then cancel trip
  cancelTrip() {
    Alert.alert(
      'Are you sure you want to cancel your trip?',
      'Your contact will be notified',
      [
        {text: 'No'},
        {text: 'Cancel trip', onPress: () => cancelTrip(this)},
      ],
    );
  }

  // Confirm, then complete trip
  completeTrip() {
    Alert.alert(
      'Are you sure you want to complete your trip?',
      'Your contact will be notified',
      [
        {text: 'No'},
        {text: 'Complete trip', onPress: () => completeTrip(this)},
      ],
    );
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
                onPress={() => this.completeTrip()}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.extend}
                onPress={() => this.remove()}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Extend</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.remove}
                onPress={() => this.cancelTrip()}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Cancel</Text>
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
