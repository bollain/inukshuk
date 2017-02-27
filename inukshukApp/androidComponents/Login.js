
/** The splash login page **/
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Navigator,
  TouchableHighlight
} from 'react-native';

export default class Login extends Component {
    _navSignUp(){
        this.props.navigator.push({
            id: 'signup'
        })
    }
    render() {
        let logoImg =
            { uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS7z5gcSo96ms9T8Hy6x7Zm2dzYXpGMQaOpecvQORG1p78VYpxBxg'
            };
        return (
        <View style = {{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
            }}>
            <Image
                source={logoImg} style={{width: 193, height: 110, paddingBottom: 50}}/>
            <TextInput
              style={styles.textContainer}
              placeholder="Email"
              onChangeText={(text) => this.setState({text})}
            />
            <TextInput
              style={styles.textContainer}
              placeholder="Password"
              onChangeText={(text) => this.setState({text})}
            />
            <Text style = {styles.button} onPress={()=> this.props.navigator.push({id: 'tripSummary'})}>
                LOGIN
            </Text>
            <TouchableHighlight>
                <Text style={[styles.button, styles.createAccount]} onPress={()=> this._navSignUp()}>
                    Don't have an account? Create one now
                 </Text>
            </TouchableHighlight>
        </View> );
    }
}

function isLoggedIn() {
    return  false;
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 40,
  },
  textColored: {
    color: 'white',
  },
  button: {
    fontSize: 18,
    backgroundColor: 'yellowgreen',
    borderRadius: 5,
    margin: 9,
    padding: 10,
    alignSelf: 'stretch',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 8,
  },
  createAccount: {
    fontSize: 14,
    backgroundColor: '#1e90ff',
  },
});