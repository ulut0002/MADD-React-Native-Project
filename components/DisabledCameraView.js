import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const DisabledCameraView = () => {
  return (
    <View style={styles.container}>
      <Feather name="camera-off" size={64} color="black" />
      <Text>If you are on your mobile device, you must grant permission</Text>
      <Text>
        If you are working on the iOS simulator, you must run the app on a
        physical device
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default DisabledCameraView;
