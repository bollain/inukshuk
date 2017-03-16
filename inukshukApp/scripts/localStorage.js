import { AsyncStorage, Alert } from 'react-native';

// Get a value from AsyncStorage
export async function storageGet(key) {
  try {
    const response = await AsyncStorage.getItem(key);
    console.log('get');
    return response;
  } catch (error) {
    Alert.alert('Error getting ' + key);
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
    Alert.alert('Error getting ' + keys);
    console.error(error);
  }
}

// Remove a value from AsyncStorage
export async function storageRemove(key) {
  try {
    await AsyncStorage.removeItem(key);
    console.log('remove');
  } catch (error) {
    Alert.alert('Error removing ' + key);
    console.error(error);
  }
}

// Get multiple values from AsyncStorage
export async function storageMultiRemove(keys) {
  try {
    await AsyncStorage.multiRemove(keys);
    console.log('multiremove');
  } catch (error) {
    Alert.alert('Error removing ' + keys);
    console.error(error);
  }
}

// Add a value to AsyncStorage
export async function storageSet(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('set');
  } catch (error) {
    Alert.alert('Error setting ' + key);
    console.error(error);
  }
}
