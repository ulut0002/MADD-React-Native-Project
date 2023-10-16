import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "../context/appContext";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const IOSAddButton = () => {
  const { setCurrentPerson, resetCurrentPerson } = useApp();
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        resetCurrentPerson(null);
        navigation.navigate("AddPeople", {});
      }}
    >
      Add Person
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default IOSAddButton;
