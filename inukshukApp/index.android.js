/**
 * Inukshuk Android Version
 * "Woot woot!"
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Navigator, TouchableHighlight, Text, BackAndroid, AsyncStorage, Alert } from 'react-native';

import TripSummary from './androidComponents/TripSummary'
import Location from './androidComponents/Location';
import Contact from './androidComponents/Contact';
import Return from './androidComponents/Return';
import Note from './androidComponents/Note';
import Login from './androidComponents/Login';
import SignUp from './androidComponents/Signup';


BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

class inukshukApp extends Component {
  constructor(props) {
    super(props);
    this.navigatorRenderScene = this.navigatorRenderScene.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.set = this.set.bind(this);
  }

  async get(key) {
    try {
      const response = await AsyncStorage.getItem(key);
      console.log('get');
      return response;
    } catch (error) {
      Alert.alert('Error getting ' + key);
      console.error(error);
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log('remove');
    } catch (error) {
      Alert.alert('Error removing ' + key);
      console.error(error);
    }
  }

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('set');
    } catch (error) {
      Alert.alert('Error setting ' + key);
      console.error(error);
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{id: 'login'}}
        renderScene={this.navigatorRenderScene}
      />
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'tripSummary':
        return (
          <TripSummary
            navigator={navigator}
            title="Summary"
            user={route.user}
            get={this.get.bind(this)}
            set={this.set.bind(this)}
          />
        );
      case 'location':
        return (
          <Location
            navigator={navigator}
            title="Location"
            location={route.location}
            get={this.get.bind(this)}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
            callback={route.callback}
          />
        );
      case 'login':
        return (
        <Login
          navigator={navigator}
          title="Log in"
          callback={route.callback}
          />
        );
      case 'signup':
        return (
          <SignUp
            navigator={navigator}
            title="Sign Up"
            callback={route.callback}
          />
      );
      case 'contact':
        return (
          <Contact
            navigator={navigator}
            title="Contact"
            contact={route.contact}
            get={this.get.bind(this)}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
            callback={route.callback}
          />
        );
      case 'return':
        return (
          <Return
            navigator={navigator}
            title="Return"
            return={route.return}
            get={this.get.bind(this)}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
            callback={route.callback}
          />
        );
      case 'note':
        return (
          <Note
            navigator={navigator}
            title="Note"
            note={route.note}
            get={this.get}
            set={this.set}
            remove={this.remove}
            callback={route.callback}
          />
        );
      case 'user':
        return (
          <User
            navigator={navigator}
            title="Your Account"
            user={route.user}
            get={this.get}
            set={this.set}
            callback={route.callback}
          />
        );
    }
  }
}

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
