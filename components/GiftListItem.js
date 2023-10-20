// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { EMPTY_GIFT } from "../util/constants";

import SwipeableGiftRow from "./SwipeableGiftRow";

// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const GiftListItem = ({ gift, personId }) => {
  const navigation = useNavigation();
  const { deleteGift } = useApp();

  return (
    <SwipeableGiftRow
      deleteGift={deleteGift}
      gift={gift}
      personId={personId}
      navigation={navigation}
    >
      <Pressable
        style={[styles.container]}
        onPress={() => {
          navigation.navigate("AddIdea", { giftId: gift.id });
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
