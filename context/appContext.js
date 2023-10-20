import { createContext, useContext, useEffect, useState } from "react";
import {
  copyFileFromCacheToDocuments,
  deleteFileFromCache,
  deleteFileFromStorage,
  retrieveData,
  sortPeopleArrayByDate,
  storeData,
} from "../util/util";
import { STORAGE_KEYS, EMPTY_PERSON } from "../util/constants";
import { useNavigation } from "@react-navigation/native";

import _ from "lodash";

import uuid from "react-native-uuid";
import { Alert } from "react-native";

const AppContext = createContext();

function AppProvider({ children }) {
  const [people, setPeople] = useState([]);

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

  const navigation = useNavigation();

  // When people array changes, sort it by birthday
  useEffect(() => {
    const cleanData = async () => {
      return;
      await storeData(STORAGE_KEYS.PEOPLE, null);
      await storeData(STORAGE_KEYS.GIFTS, null);
    };

    cleanData();
  }, []);

  /**
   *
   *
   */
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const addPerson = async (payload) => {
    const { id } = payload;
    if (id) {
      saveExistingPersonPromise(payload)
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.warn("Error at saveExistingPerson: ", error);
        });
    } else {
      createNewPersonPromise(payload)
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.warn("Error at createNewPerson: ", error);
        });
    }
  };

  const deletePerson = async (personId) => {
    deletePersonPromise(personId)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.warn("deletePerson error: ", error);
      });
  };

  const deletePersonWithConfirm = (personId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const person = findPerson(personId);
        if (!person) {
          throw new Error(`Person with id ${personId} is not found`);
        }

        const name = person.name || "this person";

        const giftCount = Array.isArray(person.gifts) ? person.gifts.length : 0;
        const giftCountText =
          giftCount === 0
            ? `Are you sure you want to delete ${name}?`
            : `You have entered ${giftCount} gift idea${
                giftCount === 1 ? "" : "s"
              } for this person. Are you sure?`;

        Alert.alert(`Deleting ${name}?`, `${giftCountText}`, [
          {
            text: "Cancel",
            onPress: () => {
              resolve(false);
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                await deletePerson(personId);
                resolve(true);
              } catch (error) {
                throw new Error(error);
              }
            },
            style: "default",
          },
        ]);
      } catch (error) {
        reject(error);
      }
    });
  };

  const addGiftPromise = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { text, image, personId } = payload;
        let copiedImage = "";
        if (image) {
          try {
            copiedImage = await copyFileFromCacheToDocuments(image);
          } catch (error) {
            throw new Error("image copy error");
          }
        }

        const newPeople = people.map((person) => {
          if (person.id === personId) {
            const newGift = {
              id: uuid.v4(),
              text: text,
              image: copiedImage ? copiedImage : image,
            };
            const giftsCopy = person.gifts.map((gift) => {
              return gift;
            });
            giftsCopy.push(newGift);
            const newPerson = { ...person, gifts: giftsCopy };
            return newPerson;
          } else {
            return person;
          }
        });
        await storeData(STORAGE_KEYS.PEOPLE, newPeople);
        try {
          if (copiedImage) {
            await deleteFileFromCache(image);
          }
        } catch (error) {
          console.warn("error", error);
        }

        setPeople(newPeople);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateGiftPromise = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, text, image, personId } = payload;

        let copiedImage = "";
        if (image) {
          try {
            copiedImage = await copyFileFromCacheToDocuments(image);
          } catch (error) {
            throw new Error("image copy error");
          }
        }

        const newPeople = people.map((person) => {
          if (person.id === personId) {
            const newGifts = person.gifts.map((gift) => {
              if (gift.id === id) {
                const newGift = {
                  ...gift,
                  text: text,
                  image: copiedImage ? copiedImage : image,
                };
                return newGift;
              } else {
                return gift;
              }
            });
            const newPerson = { ...person, gifts: _.cloneDeep(newGifts) };
            return newPerson;
          } else {
            return person;
          }
        });
        await storeData(STORAGE_KEYS.PEOPLE, newPeople);
        try {
          if (copiedImage) {
            await deleteFileFromCache(image);
          }
        } catch (error) {
          console.warn("error", error);
        }
        setPeople(newPeople);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const addGift = async (payload) => {
    const { id, text, image } = payload;

    if (!id) {
      const payload = { text, image, personId: currentPersonId };

      addGiftPromise(payload)
        .then(() => {
          navigation.navigate("Ideas", { personId: currentPersonId });
        })
        .catch((error) => {
          console.warn("inserting gift:", error);
        });
    } else {
      const payload = { text, image, id, personId: currentPersonId };
      updateGiftPromise(payload)
        .then(() => {
          navigation.navigate("Ideas", { personId: currentPersonId });
        })
        .catch((error) => {
          console.warn("updating gift:", error);
        });
    }
  };

  const deleteGiftPromise = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { personId, giftId } = payload;
        const peopleCopy = people.map((person) => {
          if (personId === person.id) {
            const giftsCopy = person.gifts.filter((gift) => {
              return gift.id !== giftId;
            });
            return { ...person, gifts: _.cloneDeep(giftsCopy) };
          } else {
            return person;
          }
        });
        await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
        setPeople(peopleCopy);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const deleteGift = (payload) => {
    deleteGiftPromise(payload)
      .then(() => {
        navigation.navigate("Ideas", { personId: currentPersonId });
      })
      .catch((err) => {
        console.warn("deleteGift", err);
      });
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

  // app initialization - load all data from storage
  useEffect(() => {
    loadFromStorage();
  }, []);

  // PROMISES
  const createNewPersonPromise = (payload) => {
    return new Promise(async (resolve, reject) => {
      const { name, dob } = payload;
      try {
        let personToAdd = {};
        personToAdd = {
          id: uuid.v4(),
          name: name,
          dob: dob,
          gifts: [],
        };

        // add it to people array copy
        let peopleCopy = _.cloneDeep(people);
        peopleCopy.push(personToAdd);
        peopleCopy = sortPeopleArrayByDate(peopleCopy);

        await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
        setNewPerson({ ...EMPTY_PERSON });
        setPeople(peopleCopy);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveExistingPersonPromise = (payload) => {
    return new Promise(async (resolve, reject) => {
      const { id, name, dob } = payload;

      try {
        const person = findPerson(id);
        if (!person)
          throw new Error(`Person with id ${currentPersonId} is not found`);

        let peopleCopy = _.cloneDeep(people);

        peopleCopy = peopleCopy.map((person) => {
          if (person.id === id) {
            return {
              ...person,
              name: name,
              dob: dob,
            };
          } else {
            return person;
          }
        });
        peopleCopy = sortPeopleArrayByDate(peopleCopy);
        await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
        setPeople(_.cloneDeep(peopleCopy));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const deletePersonFiles = async (person) => {
    if (!person || !person.gifts) {
      return;
    }
    const gifts = person.gifts;
    for (const gift of gifts) {
      if (gift.image) {
        try {
          await deleteFileFromStorage(gift.image);
        } catch (error) {
          //do nothing
        }
      }
    }
  };

  const deletePersonPromise = (personId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!personId) {
          throw new Error(`Person id is missing. Delete failed!`);
        }

        const personToDelete = people.find((person) => {
          return person.id === personId;
        });
        let peopleCopy = people.filter((person) => person.id !== personId);
        await storeData(STORAGE_KEYS.PEOPLE, peopleCopy);
        if (personToDelete) {
          await deletePersonFiles(personToDelete);
        }
        setPeople(peopleCopy);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  // HELPER FUNCTIONS
  const findPerson = (id) => {
    const person = people.find((person) => person.id === id);
    return person;
  };

  const findGiftsByPersonId = (personId) => {
    const person = findPerson(personId);
    if (!person) return [];
    return _.cloneDeep(person.gifts);
  };
  const findGift = (personId, giftId) => {
    const person = findPerson(personId);
    if (!person) {
      return;
    }
    return person.gifts.find((gift) => gift.id === giftId);
  };

  return (
    <AppContext.Provider
      value={{
        // gifts,
        people,
        addPerson,
        deletePerson,
        deletePersonWithConfirm,
        clearErrorMessage,
        dataLoading,
        dataError,
        toggleModal,
        modalVisible,
        setModalVisible,
        loadFromStorage,
        findPerson,
        findGift,
        currentPerson,
        setCurrentPerson,
        newPerson,
        setNewPerson,
        currentPersonId,
        setCurrentPersonId,
        addGift,
        deleteGift,
        findGiftsByPersonId,
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
