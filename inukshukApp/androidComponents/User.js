import React, { Component, PropTypes } from 'react';
import { AppRegistry, ListView, Navigator, View, StyleSheet, Text, Button, Alert, TouchableHighlight, TextInput} from 'react-native';

export default class User extends Component {
    constructor(props){
      super(props);
      this.state = {
        user: {
          id: this.props.user._id,
          userName: this.props.user.userName,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName,
          email: this.props.user.email,
          phoneNumber: this.props.user.phoneNumber,
        }
      }
      this.set = this.set.bind(this);
      this.remove = this.remove.bind(this);
    }
    set() {
      this.props.set('user', this.state.user)
      .then(this.props.callback(this.state.user))
    }
    remove() {
      this.props.remove('user')
      .then(this.props.callback(null))
    }

    async setUser(responseJson) {
      await this.setState({userName: responseJson.userName})
      await this.setState({lastName: responseJson.lastName})
      await this.setState({email: responseJson.email})
      await this.setState({phoneNumber: responseJson.phoneNumber})
    }

    async setUserName(currentName) {
      await this.setState({userName: currentName});
    }

    async setFirstName(currentFirstName) {
      await this.setState({firstName: currentFirstName});
    }

    async setLastName(currentLastName) {
      await this.setState({lastName: currentLastName});
    }

    async setEmail(currentEmail) {
      await this.setState({email: currentEmail});
    }

    async setEmail(currentPhoneNumber) {
      await this.setState({phoneNumber: currentPhoneNumber});
    }

  render() {
    return(
      <View style = { {padding: 10}}>
         <Text style={styles.title}> User Profile </Text>
         <Text> Username </Text>
         <TextInput defaultValue={this.state.userName} onChangeText={(text) => this.setState(userName: text)}/>
         <Text> First Name </Text>
         <TextInput defaultValue={this.state.firstName} onChangeText={(text) => this.setState(firstName: text)}/>
         <Text> Last Name </Text>
         <TextInput defaultValue={this.state.lastName} onChangeText={(text) => this.setState(lastName: text)}/>
         <Text> Email </Text>
         <TextInput defaultValue={this.state.email} onChangeText={(text) => this.setState(email: text)}/>
         <Text> Contact Number </Text>
         <TextInput defaultValue={this.state.phoneNumber} onChangeText={(text) => this.setState(phoneNumber: text)}/>
         <Text style={styles.saveBotton} onPress={()=> this.set()}> Save </Text>
         <Text style={[styles.saveBotton, styles.backBotton]} onPress={()=> this.set()}> Back </Text>
      </View>
  )};
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  saveBotton: {
    fontSize: 18,
    padding: 10,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    alignSelf: 'stretch',

  },
  backBotton: {
    backgroundColor: 'gainsboro',
  }
});
