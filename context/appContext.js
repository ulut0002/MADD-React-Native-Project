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
  const [gifts, setGifts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [lastDeletedPerson, setLastDeletedPerson] = useState(null);
  const [lastDeletedGifts, setLastDeletedGifts] = useState(null);
  const [personToDelete, setPersonToDelete] = useState("");

  const [currentPersonId, setCurrentPersonId] = useState("");

  const [currentPerson, setCurrentPerson] = useState(_.cloneDeep(EMPTY_PERSON));
  const [newPerson, setNewPerson] = useState(_.cloneDeep(EMPTY_PERSON));

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
      setCurrentPerson(null);
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
    // console.log("new person", newPerson, currentPerson);

    const personToAdd = {
      id: uuid.v4(),
      name: newPerson.name,
      dob: newPerson.dob,
      gifts: [],
    };

    if (!personToAdd.id) {
      //TODO: throw an error
    }
    if (!personToAdd.name) {
      //TODO: throw an error
    }
    if (!personToAdd.dob) {
      //TODO: throw an error
    }

    let peopleCopy = _.cloneDeep(people);
    peopleCopy.push(personToAdd);

    try {
      await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
      // setCurrentPerson(null);
      setNewPerson({});
      setPeople(peopleCopy);
      navigation.navigate("Home");
    } catch (error) {
      // TODO: set error
      console.log("error", error);
    }
  };

  /**
   * @parameter personId
   *
   * 1. Find the person in the array list, delete, update state and async storage
   * 2. Do the same thing for the gift items whose personId = parameter
   */
  const deletePerson = async (payload) => {
    const { id: personId } = payload;
    console.log("personid", payload);

    if (!personId) return;

    const newPeopleList = people.filter((person) => {
      person.id !== personId;
    });

    const newGiftList = gifts.filter((gift) => {
      gift.personId !== personId;
    });

    try {
      await storeData(STORAGE_KEYS.PEOPLE, newPeopleList);
      await storeData(STORAGE_KEYS.GIFTS, newGiftList);
      setPeople(newPeopleList);
      setGifts(newGiftList);
    } catch (error) {
      // TODO: set error state
      console.warn(error);
    }
  };

  /**
   *
   * @param  payload
   */
  const updatePerson = async (payload) => {
    console.log("edit person");
  };

  const addGift = async (payload) => {
    console.log("add a new gift");
  };

  const updateGift = async (payload) => {
    console.log("delete a gift");
  };

  const editGift = async (payload) => {
    console.log("edit gift");
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
        // peopleArr = sortPeopleArrayByDate(peopleValues);
        sortPeopleArrayByDate(peopleArr);
      }
      setPeople(peopleArr ? peopleArr : []);
      setGifts(giftValues ? giftValues : []);

      setDataLoading(false);
    } catch (error) {
      console.log(error);
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
        gifts,
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
        currentPerson,
        setCurrentPerson,
        resetCurrentPerson,
        newPerson,
        setNewPerson,
        currentPersonId,
        setCurrentPersonId,
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
