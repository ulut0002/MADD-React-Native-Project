import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, PaperProvider } from "react-native-paper";

import {
  AddIdeaScreen,
  AddPeopleScreen,
  IdeaScreen,
  PeopleScreen,
} from "./screens";
import { Platform } from "react-native";

export default function App({ navigation }) {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <AppProvider>
        <PaperProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={PeopleScreen}
              options={({ navigation }) => ({
                headerRight: () =>
                  Platform.OS ? (
                    <Button
                      icon={"plus"}
                      onPress={() => {
                        navigation.navigate("AddPeople");
                      }}
                    ></Button>
                  ) : null,
              })}
            ></Stack.Screen>
            <Stack.Screen
              name="AddPeople"
              component={AddPeopleScreen}
            ></Stack.Screen>
            <Stack.Screen name="Idea" component={IdeaScreen}></Stack.Screen>
            <Stack.Screen
              name="AddIdea"
              component={AddIdeaScreen}
            ></Stack.Screen>
          </Stack.Navigator>
        </PaperProvider>
      </AppProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
