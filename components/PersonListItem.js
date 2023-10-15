// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import SwipeableRow from "./SwipeableRow";
import { useNavigation } from "@react-navigation/native";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const PersonListItem = ({ id }) => {
  const navigation = useNavigation();
  const {
    gifts,
    people,
    deletePerson,
    setPersonToDelete,
    personToDelete,
    modalVisible,
    currentPersonId,
    setCurrentPerson,
    resetCurrentPerson,
  } = useApp();

  const [person, setPerson] = useState({});
  const [personGifts, setPersonGifts] = useState([]);

  const name = "";

  useEffect(() => {
    //find the data
    const person = people.find((person) => person.id === id);
    const personGifts = gifts.find((gift) => gift.personId === id);
    setPerson(person ? person : {});
    setPersonGifts(personGifts ? personGifts : []);
  }, [id]);

  const formatDate = (dt) => {
    // console.log(1"dob", dt);
    try {
      const formattedValue = DateTime.fromISO(dt).toFormat("MMM - dd");
      return formattedValue;
    } catch (error) {
      // console.warn(error);
      return "DOB N/A";
    }
  };

  return (
    <SwipeableRow
      deletePerson={deletePerson}
      personId={person.id}
      person={person}
    >
      <Pressable
        style={[styles.container]}
        onPress={() => {
          console.log("go to details", person.id);
          // setCurrentPerson(person);
          resetCurrentPerson(person.id);
          navigation.navigate("AddPeople", { personId: person.id });
        }}
      >
        <Text>{person.name || "Unnamed"}</Text>
        <Text>{formatDate(person.dob)}</Text>
        <Text>No. of Gifts: {personGifts.length || "Array.Length"}</Text>
      </Pressable>
    </SwipeableRow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#93adc2",
  },
});

export default PersonListItem;
