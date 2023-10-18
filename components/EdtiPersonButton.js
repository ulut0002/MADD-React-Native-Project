import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useApp } from "../context/appContext";

const EdtiPersonButton = () => {
  const { currentPersonId } = useApp();
  return (
    <View>
      <Pressable
        onPress={() => {
          console.log("currentpersonId");
        }}
      ></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EdtiPersonButton;
