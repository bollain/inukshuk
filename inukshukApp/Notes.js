import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert } from 'react-native';

var nativeImageSource = require('nativeImageSource');

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  async saveNote() {
    try {
      await AsyncStorage.setItem('@MySuperStore:note', '{this.state.text}');
    } catch (error) {
      Alert.alert('Error saving note')
    }
    _navigator.pop();
  }

  render() {
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
        <TextInput
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
          onSubmitEditing={this.saveNote}
        />
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
