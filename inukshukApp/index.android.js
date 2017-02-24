/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Navigator, TouchableHighlight, Text } from 'react-native';

import Map from './Map';

class inukshukApp extends Component {
  render() {
    return (
      <Navigator
        sceneStyle={{paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight}}
        initialRoute={{ title: 'Trip Summary', index: 0 }}
        renderScene={(route, navigator) =>
          <Map
            title={route.title}

            // Function to call when a new scene should be displayed
            onForward={() => {
              const nextIndex = route.index + 1;
              navigator.push({
                title: 'Scene ' + nextIndex,
                index: nextIndex,
              });
            }}

            // Function to call to go back to the previous scene
            onBack={() => {
              if (route.index > 0) {
                navigator.pop();
              }
            }}
          />
        }
        navigationBar={
         <Navigator.NavigationBar
           routeMapper={{
             LeftButton: (route, navigator, index, navState) =>
               {
                 if (route.index === 0) {
                   return null;
                 } else {
                   return (
                     <TouchableHighlight onPress={() => navigator.pop()}>
                       <Text>Back</Text>
                     </TouchableHighlight>
                   );
                 }
               },
             RightButton: (route, navigator, index, navState) =>
               { return (<Text>Done</Text>); },
             Title: (route, navigator, index, navState) =>
               { return (<Text>{route.title}</Text>); },
           }}
           style={{backgroundColor: 'gray'}}
         />
        }
      />
    );
  }
}

const styles = StyleSheet.create({});

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
