import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const IOSAddIdeaButton = () => {
  //const {} = useApp();
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.navigate("AddIdea", {});
      }}
    >
      Add Idea
    </Button>
  );
};

const styles = StyleSheet.create({});

export default IOSAddIdeaButton;
