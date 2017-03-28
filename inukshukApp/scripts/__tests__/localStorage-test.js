import { AsyncStorage, Alert } from 'react-native';
import { mock, release } from 'mock-async-storage'
import React from 'react';
var localStorage = require('../localStorage');
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

mock();

it('renders correctly', () => {
    const tree = renderer.create(
        <Index />
    );
});
test('Mock Async Storage working', async () => {

    await localStorage.storageSet('myKey', 'myValue');
    const value = await localStorage.storageGet('myKey');
    expect(value).toBe('myValue');
    await localStorage.storageRemove('myKey');
    expect(await localStorage.storageGet('myKey')).toBeUndefined();


});

test('Mock Async Storage working Multi', async () => {

    await localStorage.storageSet('1', 'a');
    await localStorage.storageSet('2', 'b');
    const value = await localStorage.storageMultiGet(['1','2']);
    expect(value).toBe(['a','b']);
    await localStorage.storageRemove('1');
    expect(await localStorage.storageGet('1')).toBeUndefined();


});



release();



