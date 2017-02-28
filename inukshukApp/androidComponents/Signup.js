/** Sign up page
* gather user's first and last name, username, email and
* phone number and then submits all information to server.
* Also handles error messages returned by the server should
* user information be invalid
**/

import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator
} from 'react-native';

import inukshukApp from '../index.android';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            fName: '',
            lName: '',
            userEmail: '',
            phoneNumber: '',
        };
    }
    /**
    * POST /users
    **/
    execute() {
        fetch('http://localhost:8080/users', {
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
                email: this.state.userEmail,
                phoneNumber: this.state.phoneNumber,
            })
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(function(responseJson) {
            Alert.alert(
              'Success!',
              'Your account has been created!',
              [
                {text: 'OK', onPress: () => console.log('OK')},
              ],
              { cancelable: false }
            )
            return responseJson.users
        }).catch(function(error) {
            Alert.alert(
              'Invalid contact info',
              error.message,
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
        })
    }


    render() {
        return (
        <View style = { {padding: 10}}>
           <Text style={styles.title}> Sign Up </Text>
           <TextInput placeholder = "Your user name" onChangeText={(text) => this.setState({userName: text})}/>
           <TextInput placeholder = "Your first name" onChangeText={(text) => this.setState({fName: text})}/>
           <TextInput placeholder = "Your last name" onChangeText={(text) => this.setState({lName: text})}/>
           <TextInput placeholder = "Your email" onChangeText={(text) => this.setState({userEmail: text})}/>
           <TextInput placeholder = "Your contact number" onChangeText={(text) => this.setState({phoneNumber: text})}/>
           <Text style={styles.signupBotton} onPress={()=> this.execute()}> Create Account </Text>
           <Text style={[styles.signupBotton, styles.cancelBotton]} onPress={()=> this.props.navigator.pop()}> Back </Text>
        </View>
        );
    }
}

/**
* handles POST /users if response != 200
**/
function handleErrors(response) {
    if (!response.ok) {
        if (response.status == 401) {
            throw Error("Please enter valid email address and phone number");
        }
        else if (response.status == 422) {
            throw Error("The email is already registered");
        }
    return response;
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