import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AddIdeaScreen,
  AddPeopleScreen,
  IdeaScreen,
  PeopleScreen,
} from "./screens";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={PeopleScreen}></Stack.Screen>
          <Stack.Screen
            name="AddPeople"
            component={AddPeopleScreen}
          ></Stack.Screen>
          <Stack.Screen name="Idea" component={IdeaScreen}></Stack.Screen>
          <Stack.Screen name="AddIdea" component={AddIdeaScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
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
