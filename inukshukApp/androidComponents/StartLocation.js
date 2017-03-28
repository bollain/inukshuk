import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid,
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';
import Location from './Location'

export default class extends Location {
  constructor(props) {
    super(props);
  }
  set() {
    storageSet('startLocation', JSON.stringify(this.state.region))
    .then(this.props.callback(JSON.stringify(this.state.region)))
    .then(_navigator.pop());
  }
  remove() {
    storageRemove('startLocation')
    .then(this.props.callback(null))
    .then(_navigator.pop());
  }
}
