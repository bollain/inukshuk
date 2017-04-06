/**
 * Created by paul on 26/03/17.
 */
import 'react-native'
import React from 'react'

var datesAndTimes = require('../datesAndTimes');

test('Convert to Month', () => {
    expect(datesAndTimes.toMonth(3,false)).toMatch("April");
});

test('Convert to Month short', () => {
    expect(datesAndTimes.toMonth(5,true)).toMatch("Jun");
});

test('Convert to weekday', () => {
    expect(datesAndTimes.toWeekday(1,false)).toMatch("Monday");
});

test('Convert to weekday short', () => {
    expect(datesAndTimes.toWeekday(2,true)).toMatch("Tue");
});

test('Pad Time', () => {
    expect(datesAndTimes.padTime(4)).toMatch("04");
});

test('Pad time long', () => {
    expect(datesAndTimes.padTime(11)).toMatch("11");
});

test('Convert to time - Morning', () => {
    expect(datesAndTimes.toTwentyFour("11:25 AM")).toEqual([11,25]);
});

test('Convert to time - Afternoon', () => {
    expect(datesAndTimes.toTwentyFour("02:25 PM")).toEqual([14,25]);
});

test('extra time', () => {
    expect(datesAndTimes.isInFutureByXMins(new Date(Date.now()+ (10*60000)), 1)).toBeTruthy();

});

test('get remaining time after end', () => {
    expect(datesAndTimes.getTimeRemaining(new Date(Date.now()-(100*60000)))).toMatch("0d 0h 0m 0s");
});

test('get remaining time after', () => {
    expect(datesAndTimes.getTimeRemaining(new Date(Date.now()+(10*60000)))).toMatch("0d 0h 10m 0s");
});