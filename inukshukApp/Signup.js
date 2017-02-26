/* This page will gather all user information and send it to server */


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableHighlight
} from 'react-native';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fName: '',
            lName: '',
            email: '',
            number: '',
        };
    }
    async _execute() {
        try {
            let response = await

            fetch('/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: this.state.fName,
                    lastName: this.state.lName,
                    email: this.state.userEmail,
                    number: this.state.userNumber,
                })
            })
            let responseJson = await response.json();
            return responseJson.user;
        }
        catch(error) {
            console.error(error);
        }

    };
    render() {
        return (
        <View style = { {padding: 10}}>
           <Text style={styles.title}> Sign Up </Text>
           <TextInput placeholder = "Your first name"/>
           <TextInput placeholder = "Your last name"/>
           <TextInput placeholder = "Your email"/>
           <TextInput placeholder = "Your contact number"/>
           <Text style={styles.signupBotton} onPress={()=> this._execute()}> Create Account </Text>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  signupBotton: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    alignSelf: 'stretch',

  }
});