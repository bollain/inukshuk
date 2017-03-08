import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';

var nativeImageSource = require('nativeImageSource');
import countdown from 'countdown';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: null,
    }
    // this.set = this.set.bind(this);
    // this.remove = this.remove.bind(this);
    // this.tick = this.tick.bind(this);

  }
  componentDidMount() {
    // timer.setInterval(this, 'tick', this.tick, 1000);
    // var countd = countdown.countdown( new Date(2000, 0, 1) ).toString();
    console.log(countdown);
  }
  componentWillUnmount() {
    // timer.clearInterval(this);
  }
  // tick() {
  //   timer.requestAnimationFrame(this, 'tick', () => {
  //     if (this.state.counter >= 10) return;
  //     this.setState({counter: this.state.counter + 1});
  //   });
  // }

  // set() {
  //   this.props.set('return', this.state.return)
  //   .then(this.props.callback(this.state.return))
  //   .then(_navigator.pop());
  // }
  // remove() {
  //   this.props.remove('return')
  //   .then(this.props.callback(null))
  //   .then(_navigator.pop());
  // }

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.toolbar}
                        title={this.props.title}
                        navIcon={nativeImageSource({
                          android: 'ic_arrow_back_white_24dp',
                          width: 64,
                          height: 64
                        })}
                        onIconClicked={this.props.navigator.pop}
                        titleColor={'#FFFFFF'}/>
        <View style={styles.textContainer}>
          <Text>You told {this.props.contact.firstName} that you would be back from {this.props.location.latitude},{this.props.location.longitude} by {this.props.return.month}</Text>
          <Text>Seconds Remaining: {this.state.counter}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={console.log('hello')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => console.log('press')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Add Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => console.log('press')}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
   container: {
     ...StyleSheet.absoluteFillObject,
     justifyContent: 'flex-start',
     alignItems: 'stretch',
   },
   toolbar: {
     height: 60,
     backgroundColor: '#00aaf1',
   },
   textContainer: {
     justifyContent: 'flex-start',
   },
   buttonContainer: {
     marginTop: 10,
     flexDirection: 'row',
     justifyContent: 'center',
   },
   submit: {
     backgroundColor: 'green',
     padding: 18,
   },
   remove: {
     backgroundColor: 'red',
     padding: 18,
   },
   buttonText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     textAlign: 'center'
   }
});
