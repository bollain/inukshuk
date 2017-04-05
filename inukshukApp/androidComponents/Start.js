import React, { Component, PropTypes } from 'react';
import {
  View,
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
  Linking,
} from 'react-native';

import { completeTrip, cancelTrip, extendTrip } from '../scripts/apiCalls.js';

import {
  toMonth,
  toWeekday,
  padTime,
  isInFutureByXMins
} from '../scripts/datesAndTimes.js';

import Countdown from './Countdown';
import Sunset from './Sunset';
import Breadcrumbs from './Breadcrumbs';
import BackgroundJob from 'react-native-background-job';

import { cancelNotification, modifyNotification } from '../scripts/notifications.js';
var nativeImageSource = require('nativeImageSource');

// The minimum number of minutes in the future that a user can set the return
var MIN_MINS_IN_FUTURE = 10;

export default class Start extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.trip);
    let returnTime = this.props.return;
    this.state = {
      sunset: null,
      return: this.props.return,
      returnDate: new Date(returnTime.year, returnTime.month, returnTime.day, returnTime.hour, returnTime.minute, 0, 0),
      newReturnDate: this.props.return,
    }
  }

  // Clean up before leaving the start page. Clear the breadcrumbs job if it is
  // ongoing, clear the trip details and pop the navigator
  leaveStart() {
    BackgroundJob.cancel({jobKey: 'breadcrumbs'});
    cancelNotification(JSON.parse(this.props.trip)._id);
    this.props.callback();
    _navigator.pop();
  }

  onComponentWillUnmount() {
    cancelNotification(JSON.parse(this.props.trip)._id);
  }

  // Confirm, then cancel trip
  cancelTrip() {
    Alert.alert(
      'Are you sure you want to cancel your trip?',
      'Your contact will be notified',
      [
        {text: 'No'},
        {text: 'Cancel trip', onPress: () => {
          cancelTrip(JSON.parse(this.props.trip)._id)
          .then(
            Alert.alert(
              'Trip Cancelled',
              'We also notified your contact about the cancellation',
              [{ text: 'OK', onPress: () => this.leaveStart()}]
            )
          )
          .catch((error) => {
            Alert.alert('Something went wrong', error);
          });
        }}
      ]
    );

  }

  // Confirm, then complete trip
  completeTrip() {
    Alert.alert(
      'Are you sure you want to complete your trip?',
      'Your contact will be notified',
      [
        {text: 'No'},
        {text: 'Complete trip', onPress: () => {
          completeTrip(JSON.parse(this.props.trip)._id)
          .then(
            Alert.alert(
              'Trip Completed',
              'We notified your contact that you returned safely',
              [{ text: 'OK', onPress: () => this.leaveStart()}]
            )
          )
          .catch((error) => {
            Alert.alert('Something went wrong', error);
          });
        }}
      ]
    );
  }

  // Confirm, then extend the trip
  extendTrip() {
    this.showTimePicker()
    .then((action) => {
      // Do nothing if user didn't set a time
      if (action === TimePickerAndroid.dismissedAction) {
        return;
      }
      // Check if the selected date is in the future
      if (isInFutureByXMins(this.state.newReturnDate, MIN_MINS_IN_FUTURE)) {
        Alert.alert(
          'Are you sure you want to extend your trip?',
          'Your contact will be notified that you plan to return on ' + this.state.newReturnDate.toDateString() + ' at ' + this.state.newReturnDate.toLocaleTimeString(),
          [
            {text: 'No'},
            {text: 'Extend trip', onPress: () => {
              extendTrip(JSON.parse(this.props.trip)._id, this.state.newReturnDate)
              .then(() => {
                let returnTime = this.state.return;
                returnTime.hour = this.state.newReturnDate.getHours();
                returnTime.minute = this.state.newReturnDate.getMinutes();
                this.setState({
                  returnDate: this.state.newReturnDate,
                  return: returnTime,
                });
                Alert.alert(
                  'Trip Extended to ' + this.state.newReturnDate.toDateString() + ' at ' + this.state.newReturnDate.toLocaleTimeString(),
                  'We also notified your contact of this change',
                );
                modifyNotification(this.props.trip._id, this.state.newReturnDate);
              })
              .catch((error) => {
                Alert.alert('Something went wrong', error);
              });
            }},
          ]
        );
      } else {
        // Change the date back
        this.setState({
          newReturnDate: this.state.returnDate
        });
        // Alert the user of the problem
        Alert.alert(
          'If I could turn back time... ♫ ♪',
          'Please pick a time at least ' +
          MIN_MINS_IN_FUTURE +
          ' minutes in the future',
        );
      }
    })
    .catch((err) => {
      console.error(err)
      Alert.alert(err);
    });
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
      return action;
    } catch ({code, message}) {
      console.warn('Error setting time: ', message);
    }
  }

  // Open a map url
  openMap(geoUrl) {
    Linking.canOpenURL(geoUrl).then(supported => {
      if (supported) {
        Linking.openURL(geoUrl);
      } else {
        console.log('Don\'t know how to open URI: ' + geoUrl);
      }
    });
  }

  render() {
    let endLocation = (this.props.endLocation == null ?
                       this.props.startLocation :
                       this.props.endLocation)
    console.log(this.props);
    let returnDate = this.state.returnDate.toDateString();
    let returnTime = this.state.returnDate.toLocaleTimeString();
    let startGeoUrl = 'geo:' + this.props.startLocation.latitude + ',' +
                      this.props.startLocation.longitude + '?q=' +
                      this.props.startLocation.latitude + ',' +
                      this.props.startLocation.longitude + '(Start)';
    let endGeoUrl = 'geo:' + endLocation.latitude + ',' +
                    endLocation.longitude + '?q=' +
                    endLocation.latitude + ',' +
                    endLocation.longitude + '(End)';
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.tripName}
                        titleColor={'#FFFFFF'}/>
        <View style={styles.innerContainer}>
          <ScrollView>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>
                <Text>You told </Text>
                <Text style={{fontStyle: 'italic'}}>
                  {this.props.contact.firstName}
                </Text>
                <Text> that you would arrive at </Text>
                <Text
                  style={{fontStyle: 'italic', color: '#00aaf1'}}
                  onPress={() => this.openMap(endGeoUrl)}>
                  <Text>
                    {endLocation.latitude.toFixed(6)},
                    {endLocation.longitude.toFixed(6)}
                  </Text>
                </Text>
                <Text> from </Text>
                <Text
                  style={{fontStyle: 'italic', color: '#00aaf1'}}
                  onPress={() => this.openMap(startGeoUrl)}>
                  <Text>
                    {this.props.startLocation.latitude.toFixed(6)},
                    {this.props.startLocation.longitude.toFixed(6)}
                  </Text>
                </Text>
                <Text> by </Text>
                <Text style={{fontStyle: 'italic'}}>{returnTime} on {returnDate}</Text>
              </Text>
              <View style={{marginTop: 10, alignItems: 'center',}}>
                <Image
                  style={{opacity:0.6, marginBottom: 2, width: 50, height:50}}
                  source={require('../img/ic_timer_black_24dp.png')}
                />
                <Text style={styles.textCenter}>Your trip will end in</Text>
                <Text style={[styles.textCenter, {fontSize:20,fontWeight:'bold'}]}>
                  <Countdown endDate={this.state.returnDate} />
                </Text>
              </View>
              <View style={{marginTop: 10, alignItems: 'center',}}>
                <Image
                  style={{opacity:0.6, marginBottom: 2, width: 50, height:25}}
                  source={require('../img/ic_wb_sunny_black_24dp.png')}
                />
                <Text style={styles.textCenter}>
                  On {returnDate}, the sun sets at
                </Text>
                <Text style={[styles.textCenter, {fontSize:20,fontWeight:'bold'}]}>
                  <Sunset location={this.props.startLocation} returnDate={this.state.returnDate}/>
                </Text>
              </View>
              <View style={{marginTop: 10, alignItems: 'center',}}>
                <Image
                  style={{opacity:0.6, marginBottom: 2, width: 50, height:50}}
                  source={require('../img/ic_location_on_black_24dp.png')}
                />
                <Text style={styles.textCenter}>Automatically send your location every 10 minutes</Text>
                <Breadcrumbs tripId={JSON.parse(this.props.trip)._id}/>
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={styles.buttons}>
              <View style={styles.button}>
                <TouchableOpacity
                  ref = "complete"
                  style={styles.submit}
                  onPress={() => this.completeTrip()}
                  activeOpacity={.8}>
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  ref = "extend"
                  style={styles.extend}
                  onPress={() => this.extendTrip()}
                  activeOpacity={.8}>
                  <Text style={styles.buttonText}>Extend</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  ref = "cancel"
                  style={styles.remove}
                  onPress={() => this.cancelTrip()}
                  activeOpacity={.8}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
   innerContainer: {
     flex: 1,
     justifyContent: 'space-between',
   },
   textContainer: {
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
