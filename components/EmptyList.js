import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import globalStyles from "../styles/globalStyles";

const EmptyList = ({ text }) => {
  let arr = [];
  if (text && !Array.isArray(text)) {
    arr[0] = text;
  } else {
    arr = text;
  }

  return (
    <View style={[styles.container]}>
      {arr.map((value, index) => {
        return (
          <Text key={index} style={[globalStyles.emptyList, styles.padding]}>
            {value}
          </Text>
        );
      })}

      <Image
        source={require("../assets/no-task.png")}
        style={[styles.image]}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // borderWidth: 2,
    // gap: 50,
  },
  image: {
    marginVertical: 40,
    width: 150,
    height: 150,
  },
  padding: {
    marginBottom: 10,
  },
});

export default EmptyList;
