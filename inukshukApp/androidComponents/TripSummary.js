import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, Alert, Button, TouchableOpacity, Image, AsyncStorage, Modal } from 'react-native';

var nativeImageSource = require('nativeImageSource');

var localIp = '192.168.1.73';

import Icon from 'react-native-vector-icons/MaterialIcons';
const checkIcon = <Icon name="check-circle" size={24} color="green" />;

var monthArray = new Array();
monthArray[0] = "Jan";
monthArray[1] = "Feb";
monthArray[2] = "Mar";
monthArray[3] = "Apr";
monthArray[4] = "May";
monthArray[5] = "Jun";
monthArray[6] = "Jul";
monthArray[7] = "Aug";
monthArray[8] = "Sept";
monthArray[9] = "Oct";
monthArray[10] = "Nov";
monthArray[11] = "Dec";

// To pad time
var pad = "00"

export default class TripSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      contact: null,
      return: null,
      note: null,
      modalVisible: false,
    };
    console.log('constructing summary')
    this.setSummaryNote = this.setSummaryNote.bind(this);
    this.setSummaryLocation = this.setSummaryLocation.bind(this);
    this.setSummaryReturn = this.setSummaryReturn.bind(this);
    this.setSummaryContact = this.setSummaryContact.bind(this);
  }

  componentDidMount() {
    this.props.multiGet(['location','contact','return','note']).then((response => {
      this.setState({
        location: JSON.parse(response[0][1]),
        contact: JSON.parse(response[1][1]),
        return: JSON.parse(response[2][1]),
        note: response[3][1],
      });
    }));
  }

  navLocation(){
    this.props.get('location').then((response) => {
      this.props.navigator.push({
        id: 'location',
        location: response,
        callback: this.setSummaryLocation,
      });
    });
  }
  navContacts(){
    this.props.get('contact').then((response) => {
      this.props.navigator.push({
        id: 'contact',
        contact: response,
        callback: this.setSummaryContact,
      });
    });
  }
  navReturn(){
    this.props.get('return').then((response) => {
      this.props.navigator.push({
        id: 'return',
        return: response,
        callback: this.setSummaryReturn,
      });
    });
  }
  navNotes(){
    this.props.get('notes').then((response) => {
      this.props.navigator.push({
        id: 'note',
        note: response,
        callback: this.setSummaryNote,
      });
    });
  }
  navStart(){
    console.log('navstart');
    if (this.state.location != null && this.state.contact != null && this.state.return != null && this.state.note != null) {
      this.startTrip(this.props.get('user'), this.state.location, this.state.contact, this.state.return, this.state.note);
    } else {
      Alert.alert('Please fill in all trip details before proceeding')
    }
  }
  navUser(){
    this.props.get('user').then((response) => {
      console.log(response);
      this.props.navigator.push({
        id: 'user',
        user: response,
      });
    });
  }

  startTrip(user, location, contact,returnTime, note) {
    console.log(this.props.user);
    fetch('http://' + localIp + ':8080/trips', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          tripId: 0,
          userId: this.props.user._id,
          returnTime: '2017-07-09T00:51:16.224Z',
          contactEmail: 'nanstchen@gmail.com',
          contactPhone: '7788334289',
          startingLocation: {
            latitude: 49.2504,
            longitude: -123.1094,
          },
          note: "am all good!",
          completed: false,
      })
    })
    .then(handleErrors)
    .then(response => response.json())
    .then(function(responseJson) {
      //this.props.set('tripId', responseJson._id);
      Alert.alert(
        'Success!',
        'Your trip has been created!',
        [
          {text: 'OK', onPress: _navigator.push({
            id: 'start',
            tripJson: responseJson,
            user: user,
            location: location,
            contact: contact,
            return: returnTime,
            note: note,
            })
          },
        ],
        { cancelable: false }

        //TODO: Paul will add his logic of notifiaction here
      )
    })
  }

  clearTrip() {
    this.props.multiRemove(['location','contact','return','note']).then((response => {
      this.setState({
        location: null,
        contact: null,
        return: null,
        note: null,
      });
    }));
    this.setModalVisible(!this.state.modalVisible);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async setSummaryNote(currentNote) {
    await this.setState({note: currentNote});
  }

  async setSummaryLocation(currentLocation) {
    await this.setState({location: JSON.parse(currentLocation)});
  }

  async setSummaryContact(currentContact) {
    await this.setState({contact: JSON.parse(currentContact)});
  }

  async setSummaryReturn(currentReturn) {
    await this.setState({return: JSON.parse(currentReturn)});
  }

  padTime(num) {
    return pad.substring(0, pad.length - num.toString().length) + num.toString();
  }

  async setSummaryUser(currentUser) {
    await this.setState({user: currentUser});
  }

  render() {
    // Set check values if details have been provided
    let noteCheck = (this.state.note != null ? checkIcon : null);

    let locationCheck = (this.state.location != null ? checkIcon : null);
    let chosenLocationLat = (this.state.location != null ? this.state.location.latitude.toFixed(4).toString() + ',' : null);
    let chosenLocationLon = (this.state.location != null ? this.state.location.longitude.toFixed(4) : null);

    let returnCheck = (this.state.return != null ? checkIcon : null);
    let chosenReturnTime = (this.state.return != null ? this.padTime(this.state.return.hour) + ':' + this.padTime(this.state.return.minute) : null);
    let chosenReturnDate = (this.state.return != null ? monthArray[this.state.return.month] + ' ' + this.state.return.day.toString() + ', ' : null);

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
            <TouchableHighlight
                style = {styles.tripDetail}
                underlayColor='#e6e6e6'
                onPress={this.navLocation.bind(this)}>
              <View style = {styles.innerDetail}>
                <Text style={styles.tripDetailText}>Where are you going?</Text>
                <View style = {styles.chosenValues}>
                  <Text style={styles.chosenValuesText}>
                    {chosenLocationLat}{chosenLocationLon}
                  </Text>
                  {locationCheck}
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                style = {styles.tripDetail}
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
                  <Text style={styles.tripDetailText}>What more should your contact know?</Text>
                  {noteCheck}
                </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.buttons}>
          <View style={styles.clearContainer}>
            <TouchableOpacity
              style={styles.clear}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
              activeOpacity={.8}>
              <Text style={styles.startText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.startContainer}>
            <TouchableOpacity
              style={styles.start}
              onPress={this.navStart.bind(this)}
              activeOpacity={.8}>
              <Text style={styles.startText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{
           flex: 1,
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
           backgroundColor: 'rgba(0, 0, 0, 0.5)'
         }}>
          <View style={{
            width: 300,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: 'white',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 5,
            }}>
              Are you sure you want to clear this trip?
            </Text>
            <View style={{
              borderTopWidth: 1,
              borderTopColor: '#e6e6e6',
            }}>
              <TouchableHighlight
                style={styles.modalOption}
                underlayColor='#e6e6e6'
                onPress={() => {
                this.clearTrip()
              }}>
                <Text style={{fontSize: 16, textAlign: 'center'}}>Clear</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.modalOption}
                underlayColor='#e6e6e6'
                onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text style={{fontSize: 16, textAlign: 'center'}}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
         </View>
        </Modal>
      </View>
    );
  }
}

function handleErrors(response) {
  if (!response.ok) {
    if (response.status == 400) {
      throw Error("Please log out and then try again");
    }
  }
  return response;
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
   modalOption: {
     padding: 15,
     borderBottomColor: '#e6e6e6',
     borderBottomWidth: 1,
   }
});
