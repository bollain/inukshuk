/**
 * Created by paul on 28/03/17.
 */
import 'react-native'
import React from 'react'

var notifications = require('../notifications');

jest.mock('react-native-push-notification', () => ({
    PushNotification: {
        cancelLocalNotifications: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }),
        localNotificationSchedule:  jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        })
    }
}));

test('create end of trip notification', () => {
    var now = new Date(Date.now());
    expect(notifications.createEndOfTripNotification(1,now)).toBeTruthy();
});

test('cancel notification', () => {
    notifications.createEndOfTripNotification(1,new Date(Date.now()+40*1000));
    expect(notifications.cancelNotification(1)).toBe(null);
});

test('modify notification', () => {
    var now = new Date(Date.now()+40*1000);
    notifications.createEndOfTripNotification(1,now);
    now = new Date(Date.parse(now)+100+1000);
    expect(notifications.modifyNotification(1,now)).toBeTruthy();
});

test('create notification', () => {
    var now = new Date(Date.now()+140*1000);
    expect(notifications.createNotification(1,now,"hi")).toBeTruthy();
});

test('create immediate notification', () => {
    expect(notifications.immediateNotification("hi")).toBeTruthy();
});