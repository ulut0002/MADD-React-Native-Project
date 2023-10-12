import { createContext, useContext, useEffect, useState } from "react";
import { retrieveData, storeData } from "../util/util";
import { STORAGE_KEYS } from "../util/constants";
import { DateTime } from "luxon";
import { useColorScheme } from "react-native";
import { useImmer } from "use-immer";
import uuid from "react-native-uuid";

const AppContext = createContext();

function AppProvider({ children }) {
  const [people, setPeople] = useImmer([]);
  const [gifts, setGifts] = useImmer([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  const [currentPersonName, setCurrentPersonName] = useState("");
  const [currentPersonDOB, setCurrentPersonDOB] = useState(null);
  const [colorScheme, setColorScheme] = useState("light");
  const colorSchemeObj = useColorScheme();

  // set color scheme. Default scheme = light
  useEffect(() => {
    setColorScheme(
      colorScheme === "dark" ? setColorScheme("dark") : setColorScheme("light")
    );
  }, [colorSchemeObj]);

  const addPerson = async () => {
    if (!currentPersonName || !currentPersonDOB) {
      console.log("return");
    }

    const newPerson = {
      id: uuid.v4(),
      name: currentPersonName,
      dob: currentPersonDOB,
      gifts: [],
    };

    console.log("newPerson", newPerson);

    try {
    } catch (error) {
      // set
    }
    console.log("add a new person");
  };

  const deletePerson = async (payload) => {
    console.log("remove a person");
  };

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
  const loadFromStorage = () => {
    setDataLoading(true);
    setDataError(null);
    peoplePromise = retrieveData(STORAGE_KEYS.PEOPLE);
    giftsPromise = retrieveData(STORAGE_KEYS.GIFTS);
    Promise.all([peoplePromise, giftsPromise])
      .then((values) => {
        setPeople((draft) => {
          console.log("people", values[0]);
          draft = values[0] ? values[0] : [];
        });
        setGifts((draft) => {
          draft = values[1] ? values[1] : [];
        });
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setDataError(err.message || "An unexpected error happened");
      });
  };

  // loading default values for available screens. Initialization only.
  const loadDefaultValues = async () => {
    setCurrentPersonDOB(DateTime.now());
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
        currentPersonDOB,
        currentPersonName,
        setCurrentPersonDOB,
        setCurrentPersonName,
        clearErrorMessage,
        dataLoading,
        dataError,
        colorScheme,
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
