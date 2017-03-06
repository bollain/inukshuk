
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
  TouchableHighlight
} from 'react-native';

import User from './User'

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
      fetch('http://128.189.243.148:8080/login', {
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
     .then(function(responseJson) {
          User.setUser(responseJson)
     })
    }

    loginMock(navigator) {
      let responseJson = fetch('http://192.168.1.73:8080/users/9', {
      })
      .then(handleErrors)
      .then(response => response.json())
      .then(responseJson => {User.setUser(responseJson).then(navigator.push({id: 'tripSummary'}))})
    }

    navTripSummary(user){
      this.props.get('user').then((response) => {
        this.props.navigator.push({
          id: 'tripSummary',
          user: response,
          callback: tripSummary.setSummaryUser(user)
        });
      });
    }

    render() {
      let logoImg =
          { uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS7z5gcSo96ms9T8Hy6x7Zm2dzYXpGMQaOpecvQORG1p78VYpxBxg'
          };
      return (
      <View style = {{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        <Image
          source={logoImg} style={{width: 193, height: 110, paddingBottom: 50}}/>
        <TextInput
          style={styles.textContainer}
          placeholder="Email"
          onChangeText={(text) => this.setState({text: username})}
        />
        <TextInput
          style={styles.textContainer}
          placeholder="Password"
          onChangeText={(text) => this.setState({text: password})}
        />
        <Text style = {styles.button} onPress={()=> this.loginMock(this.props.navigator)}>
            LOGIN
        </Text>
        <TouchableHighlight>
          <Text style={[styles.button, styles.createAccount]} onPress={()=> this._navSignUp()}>
              Don't have an account? Create one now
           </Text>
        </TouchableHighlight>
      </View> );
    }
}

function handleErrors(response) {
  if (!response.ok) {
    if (response.status == 403) {
      throw Error("Invalid username or password");
    }
  }
  return response;
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 40,
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