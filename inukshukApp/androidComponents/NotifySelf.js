/**
 * Created by paul on 27/03/17.
 */
import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, ToolbarAndroid, StyleSheet, TextInput, AsyncStorage, Alert, Button, TouchableOpacity, ScrollView, DeviceEventEmitter } from 'react-native';

var PushNotification = require('react-native-push-notification');
export default class SelfNotification extends Component {

    tripEnd = "Reminder to end your trip if you have finished. Your emergency contact will be contacted in 30 minutes unless you end your trip.";
    changed = "Your changes to the trip have been successfully made.";
    canceled = "Your trip has been ended or canceled and your emergency contact has been sent an appropriate notification.";
    createdTrip = "Inukshuk will send you a notification 30 minutes before the entered end time of your trip";

    constructor(props) {
        super(props);
    }

    //creates a notification using the trip id and the trip return time
    createNotification(id, date) {
        PushNotification.localNotificationSchedule({
            id: id,
            message: tripEnd, // (required)
            date: new Date(date - (30 * 1000)),
            autoCancel: false,
        });
    }

    //cancels the notification and lets the user know that has happened
    cancelNotification(id){
        PushNotification.cancelLocalNotifications({id: id});
        this.immediateNotification(this.canceled);
    }

    //deletes the old notification, creates a new notification using the new end time
    modifyNotification(id, date){
        this.cancelNotification(id);
        this.createNotification(id,date, this.tripEnd);
        this.immediateNotification(this.changed);
    }

    //creates the notification for trip ending in 30 minutes and an immediate notification sayin it did that
    createEndOfTripNotification(id,date){
        this.createNotification(id,date,this.tripEnd);
        this.immediateNotification(this.createdTrip);
    }

    //probably not going to ever use because it seems like the android device automatically converts to/from UTC
    localDateTime(date){
        var localDate = new Date(date - (date.getTimezoneOffset()/60)*60000);
        localDate = new Date(localDate - (30 * 1000));
        return localDate;
    }

    //creates basically immediate notifications
    immediateNotification(message){
        var date = Date(Date.now() + (5 * 1000));
        PushNotification.localNotificationSchedule({
            message: message,
            date: date,
            autoCancel: false,
        });
    }

}