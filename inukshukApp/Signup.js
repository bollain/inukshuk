/* This page will gather all user information and send it to server */


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator
} from 'react-native';

import inukshukApp from './index.android';
import Guards from './guards';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            userName: '',
            fName: '',
            lName: '',
            email: '',
            phoneNumber: '',
        };
    }
    execute() {

        this._execute();
        Alert.alert(
          'Success!',
          'Your account has been created!',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    }
    async _execute() {
        try {
            let response = await
            fetch('http://192.168.1.73:8080/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 0,
                    userName: this.state.userName,
                    firstName: this.state.fName,
                    lastName: this.state.lName,
                    email: this.state.email,
                    phoneNumber: this.state.phoneNumber,
                })
            });

            let responseJson = await response.json();
            return responseJson.users;
        }
        catch(error) {
            Alert.alert(
                          'Invalid contact info',
                          'Please ensure your contact info is correct',
                          [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: false }
                        )
        }

    };
    render() {
        return (
        <View style = { {padding: 10}}>
           <Text style={styles.title}> Sign Up </Text>
           <TextInput placeholder = "Your user name"/>
           <TextInput placeholder = "Your first name"/>
           <TextInput placeholder = "Your last name"/>
           <TextInput placeholder = "Your email"/>
           <TextInput placeholder = "Your contact number"/>
           <Text style={styles.signupBotton} onPress={()=> this.execute()}> Create Account </Text>
           <Text style={[styles.signupBotton, styles.cancelBotton]} onPress={()=>this.props.navigator.pop()}> Back </Text>
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
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    alignSelf: 'stretch',

  },
  cancelBotton: {
    backgroundColor: 'gainsboro',
  }
});