import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";

import {
  AddIdeaScreen,
  AddPeopleScreen,
  IdeasScreen,
  PeopleScreen,
} from "./screens";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IOSAddButton, IOSAddIdeaButton, ModalAlert } from "./components";

export default function App({ navigation }) {
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <NavigationContainer>
          <AppProvider>
            <PaperProvider>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={PeopleScreen}
                  options={({ navigation }) => ({
                    headerRight: () => (Platform.OS ? <IOSAddButton /> : null),
                  })}
                ></Stack.Screen>
                <Stack.Screen
                  name="AddPeople"
                  component={AddPeopleScreen}
                ></Stack.Screen>
                <Stack.Screen
                  name="Ideas"
                  component={IdeasScreen}
                  options={({ navigation }) => ({
                    headerRight: () =>
                      Platform.OS ? <IOSAddIdeaButton /> : null,
                  })}
                ></Stack.Screen>
                <Stack.Screen
                  name="AddIdea"
                  component={AddIdeaScreen}
                ></Stack.Screen>
              </Stack.Navigator>
            </PaperProvider>
          </AppProvider>
        </NavigationContainer>
      </RootSiblingParent>
    </GestureHandlerRootView>
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
<Button
  icon={"plus"}
  onPress={() => {
    navigation.navigate("AddPeople", {});
  }}
></Button>;
