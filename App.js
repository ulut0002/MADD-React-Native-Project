import { StyleSheet } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, ActivityIndicator } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
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

// Extracted Navigation Options
const getPeopleScreenOptions = ({ navigation }) => ({
  headerRight: () => Platform.OS === "ios" && <IOSAddPersonButton />,
});

const getAddPeopleScreenOptions = ({ route }) => ({
  title: route.params && route.params.personId ? "Edit Person" : "Add Person",
});

const getIdeasScreenOptions = ({ navigation }) => ({
  headerRight: () => Platform.OS === "ios" && <IOSAddIdeaButton />,
});

const getAddIdeaScreenOptions = ({ route }) => ({
  title: route.params && route.params.giftId ? "Edit Idea" : "Add Idea",
});

const loadFonts = async () => {
  try {
    await Font.loadAsync({
      "StickNoBills-Bold": require("./assets/fonts/StickNoBills-Bold.ttf"),
    });
  } catch (error) {
    console.error("Error loading fonts:", error);
  }
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
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
                  options={getPeopleScreenOptions}
                />
                <Stack.Screen
                  name="AddPeople"
                  component={AddPeopleScreen}
                  options={getAddPeopleScreenOptions}
                />
                <Stack.Screen
                  name="Ideas"
                  component={IdeasScreen}
                  options={getIdeasScreenOptions}
                />
                <Stack.Screen
                  name="AddIdea"
                  component={AddIdeaScreen}
                  options={getAddIdeaScreenOptions}
                />
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
