import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Button,
  PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
// import { useFonts } from "expo-font";
import * as Font from "expo-font";

import {
  AddIdeaScreen,
  AddPeopleScreen,
  IdeasScreen,
  PeopleScreen,
} from "./screens";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IOSAddPersonButton, IOSAddIdeaButton } from "./components";
import { useEffect, useState } from "react";

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   "StickNoBills-Bold": require("./assets/fonts/StickNoBills-Bold.ttf"),
  // });

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "StickNoBills-Bold": require("./assets/fonts/StickNoBills-Bold.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        // Handle font loading error
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);

  const Stack = createNativeStackNavigator();

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <PaperProvider>
          <NavigationContainer>
            <AppProvider>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={PeopleScreen}
                  options={({ navigation }) => ({
                    headerRight: () =>
                      Platform.OS === "ios" ? <IOSAddPersonButton /> : null,
                  })}
                ></Stack.Screen>
                <Stack.Screen
                  name="AddPeople"
                  component={AddPeopleScreen}
                  options={({ route }) => {
                    const personId = route.params && route.params.personId;
                    return {
                      title: personId ? "Edit Person" : "Add Person",
                    };
                  }}
                ></Stack.Screen>
                <Stack.Screen
                  name="Ideas"
                  component={IdeasScreen}
                  options={({ navigation }) => ({
                    headerRight: () =>
                      Platform.OS === "ios" ? <IOSAddIdeaButton /> : null,
                  })}
                ></Stack.Screen>
                <Stack.Screen
                  name="AddIdea"
                  component={AddIdeaScreen}
                  options={({ route }) => {
                    const giftId = route.params && route.params.giftId;
                    return {
                      title: giftId ? "Edit Idea" : "Add Idea",
                    };
                  }}
                ></Stack.Screen>
              </Stack.Navigator>
            </AppProvider>
          </NavigationContainer>
        </PaperProvider>
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
