import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useApp } from "../context/appContext";

const EdtiPersonButton = () => {
  const { currentPersonId } = useApp();
  return (
    <View>
      <Pressable onPress={() => {}}></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EdtiPersonButton;
