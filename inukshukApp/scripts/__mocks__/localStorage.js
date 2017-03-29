/**
 * Created by paul on 28/03/17.
 */


import {AsyncStorage} from 'react-native';
// Get a value from AsyncStorage
export async function storageGet(key) {
    try {
        const response = await AsyncStorage.getItem(key);
        console.log('get');
        return response;
    } catch (error) {

        console.error(error);
    }
}

// Get multiple values from AsyncStorage
export async function storageMultiGet(keys) {
    try {
        const response = await AsyncStorage.multiGet(keys);
        console.log('multiget');
        return response;
    } catch (error) {

        console.error(error);
    }
}

// Remove a value from AsyncStorage
export async function storageRemove(key) {
    try {
        await AsyncStorage.removeItem(key);
        console.log('remove');
    } catch (error) {

        console.error(error);
    }
}

// Get multiple values from AsyncStorage
export async function storageMultiRemove(keys) {
    try {
        await AsyncStorage.multiRemove(keys);
        console.log('multiremove');
    } catch (error) {

        console.error(error);
    }
}

// Add a value to AsyncStorage
export async function storageSet(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
        console.log('set');
    } catch (error) {

        console.error(error);
    }
}
release();
