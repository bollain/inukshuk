/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Navigator, TouchableHighlight, Text, BackAndroid, AsyncStorage, Alert } from 'react-native';

import TripSummary from './TripSummary'
import Location from './Location';
import Contact from './Contact';
import Return from './Return';
import Note from './Note';

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
    this.state = {
      location: null,
      contact: null,
      return: null,
      note: null,
    };
    this.get('location').then((response) => this.setState({location: response}));
    this.get('contact').then((response) => this.setState({location: response}));
    this.get('return').then((response) => this.setState({location: response}));
    this.get('note').then((response) => this.setState({location: response}));
    this.navigatorRenderScene = this.navigatorRenderScene.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.set = this.set.bind(this);
    console.log('rebuilt');
  }

  async get(key) {
    try {
      let response;
      await AsyncStorage.getItem(key).then((value) => response = value);
      return response;
      console.log('get');
    } catch (error) {
      Alert.alert('Error getting ' + key);
      console.error(error);
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      this.setState({key: null});
      console.log('remove');
    } catch (error) {
      Alert.alert('Error removing ' + key);
      console.error(error);
    }
  }

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      this.setState({key: value});
      console.log('set');
    } catch (error) {
      Alert.alert('Error setting ' + key);
      console.error(error);
    }
  }

  render() {
    return (
      <Navigator
        // style={styles.container}
        initialRoute={{id: 'tripSummary', title:'Summary'}}
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
            location={this.state.location}
            contact={this.state.contact}
            return={this.state.return}
            note={this.state.note}
          />
        );
      case 'location':
        return (
          <Location
            navigator={navigator}
            title="Location"
            location={this.state.location}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
          />
        );
      case 'contact':
        return (
          <Contact
            navigator={navigator}
            title="Contact"
            contact={this.state.contact}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
          />
        );
      case 'return':
        return (
          <Return
            navigator={navigator}
            title="Return"
            return={this.state.return}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
          />
        );
      case 'note':
        return (
          <Note
            navigator={navigator}
            title="Note"
            note={this.state.note}
            set={this.set.bind(this)}
            remove={this.remove.bind(this)}
          />
        );
    }
  }
}

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
