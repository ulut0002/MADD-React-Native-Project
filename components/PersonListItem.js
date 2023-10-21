// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import SwipeableRow from "./SwipeableRow";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { DEFAULT_BIRTHDAY_HIGHLIGHT, EMPTY_PERSON } from "../util/constants";
import GiftSummary from "./GiftSummary";
import { globalStyles } from "../styles/globalStyles";
import { getBirthdayDefinition } from "../util/util";
// import { getDateDifference } from "../util/util";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const PersonListItem = ({ person }) => {
  const navigation = useNavigation();
  const { deletePerson, deletePersonWithConfirm } = useApp();

  const [personObject, setPersonObject] = useState(_.cloneDeep(EMPTY_PERSON));

  const [birthdaySummary, setBirthdaySummary] = useState({
    ...DEFAULT_BIRTHDAY_HIGHLIGHT,
  });

  useEffect(() => {
    if (person) {
      setPersonObject(_.cloneDeep(person));
      const bdDefinition = getBirthdayDefinition(person.dob);
      setBirthdaySummary(bdDefinition);
    }
  }, [person]);

  return (
    <SwipeableRow
      deletePerson={deletePerson}
      deletePersonWithConfirm={deletePersonWithConfirm}
      person={personObject}
      navigation={navigation}
    >
      <Pressable
        style={[
          globalStyles.personListItemDefault,
          globalStyles.personListItemContainer,
          birthdaySummary &&
            birthdaySummary.style &&
            globalStyles[birthdaySummary.style],
        ]}
        onPress={() => {
          navigation.navigate("Ideas", { personId: personObject.id });
        }}
      >
        <Text style={[styles.name]}>{personObject.name || "Unnamed"}</Text>
        <View style={[styles.dobContainer]}>
          <GiftSummary
            person={personObject}
            birthdaySummary={birthdaySummary}
          />
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
