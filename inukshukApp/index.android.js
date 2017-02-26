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
        // style={styles.container}
        initialRoute={{id: 'tripSummary'}}
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
            get={this.get.bind(this)}
          />
        );
      case 'location':
        // console.log({route.location});
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
      case 'contact':
        return (
          <Contact
            navigator={navigator}
            title="Contact"
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
    }
  }
}

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
