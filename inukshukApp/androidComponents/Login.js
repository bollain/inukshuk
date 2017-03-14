
/** The splash login page **/
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';

// var api = require('../network/apiCalls.js');
import { login, loginMock } from '../network/apiCalls.js';

export default class Login extends Component {
    // Constuct the component
    constructor(props) {
      super(props);
      this.state = {
        username: null,
        password: null,
      };
    }

    // Navigate to the signup page
    navSignUp(){
      this.props.navigator.push({
        id: 'signup'
      });
    }

    // Render the login class to the screen
    render() {
      return (
      <View style = {styles.container}>

        {/* Nice full-screen image */}
        <Image source={require('../img/background.jpg')} style={styles.bannerImage}>

          {/* Inukshuk title */}
          <Text style={styles.title}>
            Inukshuk
          </Text>

          <View style={styles.inputContainer}>

            {/* Email input */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder='Email'
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>

            {/* Password box */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder='Password'
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>

            {/* Sign in button */}
            <View style={styles.signinContainer}>
              <TouchableOpacity
                style={styles.signin}
                onPress={()=> loginMock(this)}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Sign in</Text>
              </TouchableOpacity>
            </View>

            {/* Create account button */}
            <View style={styles.createContainer}>
              <TouchableOpacity
                style={styles.create}
                onPress={()=> this.navSignUp()}
                activeOpacity={.8}>
                <Text style={styles.buttonText}>Create an account</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Image>
      </View> );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  bannerImage: {
    flex: 1,
    height: null,
    width: null,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  inputText: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 40,
    fontSize: 16,
  },
  inputBox: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  button: {
    fontSize: 18,
    backgroundColor: 'yellowgreen',
    borderRadius: 5,
    margin: 9,
    padding: 10,
    alignSelf: 'stretch',
  },
  createAccount: {
    fontSize: 14,
    backgroundColor: '#1e90ff',
  },
  buttons: {
    flexDirection: 'row',
  },
  signinContainer: {
    alignItems: 'stretch'
  },
  signin: {
    backgroundColor: 'green',
    padding: 18,
  },
  createContainer: {
    alignItems: 'stretch',
  },
  create: {
    backgroundColor: '#1e90ff',
    padding: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
});
