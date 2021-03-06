import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  TextInput,
  AsyncStorage,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';

var nativeImageSource = require('nativeImageSource');

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: this.props.note,
    }
    this.set = this.set.bind(this);
    this.remove = this.remove.bind(this);
  }

  set() {
    storageSet('note', this.state.note)
    .then(this.props.callback(this.state.note))
    .then(_navigator.pop());
  }

  remove() {
    storageRemove('note')
    .then(this.props.callback(null))
    .then(_navigator.pop());
  }

  render() {
    console.log('rendering notes');
    let textBox;
    // Display current note if it exists
    if (this.state.note == null) {
      textBox = <TextInput
        multiline={false}
        multiline={true}
        onChange={(event) => {
          this.setState({
            note: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height + 22,
          });
        }}
        style={{
          height: Math.max(35, this.state.height),
          backgroundColor: '#e6e6e6',
          fontSize: 16,
          paddingLeft: 16,
          paddingRight: 16,
          margin: 10,
          borderRadius: 5,
        }}
        // onChangeText={(text) => this.setState({note: text})}
        underlineColorAndroid={'transparent'}
        autoFocus={true}
        placeholder={"What else should your contact know?"}
        // onSubmitEditing={() => this.props.set('note', event.nativeEvent.text)}
        autoCorrect={true}
        autoCapitalize={'sentences'}
      />
    }
    else {
      textBox = <TextInput
        multiline={false}
        multiline={true}
        onChange={(event) => {
          this.setState({
            note: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height + 22,
          });
        }}
        style={{
          height: Math.max(35, this.state.height),
          backgroundColor: '#e6e6e6',
          fontSize: 16,
          paddingLeft: 16,
          paddingRight: 16,
          margin: 10,
          borderRadius: 5,
        }}
        // onChangeText={(text) => this.setState({note: text})}
        underlineColorAndroid={'transparent'}
        autoFocus={true}
        // onSubmitEditing={() => this.props.set('note', event.nativeEvent.text)}
        defaultValue={this.state.note}
        autoCorrect={true}
        autoCapitalize={'sentences'}
      />
    }

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
          <ScrollView>
            {textBox}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={() => this.set()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => this.remove()}
              activeOpacity={.8}>
              <Text style={styles.buttonText}>Clear</Text>
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
     backgroundColor: 'white',
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
