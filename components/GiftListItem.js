// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import SwipeableRow from "./SwipeableRow";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { EMPTY_GIFT, EMPTY_PERSON } from "../util/constants";
import GiftSummary from "./GiftSummary";
import SwipeableGiftRow from "./SwipeableGiftRow";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const GiftListItem = ({ gift = { ...EMPTY_GIFT } }) => {
  const navigation = useNavigation();
  const {
    gifts,
    people,
    deletePerson,
    setContextCurrentPerson,
    setCurrentPerson,
    setCurrentPersonId,
  } = useApp();

  return (
    <SwipeableGiftRow
      deletePerson={deletePerson}
      personId={gift.id}
      person={gift}
      setContextCurrentPerson={setContextCurrentPerson}
    >
      <Pressable
        style={[styles.container]}
        onPress={() => {
          // setCurrentPerson(person);
          // resetCurrentPerson(person.id);
          //   setCurrentPerson(gift);
          //   setCurrentPersonId(gift.id);
          //   navigation.navigate("Ideas", { personId: gift.id });
          console.log("ress");
          navigation.navigate("AddIdea", { giftId: gift.id, preview: true });
        }}
      >
        <Text style={[styles.name]}>{gift.text || "Unnamed"}</Text>
      </Pressable>
    </SwipeableGiftRow>
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

export default GiftListItem;
