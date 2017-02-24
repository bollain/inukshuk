import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet } from 'react-native';

var nativeImageSource = require('nativeImageSource');

export default class Contacts extends Component {
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
        <Text>
          Contacts
        </Text>
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
