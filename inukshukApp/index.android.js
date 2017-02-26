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

import SignUp from './android/app/src/main/scripts/signup';

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
            backgroundColor: '#A2E8A9',
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
            <Text style={styles.subTitle}>
                Don't have an account? Sign in with Google
            </Text>
            <TouchableHighlight>
                <Text style={styles.subTitle} onPress={()=> this._navSignUp()}>
                    Or create your own account now
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
  backgroundColor: {
    color: '#A2E8A9'
  },
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 40,
  },
  subTitle: {
    fontSize: 14,
  },
  textColored: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
AppRegistry.registerComponent('login', () => login);
