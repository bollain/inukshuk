
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

import User from './User';

var localIp = '192.168.1.94';

export default class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: null,
        password: null,
      };
    }

    _navSignUp(){
        this.props.navigator.push({
            id: 'signup'
        })
    }
    login() {
      fetch('http://' + localIp + ':8080/login', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: this.state.username,
          password: this.state.password,
        })
      })
      .then(handleErrors)
      .then(response => response.json())
      .then(responseJson => {
        this.props.set('user', JSON.stringify(responseJson));
        _navigator.push({
          id: 'tripSummary',
          user: responseJson
        });
       })
      .catch(function(error) {
        Alert.alert('Can not reach server');
      });
   }

    // Assuming first user is created already (can be done through sign up)
    loginMock() {
      fetch('http://' + localIp + ':8080/users/62')
      .then(handleErrors)
      .then(response => response.json())
      .then(responseJson => {
        this.props.set('user', JSON.stringify(responseJson));
        _navigator.push({
          id: 'tripSummary',
          user: responseJson,
        });
       })
       .catch(function(error) {
         Alert.alert('No Cellular Service', 'Cannot reach server');
       });
    }

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
            <Text style = {styles.button} onPress={()=> this.loginMock()}>
                LOGIN
            </Text>
            <TouchableHighlight>
              <Text style={[styles.button, styles.createAccount]} onPress={()=> this._navSignUp()}>
                  No account? Create one now
               </Text>
            </TouchableHighlight>
          </View>
        </Image>
      </View> );
    }
}

function handleErrors(response) {

  if (!response.ok) {
    throw Error("Invalid user name and/or password");
  }
  return response;
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
