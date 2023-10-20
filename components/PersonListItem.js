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
import { globalStyles } from "../styles/globalStyles";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const PersonListItem = ({ person }) => {
  const navigation = useNavigation();
  const { deletePerson, setCurrentPerson, setCurrentPersonId } = useApp();

  const [personObject, setPersonObject] = useState(_.cloneDeep(EMPTY_PERSON));

  useEffect(() => {
    if (person) {
      setPersonObject(_.cloneDeep(person));
    }
  }, [person]);

  return (
    <SwipeableRow
      deletePerson={deletePerson}
      person={personObject}
      navigation={navigation}
    >
      <Pressable
        style={[
          globalStyles.personListItemDefault,
          globalStyles.personListItemContainer,
        ]}
        onPress={() => {
          navigation.navigate("Ideas", { personId: personObject.id });
        }}
      >
        <Text style={[styles.name]}>{personObject.name || "Unnamed"}</Text>
        <View style={[styles.dobContainer]}>
          <GiftSummary person={personObject} />
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
