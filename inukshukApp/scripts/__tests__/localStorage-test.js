import 'react-native';
import {Alert} from 'react-native';
import { mock, release } from 'mock-async-storage'
import React from 'react';

mock();
var localStorage = require('../localStorage');
jest.mock('react-native', () => ({
    AsyncStorage: {
        setItem: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }),
        multiSet:  jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }),
        getItem: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve("hi");
            });
        }),
        multiGet: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(['a','b']);
            });
        }),
        removeItem: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }),
        getAllKeys: jest.fn(() => {
            return new Promise((resolve) => {
                resolve(['1', '2']);
            });
        }),
        multiRemove: jest.fn(() => {
            return new Promise((resolve) => {
                resolve(null);
            });
        })
    }
}));
test('Mock Async Storage working', async () => {

    await localStorage.storageSet('myKey', 'myValue');
    const value = await localStorage.storageGet('myKey');
    expect(value).toMatch('hi');
    await localStorage.storageRemove('myKey');
    expect(await localStorage.storageMultiRemove(['1','2'])).not.toBeDefined();
});

test('Mock Async Storage working Multi', async () => {

    await localStorage.storageSet('1', 'a');
    await localStorage.storageSet('2', 'b');
    const value = await localStorage.storageMultiGet(['1','2']);
    expect(value).toMatchObject(['a','b']);
    await localStorage.storageRemove('1');


});


release();






