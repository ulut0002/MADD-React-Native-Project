import { DateTime, Interval } from "luxon";
import { useEffect, useState } from "react";

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { formatDate } from "../util/util";
import { globalStyles } from "../styles/globalStyles";

const GiftSummary = ({ person, birthdaySummary }) => {
  const currentDate = DateTime.now();

  const [formattedDate, setFormattedDate] = useState("");
  const [giftCountText, setGiftCountText] = useState("");
  const [birthdayText, setBirthdayText] = useState("");
  const [icon, setIcon] = useState("");
  const [diff, setDiff] = useState(-1000);

  useEffect(() => {
    let giftArr = person.gifts || [];
    let dob = person.dob;
    const date2 = DateTime.fromISO(dob);
    setFormattedDate(formatDate(date2));
    console.log(birthdaySummary);

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
  }, [person]);
  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: "row", gap: 10, alignSelf: "center" }}>
        <Text>{formattedDate} </Text>
        <Text>|</Text>
        <Text>{giftCountText}</Text>
      </View>
      <View>
        {birthdaySummary && birthdaySummary.text && (
          <Text>{birthdaySummary.text}</Text>
        )}
      </View>
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
