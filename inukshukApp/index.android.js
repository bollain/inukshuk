/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, ListView, Navigator, View, StyleSheet, TouchableOpacity, Text, PropTypes, Dimensions, Image, Button, Alert, ScrollView, TouchableHighlight } from 'react-native';

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import Contacts from 'react-native-contacts';

var contacttest = [];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class inukshukApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows(['Loading...']),
    };
  }

  componentDidMount() {
    this.getContacts().then(console.log('mounted contacts'));
  }

  async getContacts() {
    await Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        console.error(err);
      } else {
        console.log(contacts);
        let newState = [];
        for (i = 0; i < contacts.length; i++) {
          newState[i] = contacts[i].givenName + " " + contacts[i].familyName;
        }
        console.log(newState);
        this.setState({
          dataSource: ds.cloneWithRows(newState),
        });
      }
    });
  }
  //
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View>
                <TouchableHighlight
                  style={styles.contact}
                  underlayColor='blue'
                  onPress={() => console.log(rowData)}
                >
                  <Text>{rowData}</Text>
                </TouchableHighlight>
              </View>
            }
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
});

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
