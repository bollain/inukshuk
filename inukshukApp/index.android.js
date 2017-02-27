/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, ListView, Navigator, View, StyleSheet, TouchableOpacity, Text, PropTypes, Dimensions, Image, Button, Alert, ScrollView, TouchableHighlight, TextInput } from 'react-native';

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import Contacts from 'react-native-contacts';

var contacttest = [];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class inukshukApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      dataSource: ds.cloneWithRows({
        contact: {
          firstName: 'firstName',
          lastName: 'lastName',
          emails: 'emails',
          phones: 'phones',
        }
      }),
      rawData: null,
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
          newState[i] = {
            firstName: contacts[i].givenName,
            middleName: contacts[i].middleName,
            lastName: contacts[i].familyName,
            emails: contacts[i].emailAddresses,
            phones: contacts[i].phoneNumbers,
          }
        }
        console.log(newState);
        this.setState({
          dataSource: ds.cloneWithRows(newState),
          rawData: newState,
        });
      }
    });
  }

  searchContacts(event) {
    console.log(JSON.stringify(this.state.rawData));
    let searchText = event.nativeEvent.text;
    this.setState({searchText});
    let filteredContacts = this.filterContacts(searchText, JSON.stringify(this.state.rawData));
    console.log(filteredContacts);
    this.setState({
      dataSource: ds.cloneWithRows(filteredContacts),
    });
  }

  filterContacts(searchText, contacts) {
    console.log(contacts);
    let text = searchText.toLowerCase();
    return JSON.parse(contacts).filter((entry) => {
      return entry.firstName.toLowerCase().search(text) !== -1;
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <TextInput
         style={styles.search}
         value={this.state.searchText}
         onChange={this.searchContacts.bind(this)}
         placeholder="Search"
      />
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View>
                <TouchableHighlight
                  style={styles.contact}
                  underlayColor='#e6e6e6'
                  onPress={() => console.log(rowData)}
                >
                  <View>
                    <Text style={styles.contactText}>{[rowData.firstName,rowData.middleName,rowData.lastName].join(" ")}</Text>
                  </View>
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  contact: {
    padding: 15,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
  },
  contactText: {
    fontSize: 16,
  }
});

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
