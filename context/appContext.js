import { createContext, useContext, useEffect, useState } from "react";
import { retrieveData } from "../util/util";
import { STORAGE_KEYS } from "../util/constants";

const AppContext = createContext();

function AppProvider({ children }) {
  const [people, setPeople] = useState([]);
  const [gifts, setGifts] = useState([]);

  const addPerson = async (payload) => {
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

  useEffect(() => {
    const initApp = () => {
      console.log("App initialized");
      peoplePromise = retrieveData(STORAGE_KEYS.PEOPLE);
      giftsPromise = retrieveData(STORAGE_KEYS.GIFTS);
      Promise.all([peoplePromise, giftsPromise])
        .then((values) => {
          setPeople(values[1] ? values[0] : []);
          setGifts(values[1] ? values[1] : []);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    initApp();
  }, []);

  // add function here

  return (
    <AppContext.Provider
      value={{
        gifts,
        people,
        addPerson,
        deletePerson,
        updatePerson,
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
