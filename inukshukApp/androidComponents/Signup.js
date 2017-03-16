/** Sign up page
* gather user's first and last name, username, email and
* phone number and then submits all information to server.
* Also handles error messages returned by the server should
* user information be invalid
**/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ToolbarAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { createUser } from '../scripts/apiCalls.js';
var nativeImageSource = require('nativeImageSource');

export default class SignUp extends Component {

  // Render the sign up class to the screen
  render() {
    return (
      <View style={styles.container}>

        {/* Android toolbar */}
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        navIcon={nativeImageSource({
                          android: 'ic_arrow_back_white_24dp',
                          width: 64,
                          height: 64
                        })}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'#FFFFFF'}/>

        <ScrollView style={styles.textContainer}>

          {/* User name input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "Username"
              onChangeText={(text) => this.setState({userName: text})}
            />
          </View>

          {/* First name input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "First name"
              onChangeText={(text) => this.setState({firstName: text})}
            />
          </View>

          {/* Last name input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "Last name"
              onChangeText={(text) => this.setState({lastName: text})}
            />
          </View>

          {/* Email input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "Email"
              onChangeText={(text) => this.setState({email: text})}
            />
          </View>

          {/* Phone number input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "Phone number"
              onChangeText={(text) => this.setState({phoneNumber: text})}
            />
          </View>

          {/* Password */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder = "Password"
              onChangeText={(text) => this.setState({password: text})}
            />
          </View>

        </ScrollView>

        {/* Create account button */}
        <View style={styles.createContainer}>
          <TouchableOpacity
            style={styles.create}
            onPress={()=> createUser(this)}
            activeOpacity={.8}>
            <Text style={styles.buttonText}>Create account</Text>
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
    backgroundColor: 'white',
  },
  toolbar: {
    height: 60,
    backgroundColor: '#00aaf1',
  },
  textContainer: {
    padding: 10,
    flex: 1,
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
  inputText: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    fontSize: 16,
    height: 45,
  },
  createContainer: {

    alignItems: 'stretch',
  },
  create: {
    backgroundColor: 'green',
    padding: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
});
