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
    render() {
        return (
        <View>
           <Text style={styles.welcome}>
                you are at the signup page
            </Text>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});