import React from "react";
import { View } from "react-native";
import { useApp } from "../context/appContext";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { Button, Text } from "react-native-paper";

const IOSAddPersonButton = () => {
  const { setCurrentPersonId } = useApp();
  const navigation = useNavigation();

  return (
    <View>
      <Button
        onPress={() => {
          setCurrentPersonId(null);
          navigation.navigate("AddPeople", { personId: null });
        }}
      >
        <Text style={[globalStyles.toolbarButton]}>Add Person</Text>
      </Button>
    </View>
  );
};

export default IOSAddPersonButton;
