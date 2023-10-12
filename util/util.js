import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";

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

// sorts the list by date, and returns a new array
// make sure that this is not the state object itself, but its deep copy
// because it mutates the array
const sortListByDate = (arr) => {
  if (!arr || Array.isArray(arr) || arr.length === 0) return;
};

const formatDateForCalendar = (sourceDate) => {
  timestamp = new DateTime.now();
  try {
    timestamp = DateTime.fromISO(sourceDate);
  } catch (error) {
    console.log("error");
  }
  const formattedDate = timestamp.toFormat("yyyy/MM/dd");

  return formattedDate;
};

const createLuxonDate = (value) => {
  const timestamp = DateTime.fromFormat(value ? value : "", "yyyy/MM/dd");
  return timestamp;
};

export {
  storeData,
  retrieveData,
  sortListByDate,
  formatDateForCalendar,
  createLuxonDate,
};
