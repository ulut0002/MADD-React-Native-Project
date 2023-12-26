import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import _ from "lodash";
import * as FileSystem from "expo-file-system";
import { SETTINGS } from "../config/config";
import { BIRTHDAY_HIGHLIGHT, DEFAULT_BIRTHDAY_HIGHLIGHT } from "./constants";
import { useFonts } from "expo-font";
import { Platform } from "react-native";

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

const getShortFileName = (url) => {
  if (!url) return "";
  const urlParts = url.split("/");
  const shortFileName = urlParts[urlParts.length - 1];
  return shortFileName;
};

const copyFileFromCacheToDocuments = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const documentDir = FileSystem.documentDirectory;
      FileSystem.cacheDirectory;
      if (url.startsWith(documentDir)) {
        // no need to move it
        resolve(url);
        return;
      }
      const shortFileName = getShortFileName(url);
      destinationFile = documentDir + shortFileName;
      await FileSystem.copyAsync({ from: url, to: destinationFile });
      resolve(destinationFile);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteFileFromCache = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cacheDirectory = FileSystem.cacheDirectory;
      if (!url.startsWith(cacheDirectory)) {
        // no need to move it
        resolve(true);
        return;
      }
      await FileSystem.deleteAsync(url);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteFileFromStorage = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const info = await FileSystem.getInfoAsync(url);
      if (info.exists) {
        await FileSystem.deleteAsync(url);
      }
      resolve();
    } catch (error) {
      //do nothing
      reject(error);
    }
  });
};

const moveFileFromCacheToDocuments = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const documentDir = FileSystem.documentDirectory;
      if (url.startsWith(documentDir)) {
        // no need to move it
        resolve(url);
        return;
      }
      const shortFileName = getShortFileName(url);
      destinationFile = documentDir + shortFileName;
      await FileSystem.moveAsync({ from: url, to: destinationFile });

      resolve(destinationFile);
    } catch (error) {
      reject(error);
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
      const personDOB = DateTime.utc(baseYear, dob.month, dob.day);
      return personDOB >= baseToday && personDOB <= baseYearEnd;
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
    if (dobA < dobB) return -1;
    if (dobA > dobB) return 1;
    return 0;
  });

  pastBirthdays.sort((a, b) => {
    let dobA = DateTime.fromISO(a.dob);
    let dobB = DateTime.fromISO(b.dob);
    dobA = DateTime.utc(baseYear, dobA.month, dobA.day);
    dobB = DateTime.utc(baseYear, dobB.month, dobB.day);
    if (dobA < dobB) return 1;
    if (dobA > dobB) return -1;
    return 0;
  });

  result = [...approachingBirthdays, ...pastBirthdays];

  return result;
};

const getBirthdayDefinition = (dob) => {
  const numberOfDays = getDateDifference(dob);

  let retObj = { ...DEFAULT_BIRTHDAY_HIGHLIGHT, numberOfDays };

  let text = "";
  let style = "";

  try {
    // if (numberOfDays)
    switch (true) {
      case numberOfDays <= -80:
        text = "Passed";
        break;
      case numberOfDays <= -50:
        text = "2 months ago";
        break;
      case numberOfDays <= -30:
        text = "Last month";
        break;
      case numberOfDays <= -20:
        text = "3 weeks ago";
        break;

      case numberOfDays <= -13:
        text = "2 weeks ago";
        break;
      case numberOfDays <= -7:
        text = "Last week";
        break;
      case numberOfDays <= -2:
        text = "A few days ago";
        break;
      case numberOfDays === -1:
        text = "It was yesterday!";
        break;
      case numberOfDays === 0:
        text = "It is Today!";
        break;
      case numberOfDays === 1:
        text = "It is Tomorrow!";
        break;
      case numberOfDays <= 7:
        text = "It is this week!";
        break;
      case numberOfDays <= 20:
        text = "in 2 weeks";
        break;
      case numberOfDays <= 27:
        text = "in 3 weeks";
        break;
      case numberOfDays <= 35:
        text = "in a month";
        break;
      case numberOfDays <= 65:
        text = "in 2 months";
        break;

      default:
        const formattedValue = DateTime.fromISO(dpb).toFormat("MMM");
        text = `Next ${formattedValue}`;
        break;
    }
  } catch (error) {
    // do nothing
    console.warn(error);
    return { ...DEFAULT_BIRTHDAY_HIGHLIGHT };
  }

  retObj = { ...retObj, text };

  // find the style
  // today:
  if (numberOfDays < 0) {
    style = BIRTHDAY_HIGHLIGHT.PAST;
  } else if (numberOfDays >= 0) {
    style = BIRTHDAY_HIGHLIGHT.FUTURE;
  }
  retObj = { ...retObj, style };
  return retObj;
};

const getDateDifference = (dob) => {
  try {
    const currentDate = DateTime.now();
    const dobObj = DateTime.fromISO(dob);
    const currentDateBase = DateTime.utc(
      2000,
      currentDate.month,
      currentDate.day
    );
    const dobBase = DateTime.utc(2000, dobObj.month, dobObj.day);
    const diffInDays = -1 * Math.ceil(currentDateBase.diff(dobBase).as("days"));
    return diffInDays;
  } catch (error) {
    return null;
  }
};

const loadFonts = async () => {
  return useFonts({
    "StickNoBills-Bold": require("../assets/fonts/StickNoBills-Bold.ttf"),
  });
};

const isRealDevice = () => {
  if (Platform.OS === "ios" && Platform.isTesting) {
    console.log("1");
    return false;
  } else if (Platform.OS === "ios") {
    console.log("2");
    return true;
  } else if (Platform.OS === "android" && Platform.isTesting) {
    console.log("3");
    return false;
  } else if (Platform.OS === "android") {
    console.log("4");
    return false;
  } else {
    console.log("5");
    return true;
  }
};

export {
  storeData,
  retrieveData,
  sortListByDate,
  formatDateForCalendar,
  createLuxonDate,
  sortPeopleArrayByDate,
  formatDate,
  getShortFileName,
  moveFileFromCacheToDocuments,
  copyFileFromCacheToDocuments,
  deleteFileFromCache,
  deleteFileFromStorage,
  getBirthdayDefinition,
  loadFonts,
  isRealDevice,
};
