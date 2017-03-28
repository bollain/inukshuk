import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Button,
  Alert
} from 'react-native';
import {
  storageGet,
  storageMultiGet,
  storageRemove,
  storageMultiRemove,
  storageSet,
} from '../scripts/localStorage.js';
var nativeImageSource = require('nativeImageSource');

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

import Icon from 'react-native-vector-icons/MaterialIcons';

var { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// (Initial Static Location) Vancouver
const LATITUDE = 49.282729;
const LONGITUDE = -123.120738;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Location extends Component {

  constructor(props) {
    super(props);
    if (this.props.location != null) {
      this.state = {
        region: {
          latitude: JSON.parse(this.props.location).latitude,
          longitude: JSON.parse(this.props.location).longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        userPosition: null,
      };
    } else {
      this.state = {
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        userPosition: null,
      };
    }
    this.onRegionChange = this.onRegionChange.bind(this);
  }

 componentDidMount() {
   if (this.props.location == null) {
     navigator.geolocation.getCurrentPosition(
      (position) => {
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
    );
  }
 }

 onRegionChange(region) {
   this.setState({ region });
 };

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
   })
   .catch(error => console.log(error.message));  // error is a Javascript Error object
 }

  render() {
    console.log('rendering map');
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
            showsUserLocation={true}
          >
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.androidButtonContainer}
              onPress={() => this.openSearchModal()}
              activeOpacity={.9}
            >
              <Icon
                name="search"
                size={22}
                color="#666666"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.androidButtonContainer, styles.green]}
              onPress={() => this.set()}
              activeOpacity={.9}
            >
              <Icon
                name="check"
                size={22}
                color="white"
              />
            </TouchableOpacity>
        </View>
          <View style={styles.markerContainer}>
          <Icon
            name="location-on"
            size={36}
            color="#666666"
          />
          </View>
          <TouchableOpacity>
            <Text style={{ textAlign: 'center', margin: 6}}>
              {this.state.region.latitude.toFixed(6)}, {this.state.region.longitude.toFixed(6)}
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
    backgroundColor: 'white',
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
  buttonContainer: {
    flex: 1,
    height: height,
    justifyContent: 'flex-end',
    position:'absolute',
    right: 0,
    bottom: 0,
  },
  androidButtonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 15,
  },
  green: {
    backgroundColor: 'green',
  },
});
