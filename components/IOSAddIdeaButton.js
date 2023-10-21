import React from "react";
import { View } from "react-native";
import { useApp } from "../context/appContext";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { Button, Text } from "react-native-paper";

const IOSAddIdeaButton = () => {
  const navigation = useNavigation();
  const { currentPersonId, setCurrentPersonId } = useApp();

  return (
    <View>
      <Button
        onPress={() => {
          navigation.navigate("AddIdea", { giftId: "" });
        }}
      >
        <Text style={[globalStyles.toolbarButton]}>Add Idea</Text>
      </Button>
    </View>
  );
};

export default IOSAddIdeaButton;
