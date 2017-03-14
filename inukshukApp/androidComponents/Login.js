
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
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'stretch'
        }}>
        <Image source={require('../img/background.jpg')} style={{flex: 1, height: null, width: null}}>
          <View>
            <Text style={{fontSize: 32, fontWeight: 'bold', textAlign:'center', marginTop:80, marginBottom: 40}}>
              Inukshuk
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 50}}>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textContainer}
                placeholder="Email"
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textContainer}
                placeholder="Password"
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>
            <Text style = {styles.button} onPress={()=> loginMock(this)}>
                LOGIN
            </Text>
            <TouchableHighlight>
              <Text style={[styles.button, styles.createAccount]} onPress={()=> this.navSignUp()}>
                  No account? Create one now
               </Text>
            </TouchableHighlight>
          </View>
        </Image>
      </View> );
    }
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 40,
  },
  inputBox: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    margin: 10,
  },
  textColored: {
    color: 'white',
  },
  button: {
    fontSize: 18,
    backgroundColor: 'yellowgreen',
    borderRadius: 5,
    margin: 9,
    padding: 10,
    alignSelf: 'stretch',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 8,
  },
  createAccount: {
    fontSize: 14,
    backgroundColor: '#1e90ff',
  },
});
