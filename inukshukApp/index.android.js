/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, Navigator, View, StyleSheet, TouchableOpacity, Text, PropTypes, Dimensions, Image, Button, Alert } from 'react-native';

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';


var { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// (Initial Static Location) Mumbai
const LATITUDE = 19.0760;
const LONGITUDE = 72.8777;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var Contacts = require('react-native-contacts');
class inukshukApp extends Component {

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
    //
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
    getContacts()
    {

        Contacts.getAll((err, contacts) => {
            if(err && err.type === 'permissionDenied'){
                // x.x
            } else {
                var contact1 = contacts[2];
                console.log(contact1.givenName);
            }
        })
    }
    //
    render() {
        return (
            <View style={styles.container}>
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
                    <Button
                        style={styles.button}
                        onPress={() => this.getContacts()}
                        title="Contacts"
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
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
        position: 'absolute',
        left: -12.5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

AppRegistry.registerComponent('inukshukApp', () => inukshukApp);
