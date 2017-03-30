/**
 * Inukshuk Android Version
 * "Woot woot!"
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid,
  Alert,
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

// Add a listener for the android back button
BackAndroid.addEventListener('hardwareBackPress', () => {
  let routes = _navigator.getCurrentRoutes();
  let thisRoute = routes[routes.length-1];
  if (routes.length === 1  ) {
     return false;
  }
  // Disable back button if you on start page (get message) or
  // tripSummary page (will exit app)
  if (thisRoute.id === 'start') {
    Alert.alert(
      'You can\'t do that',
      'Please complete or cancel your trip to go back',
    );
    return true;
  } else if (thisRoute.id === 'tripSummary') {
    Alert.alert(
      'You can\'t do that',
      'Please log out to go back',
    );
    return true;
  }
  else {
    _navigator.pop();
    return true;
  }
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
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.PushFromRight,
          gestures: route.gestures
        })}
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
            setContact={route.setContact}
            setContactAddress={route.setContactAddress}
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
            tripName={route.tripName}
            startLocation={route.startLocation}
            endLocation={route.endLocation}
            contact={route.contact}
            return={route.return}
            note={route.note}
            trip={route.trip}
            callback={route.callback}
            configureScene={() => configureScene(route)}
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
