import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';

var nativeImageSource = require('nativeImageSource');

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
    }
  }

  componentWillReceiveProps() {
    console.log('in receive props');
  }

  set() {
    Alert.alert('pressed submit');
    this.props.set('note', this.state.note)
    _navigator.pop();
  }

  remove() {
    Alert.alert('pressed remove');
    this.setState(note: null);
    this.props.remove('note');
    _navigator.pop();
  }

  render() {
    let textBox;
    // Display current note if it exists
    if (this.state.notes == null) {
      textBox = <TextInput
        // {...this.props}
        multiline={false}
        multiline={true}
        onChange={(event) => {
          this.setState({
            note: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height + 22,
          });
        }}
        style={{height: Math.max(35, this.state.height), backgroundColor: '#e6e6e6', fontSize: 16, paddingLeft: 20, paddingRight: 20 }}
        // onChangeText={(text) => this.setState({note: text})}
        underlineColorAndroid={'transparent'}
        autoFocus={true}
        placeholder={"What else should your contact know?"}
        // onSubmitEditing={() => this.props.set('note', event.nativeEvent.text)}
        autoCorrect={true}
      />
    }
    else {
      textBox = <TextInput
        // {...this.props}
        multiline={false}
        multiline={true}
        onChange={(event) => {
          this.setState({
            note: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height + 22,
          });
        }}
        style={{height: Math.max(35, this.state.height), backgroundColor: '#e6e6e6', fontSize: 16, paddingLeft: 20, paddingRight: 20 }}
        // onChangeText={(text) => this.setState({note: text})}
        underlineColorAndroid={'transparent'}
        autoFocus={true}
        // onSubmitEditing={() => this.props.set('note', event.nativeEvent.text)}
        defaultValue={this.props.note}
        autoCorrect={true}
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
