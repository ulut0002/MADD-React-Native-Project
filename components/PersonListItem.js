// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import SwipeableRow from "./SwipeableRow";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { EMPTY_PERSON } from "../util/constants";
import GiftSummary from "./GiftSummary";
import { List } from "react-native-paper";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const PersonListItem = ({ id }) => {
  const navigation = useNavigation();
  const {
    people,
    deletePerson,
    setContextCurrentPerson,
    setCurrentPerson,
    setCurrentPersonId,
  } = useApp();

  const [person, setPerson] = useState(_.cloneDeep(EMPTY_PERSON));
  const [personGifts, setPersonGifts] = useState([]);

  const name = "";

  useEffect(() => {
    //find the data
    const person = people.find((person) => person.id === id);
    const personGifts = person.gifts.find((gift) => gift.personId === id);
    setPerson(person ? _.cloneDeep(person) : {});
    setPersonGifts(personGifts ? personGifts : []);
  }, [id, people]); // do not remove people dependency

  const formatDate = (dt) => {
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
      setContextCurrentPerson={setContextCurrentPerson}
    >
      <Pressable
        style={[styles.container]}
        onPress={() => {
          // setCurrentPerson(person);
          // resetCurrentPerson(person.id);
          setCurrentPerson(person);
          setCurrentPersonId(person.id);
          navigation.navigate("Ideas", { personId: person.id });
        }}
      >
        <Text style={[styles.name]}>{person.name || "Unnamed"}</Text>
        <View style={[styles.dobContainer]}>
          <GiftSummary person={person} />
        </View>
      </Pressable>
    </SwipeableRow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    gap: 12,
  },

  name: {
    fontWeight: "bold",
    fontSize: 22,
    paddingTop: 8,
  },

  dobContainer: {
    paddingBottom: 8,
    flexDirection: "row",
    gap: 24,
  },
});

export default PersonListItem;
