import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TouchableOpacity, Dimensions, Image, Button, Alert } from 'react-native';

var nativeImageSource = require('nativeImageSource');

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

var { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// (Initial Static Location) Mumbai
const LATITUDE = 19.0760;
const LONGITUDE = 72.8777;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Location extends Component {

  constructor(props) {
    super(props);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.centerLocation = this.centerLocation.bind(this);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      initialRegion: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }

 componentDidMount() {
   navigator.geolocation.getCurrentPosition(
     (position) => {
       this.setState({
         initialRegion: {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           latitudeDelta: LATITUDE_DELTA,
           longitudeDelta: LONGITUDE_DELTA,
         },
       });
     },
     (error) => alert(JSON.stringify(error)),
     {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
   );
   this.watchID = navigator.geolocation.watchPosition((position) => {
     this.setState({
       region: {
         latitude: position.coords.latitude,
         longitude: position.coords.longitude,
         latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA,
       },
     });
   });
 }

 componentWillUnmount() {
   navigator.geolocation.clearWatch(this.watchID);
 }

 onRegionChange(region) {
   this.setState({ region });
 };

 centerLocation() {
   navigator.geolocation.getCurrentPosition(
     (position) => {
       console.log(position);
       this.setState({
         region: {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           latitudeDelta: LATITUDE_DELTA,
           longitudeDelta: LONGITUDE_DELTA,
         },
       });
     },
     (error) => alert(JSON.stringify(error)),
     {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
   );
 }

  openSearchModal() {
  RNGooglePlaces.openAutocompleteModal()
   .then((place) => {
     this.setState({
       region: {
         latitude: place.latitude,
         longitude: place.longitude,
         latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA,
       },
     })
       // console.log(place);
       // console.log(this.state.region);
   })
   .catch(error => console.log(error.message));  // error is a Javascript Error object
 }

  render() {
    var { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
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
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
          >
          </MapView>
          <TouchableOpacity
            style={styles.buttonContainer}
          >
            <Button
              style={styles.button}
              onPress={this.centerLocation}
              title="Center"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              style={styles.button}
              onPress={() => this.openSearchModal()}
              title="Search"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              style={styles.button}
              onPress={() => Alert.alert('Submited ' + this.state.region.latitude.toPrecision(7) + ", " + this.state.region.longitude.toPrecision(7))}
              title="Submit"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
        </TouchableOpacity>
          <View style={styles.markerContainer}>
            <Image style={styles.marker} source={require('./marker.png')} />
          </View>
          <TouchableOpacity>
            <Text style={{ textAlign: 'center'}}>
              {this.state.region.latitude.toPrecision(7)}, {this.state.region.longitude.toPrecision(7)}
            </Text>
          </TouchableOpacity>
        </View>
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
   mapContainer: {
     flex: 1,
   },
   map: {
     ...StyleSheet.absoluteFillObject,
   },
   markerContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   marker: {
     width: 25,
     height: 40,
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
});
