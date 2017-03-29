import React, { Component, PropTypes } from 'react';

import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
  Image,
  AsyncStorage,
  TextInput,
  Switch,
  Navigator,
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';

import { toMonth, padTime } from '../scripts/datesAndTimes.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postTrip } from '../scripts/apiCalls.js';
import { createEndOfTripNotification } from '../scripts/notifications.js';

var nativeImageSource = require('nativeImageSource');

const checkIcon = <Icon name="check-circle" size={24} color="green" />;

export default class TripSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripName: null,
      savedName: false,
      startLocation: null,
      endLocation: null,
      contact: null,
      contactAddress: null,
      return: null,
      note: null,
      destIsStart: true,
      user: JSON.parse(this.props.user),
    };
    console.log('constructing summary')
    this.setSummaryNote = this.setSummaryNote.bind(this);
    this.setSummaryStartLocation = this.setSummaryStartLocation.bind(this);
    this.setSummaryEndLocation = this.setSummaryEndLocation.bind(this);
    this.setSummaryReturn = this.setSummaryReturn.bind(this);
    this.setSummaryContact = this.setSummaryContact.bind(this);
    this.setSummaryContactAddress = this.setSummaryContactAddress.bind(this);
    this.setSummaryUser = this.setSummaryUser.bind(this);
    this.clearTrip = this.clearTrip.bind(this);
  }

  componentDidMount() {
    storageMultiGet(['tripName', 'startLocation', 'endLocation', 'contact','contactAddress','return','note','user']).then((response => {
      console.log(response);
      this.setState({
        tripName: response[0][1],
        savedName: (response[0][1] != null ? true : false),
        startLocation: JSON.parse(response[1][1]),
        endLocation: JSON.parse(response[2][1]),
        contact: JSON.parse(response[3][1]),
        contactAddress: response[4][1],
        return: JSON.parse(response[5][1]),
        note: response[6][1],
        user: JSON.parse(response[7][1]),
      });
    }))
    .catch((error) => console.error(error));
  }

  navStartLocation(){
    storageGet('startLocation').then((response) => {
      this.props.navigator.push({
        id: 'startLocation',
        startLocation: response,
        callback: this.setSummaryStartLocation,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }
  navEndLocation(){
    storageGet('endLocation').then((response) => {
      this.props.navigator.push({
        id: 'endLocation',
        endLocation: response,
        callback: this.setSummaryEndLocation,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }
  navContacts(){
    storageGet('contact').then((response) => {
      this.props.navigator.push({
        id: 'contact',
        contact: response,
        setContact: this.setSummaryContact,
        setContactAddress: this.setSummaryContactAddress,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }
  navReturn(){
    storageGet('return').then((response) => {
      this.props.navigator.push({
        id: 'return',
        return: response,
        callback: this.setSummaryReturn,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }
  navNotes(){
    storageGet('note').then((response) => {
      this.props.navigator.push({
        id: 'note',
        note: response,
        callback: this.setSummaryNote,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }
  navStart(tripJson){
    console.log('navstart');
    this.props.navigator.push({
      id: 'start',
      tripName: this.state.tripName,
      startLocation: this.state.startLocation,
      endLocation: this.state.endLocation,
      contact: this.state.contact,
      return: this.state.return,
      note: this.state.note,
      trip: tripJson,
      callback: this.clearTrip,
    });
  }
  navUser(){
    storageGet('user').then((response) => {
      console.log(response);
      this.props.navigator.push({
        id: 'user',
        user: response,
        callback: this.setSummaryUser,
        gestures: Navigator.SceneConfigs.PushFromRight.gestures
      });
    });
  }

  // Given an address string, determine whether it is an email
  isEmail(str) {
    if (str.includes("@"))
      return true;
    else return false;
  }

  // Post the trip to the server
  start() {
    console.log('navstart');
    if ((this.state.tripName &&
         this.state.startLocation != null &&
         this.state.contact != null &&
         this.state.return != null &&
         this.state.note != null &&
         this.state.destIsStart) ||
        (this.state.tripName != null &&
         this.state.startLocation != null &&
         this.state.contact != null &&
         this.state.return != null &&
         this.state.note != null &&
         !this.state.destIsStart &&
         this.state.endLocation != null)) {
      let trip = {
        userId: this.state.user._id,
        tripName: this.state.tripName,
        returnTime: new Date(
          this.state.return.year,
          this.state.return.month,
          this.state.return.day,
          this.state.return.hour,
          this.state.return.minute, 0,0),
        startingLocation: {
          latitude: this.state.startLocation.latitude,
          longitude: this.state.startLocation.longitude,
        },
        endingLocation: {
          latitude: (
            this.state.destIsStart ?
            this.state.startLocation.latitude :
            this.state.endLocation.latitude
          ),
          longitude: (
            this.state.destIsStart ?
            this.state.startLocation.longitude :
            this.state.endLocation.longitude
          ),
        },
        note: this.state.note,
        completed: false,
      };
      if (this.isEmail(this.state.contactAddress)) {
        trip.contactEmail = this.state.contactAddress;
      } else {
        trip.contactPhone = this.state.contactAddress.replace(/\D+/g, "");
      }
      console.log(trip);
      postTrip(trip)
      .then((responseJson) => {
        console.log(responseJson);
        createEndOfTripNotification(responseJson._id, new Date(responseJson.returnTime));
        Alert.alert(
          'Success!',
          'Your trip has been created!',
          [
            {text: 'OK', onPress: () => this.navStart(JSON.stringify(responseJson))},
          ],
          { cancelable: false }
        )
      })
      .catch((error) => console.error(error));
    } else {
      Alert.alert(
        'Something\'s missing',
        'Please fill in all trip details before proceeding'
      );
    }
  }

  clearTrip() {
    storageMultiRemove(['tripName','startLocation','endLocation','contact','return','note']).then((response => {
      this.setState({
        tripName: null,
        savedName: false,
        startLocation: null,
        endLocation: null,
        contact: null,
        return: null,
        note: null,
      });
    }));
  }

  async setSummaryNote(currentNote) {
    await this.setState({note: currentNote});
  }

  async setSummaryStartLocation(currentStartLocation) {
    await this.setState({startLocation: JSON.parse(currentStartLocation)});
  }

  async setSummaryEndLocation(currentEndLocation) {
    await this.setState({endLocation: JSON.parse(currentEndLocation)});
  }

  async setSummaryContact(currentContact) {
    await this.setState({contact: JSON.parse(currentContact)});
  }

  async setSummaryContactAddress(currentContactAddress) {
    await this.setState({contactAddress: currentContactAddress});
  }

  async setSummaryReturn(currentReturn) {
    await this.setState({return: JSON.parse(currentReturn)});
  }

  async setSummaryUser(currentUser) {
    await this.setState({user: currentUser});
  }

  saveTripName() {
    if (this.state.tripName != null && this.state.tripName.length > 0) {
      storageSet('tripName', this.state.tripName)
      .then(() => {
        this.setState({
          savedName: true,
        })
      })
    } else {
      storageRemove('tripName')
      .then(() => {
        this.setState({
          savedName: false,
        })
      })
    }
  }

  render() {
    // Set check values if details have been provided
    let tripNameCheck = (this.state.savedName ? checkIcon : null);

    let noteCheck = (this.state.note != null ? checkIcon : null);

    let startLocationCheck = (this.state.startLocation != null ? checkIcon : null);
    let chosenStartLocationLat = (this.state.startLocation != null ? this.state.startLocation.latitude.toFixed(4).toString() + ',' : null);
    let chosenStartLocationLon = (this.state.startLocation != null ? this.state.startLocation.longitude.toFixed(4) : null);

    let endLocationCheck = (this.state.endLocation != null ? checkIcon : null);
    let chosenEndLocationLat = (this.state.endLocation != null ? this.state.endLocation.latitude.toFixed(4).toString() + ',' : null);
    let chosenEndLocationLon = (this.state.endLocation != null ? this.state.endLocation.longitude.toFixed(4) : null);

    let returnCheck = (this.state.return != null ? checkIcon : null);
    let chosenReturnTime = (this.state.return != null ? padTime(this.state.return.hour) + ':' + padTime(this.state.return.minute) : null);
    let chosenReturnDate = (this.state.return != null ? toMonth(this.state.return.month, true) + ' ' + this.state.return.day.toString() + ', ' : null);

    let chosenContact = (this.state.contact != null ? this.state.contact.firstName : null);
    let contactCheck = (this.state.contact != null ? checkIcon : null);

    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        actions={[{title: 'Profile',
                                  icon: require('../img/ic_account_circle_white_24dp.png'),
                                  show: 'always'}]}
                        onActionSelected={this.navUser.bind(this)}/>

        <View style={styles.tripDetailsContainer}>
          <ScrollView>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                placeholder={'Give your trip a name'}
                defaultValue={this.state.tripName}
                autoCapitalize={'words'}
                onChangeText={(text) => this.setState({tripName: text})}
                onEndEditing={() => this.saveTripName()}/>
              <View style={{marginTop: 10}}>
                {tripNameCheck}
              </View>
            </View>
            <TouchableHighlight
                style = {[styles.tripDetailLocation, styles.firstTripDetail]}
                underlayColor='#e6e6e6'
                onPress={this.navStartLocation.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>Where will it start?</Text>
                <View style = {styles.chosenValues}>
                  <Text style={styles.chosenValuesText}>
                    {chosenStartLocationLat}{chosenStartLocationLon}
                  </Text>
                  {startLocationCheck}
                </View>
              </View>
            </TouchableHighlight>
            <View style={styles.innerDetail}>
              <Text style={{marginLeft: 18, marginTop: 12, marginBottom: 8}}>
                The trip will end {this.state.destIsStart ? 'where it started' : 'somewhere else'}
              </Text>
              <Switch
                style={{margin: 8, marginRight:17}}
                onValueChange={(value) => this.setState({destIsStart: value})}
                value={this.state.destIsStart} />
            </View>
            {this.state.destIsStart ?
              null
              :
              <TouchableHighlight
                  style={styles.tripDetailLocation}
                  underlayColor='#e6e6e6'
                  onPress={this.navEndLocation.bind(this)}>
                <View style = {styles.innerDetail}>
                  <Text style={styles.tripDetailText}>Where will it end?</Text>
                  <View style = {styles.chosenValues}>
                    <Text style={styles.chosenValuesText}>
                      {chosenEndLocationLat}{chosenEndLocationLon}
                    </Text>
                    {endLocationCheck}
                  </View>
                </View>
              </TouchableHighlight>
            }
            <TouchableHighlight
                style = {[styles.tripDetail, styles.firstTripDetail]}
                underlayColor='#e6e6e6'
                onPress={this.navContacts.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>Who should know?</Text>
                <View style = {styles.chosenValues}>
                  <Text style={styles.chosenValuesText}>
                    {chosenContact}
                  </Text>
                  {contactCheck}
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navReturn.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>When will you be back?</Text>
                <View style = {styles.chosenValues}>
                  <Text style={styles.chosenValuesText}>
                    {chosenReturnDate}{chosenReturnTime}
                  </Text>
                  {returnCheck}
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navNotes.bind(this)}>
                <View style = {styles.innerDetail}>
                  <Text style={styles.tripDetailText}>What else should your contact know?</Text>
                  {noteCheck}
                </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.buttons}>
          <View style={styles.clearContainer}>
            <TouchableOpacity
              style={styles.clear}
              onPress={() => {
                Alert.alert(
                  'Clear trip details',
                  'Are you sure you want to do this?',
                  [
                    {text: 'Cancel'},
                    {text: 'Clear trip details', onPress: () => this.clearTrip()},
                  ],
                )
              }}
              activeOpacity={.8}>
              <Text style={styles.startText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.startContainer}>
            <TouchableOpacity
              style={styles.start}
              onPress={this.start.bind(this)}
              activeOpacity={.8}>
              <Text style={styles.startText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',
     backgroundColor: 'white',
   },
   toolbar: {
     backgroundColor: '#00aaf1',
     height: 60,
   },
   tripDetailsContainer: {
     flex: 4,
     flexDirection: 'column',
     justifyContent: 'flex-start',
     alignItems: 'stretch',
   },
   tripDetail: {
     padding: 18,
     borderBottomWidth: 2,
     borderBottomColor: '#e6e6e6'
   },
   tripDetailLocation: {
     padding: 18,
   },
   firstTripDetail: {
     borderTopWidth: 2,
     borderTopColor: '#e6e6e6'
   },
   tripDetailText: {
     fontSize: 16,
     marginRight: 10,
   },
   innerDetail: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   chosenValues: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
   },
   chosenValuesText: {
     marginRight:5,
     marginTop:3,
   },
   buttons: {
     flexDirection: 'row',
   },
   startContainer: {
     flex: 3,
     justifyContent: 'flex-end',
     alignItems: 'stretch'
   },
   start: {
     backgroundColor: 'green',
     padding: 18,
   },
   clearContainer: {
     flex: 1,
     alignItems: 'stretch',
   },
   clear: {
     backgroundColor: 'red',
     padding: 18,
   },
   startText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   },
   inputText: {
     flex: 1,
     alignSelf: 'stretch',
     height: 45,
     fontSize: 16,
   },
   inputBox: {
     backgroundColor: '#e6e6e6',
     borderRadius: 5,
     margin: 10,
     paddingLeft: 8,
     paddingRight: 8,
     paddingTop: 6,
     paddingBottom: 4,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'stretch'
   },
});
