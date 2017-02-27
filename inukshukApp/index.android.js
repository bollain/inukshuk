/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

import SignUp from './Signup';

export default class inukshukApp extends Component {
    render() {
        return (
            <Navigator
              style={{ flex:1 }}
              initialRoute={{ name: 'Login' }}
              renderScene={ this.renderScene }
           />
        )
     }
     renderScene(route, navigator) {
        if(route.name == 'Login') {
          return (<LoginPage navigator={navigator} title="login" />);
        }
        if(route.name == 'Signup') {
          return (<SignUp navigator={navigator} title="signup"/>);
        }
     }
}

class LoginPage extends Component {
    _navSignUp(){
        this.props.navigator.push({
            name: 'Signup'
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
            <Text style = {styles.button}>
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

function loggedIn() {
    // TODO: add login functionality

}

function requireAuth(nextState, replace) {
    if (!loggedIn())
    {
        replace({pathname: '/login'
        })
    }
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

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
AppRegistry.registerComponent('login', () => login);
