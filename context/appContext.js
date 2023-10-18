import { createContext, useContext, useEffect, useState } from "react";
import { retrieveData, sortPeopleArrayByDate, storeData } from "../util/util";
import { STORAGE_KEYS, EMPTY_PERSON } from "../util/constants";
import { DateTime } from "luxon";
import { useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import uuid from "react-native-uuid";

const AppContext = createContext();

function AppProvider({ children }) {
  const [people, setPeople] = useState([]);
  // const [gifts, setGifts] = useState([]);

  // When falsy, it means a brand new person entry.
  // when not falsy, it means we are working on an existing person
  const [currentPersonId, setCurrentPersonId] = useState("");

  // currentPerson indicates the currently selected person
  const [currentPerson, setCurrentPerson] = useState({ ...EMPTY_PERSON });

  // newPerson stores the details of person details on the add person screen
  const [newPerson, setNewPerson] = useState({ ...EMPTY_PERSON });

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [lastDeletedPerson, setLastDeletedPerson] = useState(null);
  const [lastDeletedGifts, setLastDeletedGifts] = useState(null);
  const [personToDelete, setPersonToDelete] = useState("");

  const [colorScheme, setColorScheme] = useState("light");
  const colorSchemeObj = useColorScheme();
  const navigation = useNavigation();

  // set color scheme. Default scheme = light
  useEffect(() => {
    setColorScheme(
      colorScheme === "dark" ? setColorScheme("dark") : setColorScheme("light")
    );
  }, [colorSchemeObj]);

  // When people array changes, sort it by birthday
  useEffect(() => {
    const cleanData = async () => {
      return;
      await storeData(STORAGE_KEYS.PEOPLE, null);
      await storeData(STORAGE_KEYS.GIFTS, null);
    };

    cleanData();
  }, []);

  const undoLastDelete = () => {};

  const resetCurrentPerson = (id) => {
    let person = null;

    if (id) {
      person = findPerson(id);
    }

    if (!person) {
      setCurrentPersonId(null);
      setCurrentPerson({ ...EMPTY_PERSON });
      return;
    }
    setCurrentPersonId(person.id); //
    setCurrentPerson({ ...person });
  };

  /**
   *
   *
   */
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const findPerson = (id) => {
    const person = people.find((person) => person.id === id);
    return person;
  };
  const findGift = (personId, giftId) => {
    const person = findPerson(personId);
    if (!person) {
      return;
    }
    return person.gifts.find((gift) => gift.id === giftId);
  };

  /**
   *  Add a new person to the people's list with blank gift array.
   *  - Add new object to array-copy
   *  - store the array data in Async storage
   *  - clear out form values
   *  - update people state object
   *  - navigate to home screen. (the list will be updated)
   *
   *  If the process fails, stay on the same screen and display an error message
   */
  const addPerson = async () => {
    if (currentPersonId) {
      saveExistingPerson();
    } else {
      createNewPerson();
    }
  };

  // internal function to create a new person in people's array
  // - create a new person object
  // - add it to the copy of people array
  // - sort people array by date
  // - push the array to Async Storage
  // - clear out state variable and navigate to home
  const createNewPerson = async () => {
    // create a brand new object
    let personToAdd = {};
    personToAdd = {
      id: uuid.v4(),
      name: newPerson.name,
      dob: newPerson.dob,
      gifts: [],
    };

    // add it to people array copy
    let peopleCopy = _.cloneDeep(people);
    peopleCopy.push(personToAdd);
    peopleCopy = sortPeopleArrayByDate(peopleCopy);

    // update storage and state
    try {
      await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
      setNewPerson({ ...EMPTY_PERSON });
      setPeople(peopleCopy);
      navigation.navigate("Home");
    } catch (error) {
      // TODO: set error
      console.warn("error", error);
    }
  };

  // internal function update name and dob on an existing person
  // - find the person in the array, and update name and dob from state variable
  // - sort people array by date
  // - push the array to Async Storage
  // - clear out state variable and navigate to Ideas screen
  const saveExistingPerson = async () => {
    const person = findPerson(currentPersonId);
    if (!person)
      throw new Error(`Person with id ${currentPersonId} is not found`);

    let peopleCopy = _.cloneDeep(people);

    peopleCopy = peopleCopy.map((person) => {
      if (person.id === currentPersonId) {
        return { ...person, name: currentPerson.name, dob: currentPerson.dob };
      } else {
        return person;
      }
    });

    // console.log("updated", peopleCopy[0]);

    peopleCopy = sortPeopleArrayByDate(peopleCopy);

    try {
      await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
      setPeople(_.cloneDeep(peopleCopy));
      setCurrentPersonId(null);
      setCurrentPerson({ ...EMPTY_PERSON });
      navigation.navigate("Home");
    } catch (error) {
      // TODO: set error
      console.warn("error", error);
    }
  };

  /**
   * @parameter personId
   *
   * 1. Find the person in the array list, delete, update state and async storage
   * 2. Do the same thing for the gift items whose personId = parameter
   */
  const deletePerson = async () => {
    if (!currentPersonId) {
      throw new Error(`Person id is missing. Delete failed!`);
    }

    let peopleCopy = people.filter((person) => person.id !== currentPersonId);

    try {
      await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
      setPeople(peopleCopy);
      navigation.navigate("Home");
    } catch (error) {
      // TODO: set error state
      console.warn(error);
    }
  };

  const setContextCurrentPerson = (id) => {
    if (!id) return;
    const foundPerson = findPerson(id);
    if (!foundPerson) return;
    setCurrentPerson({ ...foundPerson });
    setCurrentPersonId(foundPerson.id);
    navigation.navigate("AddPeople", {});
  };

  /**
   *
   * @param  payload
   */
  const updatePerson = async (payload) => {
    console.log("edit person");
  };

  const addGift = async (payload) => {
    const { text, image } = payload;

    if (!currentPersonId) {
      throw new Error(`Unexpected error during adding a gift`);
    }

    const newPeople = people.map((person) => {
      if (person.id === currentPersonId) {
        const newPerson = _.cloneDeep(person);
        const newGift = {
          id: uuid.v4(),
          text: text,
          image: image,
        };
        newPerson.gifts.push(newGift);
        return newPerson;
      } else {
        return person;
      }
    });

    try {
      await storeData(STORAGE_KEYS.PEOPLE, newPeople);
      setPeople(newPeople);
      navigation.navigate("Ideas");
    } catch (error) {
      // TODO: set error state
      console.warn(error);
    }

    console.log("add a new gift", text);
  };

  const updateGift = async (payload) => {
    console.log("update gift");
  };

  const deleteGift = async (payload) => {
    const { personId, giftId } = payload;

    const peopleCopy = people.map((person) => {
      if (personId === person.id) {
        const gifts = person.gifts.filter((gift) => gift.id !== giftId);

        return { ...person, gifts };
      } else {
        return person;
      }
    });

    try {
      await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
      setPeople(peopleCopy);
      navigation.navigate("Ideas");
    } catch (error) {
      // TODO: set error state
      console.warn(error);
    }
  };

  const clearErrorMessage = () => {
    setDataError("");
  };

  // Loads data from storage. Usage: 1) Initialization, 2) Refresh list
  const loadFromStorage = async () => {
    setDataLoading(true);
    setDataError("");

    peoplePromise = retrieveData(STORAGE_KEYS.PEOPLE);
    giftsPromise = retrieveData(STORAGE_KEYS.GIFTS);
    try {
      const [peopleValues, giftValues] = await Promise.all([
        peoplePromise,
        giftsPromise,
      ]);
      let peopleArr = peopleValues;
      if (peopleValues && Array.isArray(peopleValues)) {
        peopleArr = sortPeopleArrayByDate(peopleValues);
        sortPeopleArrayByDate(peopleArr);
      }
      setPeople(peopleArr ? peopleArr : []);
      // setGifts(giftValues ? giftValues : []);

      setDataLoading(false);
    } catch (error) {
      console.warn(error);
      setDataError(error.message || "Data could not be loaded.");
    }
  };

  // loading default values for available screens. Initialization only.
  const loadDefaultValues = async () => {
    // setCurrentPersonDOB(DateTime.now());
  };

  // app initialization - load all data from storage
  useEffect(() => {
    loadFromStorage();
    loadDefaultValues();
  }, []);

  return (
    <AppContext.Provider
      value={{
        // gifts,
        people,
        addPerson,
        deletePerson,
        updatePerson,

        clearErrorMessage,
        dataLoading,
        dataError,
        colorScheme,
        toggleModal,
        undoLastDelete,
        lastDeletedPerson,
        modalVisible,
        setModalVisible,
        personToDelete,
        setPersonToDelete,
        loadFromStorage,
        findPerson,
        findGift,
        currentPerson,
        setCurrentPerson,
        resetCurrentPerson,
        newPerson,
        setNewPerson,
        currentPersonId,
        setCurrentPersonId,
        setContextCurrentPerson,
        addGift,
        deleteGift,
        updateGift,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("Not inside the Provider");
  return context;
}
export { useApp, AppProvider };
