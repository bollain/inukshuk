import React, { Component, PropTypes } from 'react';
import { View, Text, InteractionManager } from 'react-native';

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
        let diff = this.getTimeRemaining(this.props.endDate);
        this.setState({timeLeft: diff});
      }, 1000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
  }

  render() {
    return(
      <Text>{this.state.timeLeft}</Text>
    );
  }
};
