import { DateTime, Interval } from "luxon";
import { useEffect, useState } from "react";

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { formatDate } from "../util/util";

const GiftSummary = ({ person }) => {
  const currentDate = DateTime.now();

  const [formattedDate, setFormattedDate] = useState("");
  const [giftCountText, setGiftCountText] = useState("");
  const [birthdayText, setBirthdayText] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    let giftArr = person.gifts || [];
    let dob = person.dob;

    if (!Array.isArray(giftArr)) {
      giftArr = [];
    }

    if (giftArr.length === 0) {
      setGiftCountText("No gifts");
    } else if (giftArr.length === 1) {
      setGiftCountText("1 gift");
    } else {
      setGiftCountText(`${giftArr.length} gifts`);
    }

    // find the date difference
    try {
      const date1 = DateTime.fromISO(currentDate);
      const date2 = DateTime.fromISO(dob);
      setFormattedDate(formatDate(date2));

      const diffInDays = -1 * Math.ceil(date1.diff(date2).as("days"));
      setIcon("birthday-cake");

      if (diffInDays <= -30) {
        setBirthdayText("");
      } else if (diffInDays <= -7) {
        setBirthdayText("Past month");
      } else if (diffInDays <= -1) {
        setBirthdayText("Past week");
      } else if (diffInDays === 0) {
        setBirthdayText("Today!");
      } else if (diffInDays === 1) {
        setBirthdayText("Tomorrow!");
      } else if (diffInDays <= 7) {
        setBirthdayText(`in ${diffInDays} days`);
        setIcon("birthday-cake");
      } else if (diffInDays <= 30) {
        setBirthdayText("This month!");
      } else {
        const monthCount = Number.parseInt(Math.ceil(diffInDays / 30));
        setBirthdayText(`In ${monthCount} months`);
      }
    } catch (error) {
      // do nothing
      console.warn(error);
      setBirthdayText("Error");
    }
  }, [person]);
  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: "row", gap: 10, alignSelf: "center" }}>
        <Text>{formattedDate} </Text>
        <Text>|</Text>
        <Text>{giftCountText}</Text>
      </View>
      <View>{birthdayText && <Text>{birthdayText}</Text>}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    alignContent: "center",
  },
});

export default GiftSummary;
