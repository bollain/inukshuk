/** Profile page
* Display a account info: username, name, email, phone number
* Allow user to edit their email and phone number
**/

import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableOpacity,
} from 'react-native';
import { updateUser } from '../scripts/apiCalls.js';
var nativeImageSource = require('nativeImageSource');

export default class User extends Component {

  // Set up the user component with user data
  constructor(props){
    super(props);
    let jsonUser = JSON.parse(this.props.user);
    console.log(jsonUser);
    this.state = {
      id: jsonUser._id,
      firstName: jsonUser.firstName,
      lastName: jsonUser.lastName,
      email: jsonUser.email,
      phoneNumber: jsonUser.phoneNumber,
    }
  }

  // Render the user component to the screen
  render() {
    return(
      <View style = {styles.container}>

        {/* Android toolbar */}
        <ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          navIcon={nativeImageSource({
            android: 'ic_arrow_back_white_24dp',
            width: 64,
            height: 64
          })}
          onIconClicked={this.props.navigator.pop}
          titleColor={'#FFFFFF'}/>

        <View style={styles.textContainer}>

          {/* First name */}
          <Text style={styles.fieldHeader}> First Name </Text>
          <Text style={styles.field}> {this.state.firstName}</Text>

          {/* Last name */}
          <Text style={styles.fieldHeader}> Last Name </Text>
          <Text style={styles.field}> {this.state.lastName}</Text>

          {/* Email input */}
          <Text style={styles.fieldHeader}> Email</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.email}
              onChangeText={(text) => this.setState({email: text})}/>
          </View>

          {/* Phone number input */}
          <Text style={styles.fieldHeader}> Contact Number</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.phoneNumber}
              onChangeText={(text) => this.setState({phoneNumber: text})}/>
          </View>

        </View>

        {/* Update button */}
        <View style={styles.updateContainer}>
          <TouchableOpacity
            style={styles.update}
            onPress={() => updateUser(this)}
            activeOpacity={.8}>
            <Text style={styles.buttonText}>Save changes</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
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
    justifyContent: 'flex-start',
    margin: 10,
    flex: 1,
  },
  fieldHeader: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  field: {
    fontSize: 16,
    color: 'black',
  },
  updateContainer: {
    alignItems: 'stretch',
  },
  update: {
    backgroundColor: 'green',
    padding: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  inputText: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 45,
    fontSize: 16,
  },
  inputBox: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
});
