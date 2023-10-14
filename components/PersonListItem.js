// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import SwipeableRow from "./SwipeableRow";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const Row = ({ item }) => {
  return <RectButton></RectButton>;
};

const PersonListItem = ({ id }) => {
  const {
    gifts,
    people,
    deletePerson,
    setPersonToDelete,
    personToDelete,
    modalVisible,
  } = useApp();
  const [person, setPerson] = useState({});
  const [personGifts, setPersonGifts] = useState([]);

  const name = "";

  useEffect(() => {
    //find the data
    const person = people.find((person) => person.id === id);
    const personGifts = gifts.find((gift) => gift.personId === id);
    // console.log("found person", person);
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
      <View style={[styles.container]}>
        <Text>{person.name || "Unnamed"}</Text>
        <Text>{formatDate(person.dob)}</Text>
        <Text>No. of Gifts: {personGifts.length || "Array.Length"}</Text>
      </View>
    </SwipeableRow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#93adc2",
  },
});

export default PersonListItem;
