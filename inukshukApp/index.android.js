/**
 * Inukshuk Android Version
 * "Woot woot!"
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid,
} from 'react-native';
import TripSummary from './androidComponents/TripSummary'
import StartLocation from './androidComponents/StartLocation';
import EndLocation from './androidComponents/EndLocation';
import Contact from './androidComponents/Contact';
import Return from './androidComponents/Return';
import Note from './androidComponents/Note';
import Login from './androidComponents/Login';
import SignUp from './androidComponents/Signup';
import Start from './androidComponents/Start';
import User from './androidComponents/User';

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
          />
        );
      case 'startLocation':
        return (
          <StartLocation
            navigator={navigator}
            title="Start Location"
            location={route.startLocation}
            callback={route.callback}
          />
        );
      case 'endLocation':
        return (
          <EndLocation
            navigator={navigator}
            title="End Location"
            location={route.endLocation}
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
            callback={route.callback}
          />
        );
      case 'return':
        return (
          <Return
            navigator={navigator}
            title="Return"
            return={route.return}
            callback={route.callback}
          />
        );
      case 'note':
        return (
          <Note
            navigator={navigator}
            title="Note"
            note={route.note}
            callback={route.callback}
          />
        );
      case 'start':
        return (
          <Start
            navigator={navigator}
            title="Start"
            tripId={route.tripId}
            tripName={route.tripName}
            startLocation={route.startLocation}
            endLocation={route.endLocation}
            contact={route.contact}
            return={route.return}
            note={route.note}
            trip={route.trip}
            callback={route.callback}
          />
        );
      case 'user':
        return (
          <User
            navigator={navigator}
            title="Your Account"
            user={route.user}
            callback={route.callback}
          />
        );
    }
  }
}

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
