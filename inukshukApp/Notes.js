import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert } from 'react-native';

var nativeImageSource = require('nativeImageSource');

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {note: null};
  }

  componentDidMount() {
    this.getNote().then((value) => this.setState({note: value}));
  }

  async getNote() {
    try {
      let returnValue;
      await AsyncStorage.getItem('note').then((value) => returnValue = value);
      return returnValue;
    } catch (error) {
      Alert.alert('Error retrieving note');
    }
  }

  async saveNote(value) {
    try {
      await AsyncStorage.setItem('note', value);
      console.log(value);
    } catch (error) {
      Alert.alert('Save error');
      console.error(error);
    }
    _navigator.pop();
  }

  render() {
    note = this.getNote();
    let textBox;
    if (note == null) {
      textBox = <TextInput
        {...this.props}
        multiline={false}
        // multiline={true}
        onChange={(event) => {
          this.setState({
            text: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height + 22,
          });
        }}
        style={{height: Math.max(35, this.state.height), backgroundColor: '#e6e6e6', fontSize: 16, paddingLeft: 20, paddingRight: 20 }}
        // onChangeText={(text) => this.setState({text})}
        underlineColorAndroid={'transparent'}
        autoFocus={true}
        placeholder={"What else should your contact know?"}
        onSubmitEditing={(event) => this.saveNote(event.nativeEvent.text)}
        autoCorrect={true}
      />
    }
    else {
      textBox = <TextInput
      {...this.props}
      multiline={false}
      // multiline={true}
      onChange={(event) => {
        this.setState({
          text: event.nativeEvent.text,
          height: event.nativeEvent.contentSize.height + 22,
        });
      }}
      style={{height: Math.max(35, this.state.height), backgroundColor: '#e6e6e6', fontSize: 16, paddingLeft: 20, paddingRight: 20 }}
      // onChangeText={(text) => this.setState({text})}
      underlineColorAndroid={'transparent'}
      autoFocus={true}
      onSubmitEditing={(event) => this.saveNote(event.nativeEvent.text)}
      defaultValue={this.state.note}
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
        {textBox}
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
});
