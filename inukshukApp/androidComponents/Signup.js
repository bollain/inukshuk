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
  Navigator,
  ToolbarAndroid,
} from 'react-native';

import inukshukApp from '../index.android';


var nativeImageSource = require('nativeImageSource');

var localIp = '192.168.1.94';


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
    async execute() {
      fetch('http://' + localIp + ':8080/users', {
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
            {text: 'OK', onPress: () => _navigator.push({id: 'login'})},
          ],
          { cancelable: false }
        )
      })
      .catch(function(error) {
         Alert.alert( 'No Cellular Service', 'Cannot reach server',
           [
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false })
       });
       this.props.set('user', JSON.stringify({
           id: 0,
           userName: this.state.userName,
           firstName: this.state.fName,
           lastName: this.state.lName,
           email: this.state.userEmail,
           phoneNumber: this.state.phoneNumber,
       }));
    }

    render() {
      return (
        <View style={styles.container}>
          <ToolbarAndroid style={styles.toolbar}
                          title={this.props.title}
                          navIcon={nativeImageSource({
                            android: 'ic_arrow_back_white_24dp',
                            width: 64,
                            height: 64
                          })}
                          onIconClicked={this.props.navigator.pop}
                          titleColor={'#FFFFFF'}/>
          <View style={styles.textContainer}>
             <TextInput placeholder = "Your user name" onChangeText={(text) => this.setState({userName: text})}/>
             <TextInput placeholder = "Your first name" onChangeText={(text) => this.setState({fName: text})}/>
             <TextInput placeholder = "Your last name" onChangeText={(text) => this.setState({lName: text})}/>
             <TextInput placeholder = "Your email" onChangeText={(text) => this.setState({userEmail: text})}/>
             <TextInput placeholder = "Your contact number" onChangeText={(text) => this.setState({phoneNumber: text})}/>
             <Text style={styles.signupBotton} onPress={()=> this.execute()}>
              Create Account </Text>
             <Text style={[styles.signupBotton, styles.cancelBotton]} onPress={()=> _navigator.pop()}>
              Back </Text>
            </View>
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
    height: 60,
    backgroundColor: '#00aaf1',
  },
  textContainer: {
    margin: 10
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
