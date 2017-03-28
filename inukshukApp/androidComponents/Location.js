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
      };
    } else {
      this.state = {
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
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
          >
          </MapView>
          <View style={styles.buttonContainerTop}>
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
              style={[styles.androidButtonContainer, styles.blue]}
              onPress={() => this.centerLocation()}
              activeOpacity={.9}
            >
              <Icon
                name="gps-fixed"
                size={22}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainerBottom}>
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
            <Image style={styles.marker} source={require('../assets/marker.png')} />
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
  marker: {
    width: 25,
    height: 40,
  },
  buttonContainerTop: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position:'absolute',
    padding: 10,
  },
  buttonContainerBottom: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position:'absolute',
    padding: 10,
    bottom: 0,
  },
  androidButtonContainer: {
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor: 'white',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  green: {
    backgroundColor: 'green',
  },
  blue: {
    backgroundColor: '#00aaf1',
  }
});
