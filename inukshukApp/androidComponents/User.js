import React, { Component, PropTypes } from 'react';
import { AppRegistry, ListView, Navigator, View, StyleSheet, Text, Button, Alert, TouchableHighlight, TextInput, ToolbarAndroid} from 'react-native';

var nativeImageSource = require('nativeImageSource');

var localIp = '192.168.1.73';

export default class User extends Component {
  constructor(props){
    super(props);
    console.log(this.props.user);
    let jsonUser = JSON.parse(this.props.user);
    console.log(jsonUser);
    this.state = {
      id: jsonUser._id,
      userName: jsonUser.userName,
      firstName: jsonUser.firstName,
      lastName: jsonUser.lastName,
      email: jsonUser.email,
      phoneNumber: jsonUser.phoneNumber,
    }
    this.set = this.set.bind(this);
  }

  /**
  * updating user account from profile page
  * only email and phone number can be updated by design
  **/
  set() {
    this.props.set('user', JSON.stringify(this.state.user))
    .then(
      fetch('http://' + localIp + ':8080/users', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: this.state.id,
            userName: "",
            firstName: "",
            lastName: "",
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
        })
      })
      .then(handleErrors)
      .then(() => {
        Alert.alert(
          'Success!',
          'Your account has been updated',
          [
            {text: 'OK', onPress: () => _navigator.push({id: 'tripSummary', user: this.state.user})},
          ],
          { cancelable: false }
        )
      })
      .catch(function(error) {
         Alert.alert(
           'Error', error.message,
           [
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false })
       }))
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
      <View style = {styles.container}>
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
           <Text style={styles.subTitle}> Username </Text>
           <Text style={styles.field}> {this.state.userName}</Text>
           <Text style={styles.subTitle}> First Name </Text>
           <Text style={styles.field}> {this.state.firstName}</Text>
           <Text style={styles.subTitle}> Last Name </Text>
           <Text style={styles.field}> {this.state.lastName}</Text>
           <Text style={styles.subTitle}> Email</Text>
           <TextInput style={{fontSize: 16}}
                      defaultValue={this.state.email}
                      onChangeText={(text) => this.setState({email: text})}/>
           <Text style={styles.subTitle}> Contact Number</Text>
           <TextInput style={{fontSize: 16}}
                      defaultValue={this.state.phoneNumber}
                      onChangeText={(text) => this.setState({phoneNumber: text})}/>
           <Text style={styles.saveBotton} onPress={()=> this.set()}> Save </Text>
         </View>
      </View>
  )};
}

function handleErrors(response) {
  if (!response.ok) {
    console.log(response.status)
    throw Error ('Invalid user credential, or user not found')
  }
}

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
    margin: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 4,
    marginTop: 10,
  },
  field: {
    fontSize: 18,
    color: 'black',
  },
  saveBotton: {
    fontSize: 18,
    padding: 10,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    alignSelf: 'stretch',
    color: 'white',
    textAlign: 'center',
  },
});
