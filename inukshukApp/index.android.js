/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Navigator, TouchableHighlight, Text } from 'react-native';

import TripSummary from './TripSummary'
import Location from './Location';
import Contacts from './Contacts';
import Return from './Return';
import Notes from './Notes';

class inukshukApp extends Component {
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
        return (<TripSummary navigator={navigator} title="Summary"/>);
      case 'location':
        return (<Location navigator={navigator} title="Location" />);
      case 'contacts':
        return (<Contacts navigator={navigator} title="Contacts" />);
      case 'return':
        return (<Return navigator={navigator} title="Return" />);
      case 'notes':
        return (<Notes navigator={navigator} title="Notes" />);
    }
  }
}

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
