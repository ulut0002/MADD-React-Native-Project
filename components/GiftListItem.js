// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { EMPTY_GIFT } from "../util/constants";

import SwipeableGiftRow from "./SwipeableGiftRow";
import { Avatar, Button, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const GiftListItem = ({ gift, personId }) => {
  const navigation = useNavigation();
  const { deleteGift, deleteGiftWithConfirm } = useApp();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("AddIdea", { giftId: gift.id });
      }}
    >
      <View style={[styles.container]}>
        <View style={{ flexDirection: "row", flex: 1, gap: 10 }}>
          {gift.image && (
            <Pressable
              onPress={() => {
                console.log("pressed");
              }}
            >
              <Image
                source={{ uri: gift.image }}
                style={{ width: 50, height: 50 }}
              ></Image>
            </Pressable>
          )}

          {!gift.image && (
            <MaterialIcons name="image-not-supported" size={50} color="black" />
          )}

          <Text style={[styles.name]}>{gift.text || "Unnamed"}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 0 }}>
          <Button
            onPress={async () => {
              deleteGiftWithConfirm({ giftId: gift.id, personId: personId })
                .then(() => {})
                .catch((err) => {});
            }}
          >
            <View style={styles.deleteButton}>
              <MaterialIcons
                name="delete"
                size={24}
                color="black"
                style={[{ alignSelf: "center" }, globalStyles.danger]}
              />
              <Text
                style={[styles.deleteColor, { color: globalStyles.danger }]}
              >
                Delete
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 12,
  },

  deleteButton: {
    color: globalStyles.danger,
    alignSelf: "center",
    textAlign: "center",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },

  deleteColor: {
    color: globalStyles.danger,
  },

  row: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  column: {
    flexDirection: "column",
    alignContent: "center",
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

/*

{!gift.image && <Avatar.Icon size={50} icon={giftIcon}></Avatar.Icon>}
  return (
    <SwipeableGiftRow
      deleteGift={deleteGift}
      gift={gift}
      personId={personId}
      navigation={navigation}
    >
      <Pressable
        onPress={() => {
          navigation.navigate("AddIdea", { giftId: gift.id });
        }}
      >
        <View style={[styles.container]}>
          {gift.image && (
            <Pressable
              onPress={() => {
                console.log("pressed");
              }}
            >
              <Image
                source={{ uri: gift.image }}
                style={{ width: 50, height: 50 }}
              ></Image>
            </Pressable>
          )}

          {!gift.image && <Avatar.Icon size={50} icon={giftIcon}></Avatar.Icon>}
          <Text style={[styles.name]}>{gift.text || "Unnamed"}</Text>
        </View>
      </Pressable>
    </SwipeableGiftRow>
  );

*/
