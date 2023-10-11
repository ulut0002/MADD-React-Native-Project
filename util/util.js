import AsyncStorage from "@react-native-async-storage/async-storage";

// Stores given key/value pair in Async Storage
const storeData = (key, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      value = JSON.stringify(value);
      await AsyncStorage.setItem(key, value);
      resolve();
    } catch (error) {
      reject(error || "Error saving data");
    }
  });
};

// Retrieves value for a given key from Async storage
const retrieveData = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await AsyncStorage.getItem(key);
      resolve(value !== null ? JSON.parse(value) : null);
    } catch (error) {
      reject(error || "Error retrieving data");
    }
  });
};

export { storeData, retrieveData };
