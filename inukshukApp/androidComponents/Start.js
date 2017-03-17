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
  InteractionManager,
  TimePickerAndroid,
} from 'react-native';

import { completeTrip, cancelTrip, extendTrip } from '../scripts/apiCalls.js';

import { toMonth, toWeekday, padTime } from '../scripts/datesAndTimes.js';

import Countdown from './Countdown';
import Sunset from './Sunset';

var nativeImageSource = require('nativeImageSource');

export default class Start extends Component {
  constructor(props) {
    super(props);
    let returnTime = this.props.return;
    this.state = {
      sunset: null,
      trip: this.props.trip,
      return: this.props.return,
      returnDate: new Date(returnTime.year, returnTime.month, returnTime.day, returnTime.hour, returnTime.minute, 0, 0),
      newReturnDate: this.props.return,
    }
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

  // Confirm, then extend the trip
  extendTrip() {
    this.showTimePicker()
    .then(() => {
      Alert.alert(
        'Are you sure you want to extend your trip?',
        'Your contact will be notified that you plan to return on ' + this.state.newReturnDate.toDateString() + ' at ' + this.state.newReturnDate.toLocaleTimeString().substring(0,5),
        [
          {text: 'No'},
          {text: 'Extend trip', onPress: () => {
            extendTrip(this);
            let returnTime = this.state.return;
            returnTime.hour = this.state.newReturnDate.getHours();
            returnTime.minute = this.state.newReturnDate.getMinutes();
            this.setState({
              returnDate: this.state.newReturnDate,
              return: returnTime,
            })
          }},
        ],
      );
    })
  }

  // Select new return time
  async showTimePicker() {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(
        {hour: this.state.return.hour, minute: this.state.return.minute}
      );
      if (action === TimePickerAndroid.timeSetAction) {
        this.setState({
          newReturnDate: new Date(
            this.state.return.year, this.state.return.month,
            this.state.return.day, hour, minute, 0, 0
          ),
        });
      }
    } catch ({code, message}) {
      console.warn('Error setting time: ', message);
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
            <Text style={[styles.textCenter, {fontSize:20,fontWeight:'bold'}]}>
              <Sunset location={this.props.location} />
            </Text>
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
                onPress={() => this.extendTrip()}
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
