import React, { Component, PropTypes } from 'react';
import { View, Text, InteractionManager } from 'react-native';
import { getTimeRemaining } from '../scripts/datesAndTimes.js'

export default class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: '...',
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.timer = setInterval(() => {
        let diff = getTimeRemaining(this.props.endDate);
        this.setState({timeLeft: diff});
      }, 1000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return(
      <Text>{this.state.timeLeft}</Text>
    );
  }
};
