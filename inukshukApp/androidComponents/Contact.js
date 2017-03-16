import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  ListView,
  Navigator,
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  Alert,
  ScrollView,
  TouchableHighlight,
  TextInput,
  Modal,
  ToolbarAndroid
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';

import Contacts from 'react-native-contacts';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var nativeImageSource = require('nativeImageSource');

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      dataSource: ds.cloneWithRows({
        contact: {
          firstName: 'firstName',
          middleName: 'middleName',
          lastName: 'lastName',
          emails: 'emails',
          phones: 'phones',
        }
      }),
      rawData: null,
      modalVisible: false,
      chosenContact: {
        firstName: 'firstName',
        middleName: 'middleName',
        lastName: 'lastName',
        emails: 'emails',
        phones: 'phones',
      },
      addressDataSource: ds.cloneWithRows(['Loading...']),
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

  set(address) {
    let chosenContact = JSON.stringify(this.state.chosenContact);
    storageSet('contact', chosenContact)
    .then(storageSet('contactAddress', address))
    .then(this.props.callback(chosenContact))
    .then(() => {
      this.setModalVisible(!this.state.modalVisible);
      _navigator.pop();
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
      let inFirst = entry.firstName != null && entry.firstName.toLowerCase().search(text) !== -1;
      let inMiddle = entry.middleName != null && entry.middleName.toLowerCase().search(text) !== -1;
      let inLast = entry.lastName != null && entry.lastName.toLowerCase().search(text) !== -1;
      return inFirst || inMiddle || inLast;
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  showContactChooser(contact) {
    let contactArray = new Array();
    for (i = 0; i < contact.emails.length ; i++){
      contactArray.push(contact.emails[i].email);
    }
    for (i = 0; i < contact.phones.length ; i++){
      contactArray.push(contact.phones[i].number);
    }
    this.setState({
      chosenContact: contact,
      addressDataSource: ds.cloneWithRows(contactArray),
    });
    this.setModalVisible(true);
  }

  formatName(first, middle, last) {
    first = (first == null ? "" : first);
    middle = (middle == null ? "" : " " + middle);
    last = (last == null ? "" : " " + last);
    return first + middle + last;
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
                  onPress={() => this.showContactChooser(rowData)}
                >
                  <View>
                    <Text style={styles.contactText}>{this.formatName(rowData.firstName,rowData.middleName,rowData.lastName)}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            }
          />
        </ScrollView>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{
           flex: 1,
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
           backgroundColor: 'rgba(0, 0, 0, 0.5)'
         }}>
          <View style={{
            width: 300,
            height: 400,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: 'white',
          }}>
            <View style={{padding:10, borderBottomColor: '#e6e6e6', borderBottomWidth: 1}}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                {this.formatName(this.state.chosenContact.firstName,this.state.chosenContact.middleName,this.state.chosenContact.lastName)}
              </Text>
            </View>

            <ListView
              dataSource={this.state.addressDataSource}
              renderRow={(rowData) =>
                <View>
                  <TouchableHighlight
                    style={styles.contact}
                    underlayColor='#e6e6e6'
                    onPress={() => {this.set(rowData)}}
                  >
                    <View>
                      <Text style={styles.contactText}>{rowData}</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              }
            />

            <View style={{padding:10}}>
              <TouchableHighlight
                onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text style={{fontSize: 16, textAlign: 'center'}}>Close</Text>
              </TouchableHighlight>
            </View>

          </View>
         </View>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  toolbar: {
    height: 60,
    backgroundColor: '#00aaf1',
  },
  contact: {
    padding: 15,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
  },
  contactText: {
    fontSize: 16,
  },
  search: {
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
  }
});
