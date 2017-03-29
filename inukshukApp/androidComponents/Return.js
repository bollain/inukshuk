import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  TouchableWithoutFeedback,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';
import {
  toMonth,
  toWeekday,
  padTime,
  isInFutureByXMins
} from '../scripts/datesAndTimes.js'

var nativeImageSource = require('nativeImageSource');

// The minimum number of minutes in the future that a user can select
var MIN_MINS_IN_FUTURE = 10;

export default class Return extends Component {
  constructor(props) {
    super(props);
    if (this.props.return != null) {
      this.state = JSON.parse(this.props.return);
    } else {
      let now = new Date();
      let defaultTime = new Date(now.getTime() + (60 * 60000));
      this.state = {
        hour: defaultTime.getHours(),
        minute: defaultTime.getMinutes(),
        year: defaultTime.getFullYear(),
        month: defaultTime.getMonth(),
        day: defaultTime.getDate(),
        dayOfWeek: defaultTime.getDay(),
      }
    }
    this.set = this.set.bind(this);
    this.remove = this.remove.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
  }
  set() {
    let currentReturn = JSON.stringify(this.state);
    storageSet('return', currentReturn)
    .then(this.props.callback(currentReturn))
    .then(_navigator.pop());
  }
  remove() {
    storageRemove('return')
    .then(this.props.callback(null))
    .then(_navigator.pop());
  }

  async showDatePicker() {
    try {
      var date = new Date(this.state.year, this.state.month, this.state.day);
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: date
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(
          year, month, day, this.state.hour, this.state.minute, 0, 0
        );
        if (isInFutureByXMins(date, MIN_MINS_IN_FUTURE)) {
          this.setState({
            year: year,
            month: month,
            day: day,
            dayOfWeek: date.getDay(),
          });
        }
        else {
          Alert.alert(
            'If I could turn back time... ♫ ♪',
            'Please pick a time at least ' +
            MIN_MINS_IN_FUTURE +
            ' minutes in the future',
          );
        }
      }
    } catch ({code, message}) {
      console.warn('Error setting date: ', message);
    }
  }

  async showTimePicker() {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({
        hour: this.state.hour,
        minute: this.state.minute
      });
      if (action === TimePickerAndroid.timeSetAction) {
        var date = new Date(
          this.state.year, this.state.month, this.state.day, hour, minute, 0, 0
        );
        if (isInFutureByXMins(date, MIN_MINS_IN_FUTURE)) {
          this.setState({
            hour: hour,
            minute: minute,
          });
        }
        else {
          Alert.alert(
            'If I could turn back time... ♫ ♪',
            'Please pick a time at least ' +
            MIN_MINS_IN_FUTURE +
            ' minutes in the future',
          );
        }
      }
    } catch ({code, message}) {
      console.warn('Error setting time: ', message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={'Return Time'}
                        navIcon={nativeImageSource({
                          android: 'ic_arrow_back_white_24dp',
                          width: 64,
                          height: 64
                        })}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'#FFFFFF'}/>

        <View style={styles.timeContainer}>
          <TouchableHighlight
            style={styles.timeButton}
            underlayColor='#e6e6e6'
            onPress={this.showDatePicker.bind(this)}>
            <View>
              <Text style={[styles.buttonText, styles.timeText]}>
                <Text>{toWeekday(this.state.dayOfWeek, false)} </Text>
                <Text>{toMonth(this.state.month, false)} </Text>
                <Text>{this.state.day}, </Text>
                <Text>{this.state.year}</Text>
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.timeButton}
            underlayColor='#e6e6e6'
            onPress={this.showTimePicker.bind(this)}>
            <View>
              <Text style={[styles.buttonText, styles.timeText]}>
                {padTime(this.state.hour)}:{padTime(this.state.minute)}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => this.set()}
            activeOpacity={.8}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
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
   buttonContainer: {
     marginTop: 10,
     flexDirection: 'row',
     justifyContent: 'center',
   },
   submit: {
     backgroundColor: 'green',
     padding: 18,
   },
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   },
   timeButton: {
     backgroundColor: '#e6e6e6',
     padding: 16,
     borderTopColor: 'white',
     borderTopWidth: 2,
     borderRadius: 5,
     margin: 10,
     marginBottom: 0,
   },
   timeText: {
     color: 'black',
     fontWeight: 'normal',
   },
});
