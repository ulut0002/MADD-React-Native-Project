import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { globalStyles, colors } from "../styles/globalStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EmptyList = ({ children, useCakeIcon }) => {
  //TODO: Change this to "children"

  return (
    <View style={[styles.container]}>
      {!useCakeIcon && (
        <FontAwesome5
          name="sad-tear"
          size={32}
          color="black"
          style={styles.icon}
        />
      )}

      {useCakeIcon && (
        <FontAwesome5
          name="gifts"
          size={32}
          color="black"
          style={styles.icon}
        />
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    flexDirection: "column",
    gap: 32,
  },
  icon: { fontSize: 74, color: colors.accent },
  image: {
    marginVertical: 40,

    width: 150,
    height: 150,
    // color: colors.accent,
  },
  padding: {
    // marginBottom: 10,
  },
  text: {
    textAlign: "center",
  },
});

export default EmptyList;
