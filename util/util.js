import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import _ from "lodash";
import { STATIC } from "./constants";

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
    console.warn("error");
  }
  const formattedDate = timestamp.toFormat("yyyy/MM/dd");

  return formattedDate;
};

const formatDate = (dt) => {
  try {
    const formattedValue = DateTime.fromISO(dt).toFormat("MMM dd");
    return formattedValue;
  } catch (error) {
    console.warn(error);
    return "";
  }
};

const createLuxonDate = (value) => {
  const timestamp = DateTime.fromFormat(value ? value : "", "yyyy/MM/dd");
  return timestamp;
};

const sortPeopleArrayByDate = (people) => {
  const baseYear = 2000;

  let baseToday = DateTime.now();
  baseToday = DateTime.utc(baseYear, baseToday.month, baseToday.day);

  const baseYearEnd = DateTime.utc(baseYear, 12, 31);

  // create two arrays:
  const approachingBirthdays = people.filter((person) => {
    try {
      const dob = DateTime.fromISO(person.dob);
      const baseDOB = DateTime.utc(baseYear, dob.month, dob.day);
      return baseDOB >= baseToday && baseDOB <= baseYearEnd;
    } catch (error) {
      console.warn("approachingBirthdays", error);
      return false;
    }
  });

  const pastBirthdays = people.filter((person) => {
    try {
      const dob = DateTime.fromISO(person.dob);
      const baseDOB = DateTime.utc(baseYear, dob.month, dob.day);
      return baseDOB < baseToday;
    } catch (error) {
      console.warn("pastBirthdays", error);
      return false;
    }
  });

  // sort birthdays
  approachingBirthdays.sort((a, b) => {
    let dobA = DateTime.fromISO(a.dob);
    let dobB = DateTime.fromISO(b.dob);
    dobA = DateTime.utc(baseYear, dobA.month, dobA.day);
    dobB = DateTime.utc(baseYear, dobB.month, dobB.day);
    return dobA - dobB;
  });

  pastBirthdays.sort((a, b) => {
    let dobA = DateTime.fromISO(a.dob);
    let dobB = DateTime.fromISO(b.dob);
    dobA = DateTime.utc(baseYear, dobA.month, dobA.day);
    dobB = DateTime.utc(baseYear, dobB.month, dobB.day);
    return dobA - dobB;
  });

  result = [...approachingBirthdays, ...pastBirthdays];

  return result;
};

export {
  storeData,
  retrieveData,
  sortListByDate,
  formatDateForCalendar,
  createLuxonDate,
  sortPeopleArrayByDate,
  formatDate,
};
