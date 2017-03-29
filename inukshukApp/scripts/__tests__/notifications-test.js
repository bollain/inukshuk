/**
 * Created by paul on 28/03/17.
 */
import 'react-native'
import React from 'react'
//jest.mock('../notifications');
var notifications = require('../notifications');
var tripEnd = "Reminder to end your trip if you have finished. Your emergency contact will be contacted in 30 minutes unless you end your trip.";



test('create end of trip notification', () => {
    var now = new Date(Date.now());
    var noti = notifications.createEndOfTripNotification(1,now);
    expect(noti).ToBeDefined();
});

test('cancel notification', () => {
    notifications.createEndOfTripNotification(1,new Date(Date.now()+40*1000));

    expect(notifications.cancelNotification(1)).ToBeDefined();
});

test('modify notification', () => {
    var now = new Date(Date.now()+40*1000);
    notifications.createEndOfTripNotification(1,now);

    now = new Date(Date.parse(now)+100+1000);
    expect(notifications.modifyNotification(1,now)).ToBeDefined();
});

test('create notification', () => {
    var now = new Date(Date.now()+140*1000);
    expect(notifications.createNotification(1,now,"hi")).ToBeDefined();
});

test('create immediate notification', () => {
    expect(notifications.immediateNotification("hi")).ToBeDefined();
});