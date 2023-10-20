import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./context/appContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, PaperProvider, DefaultTheme } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import * as SplashScreen from "expo-splash-screen";

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

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f2d072",
    secondary: "#040610",
    accent: "#bb443e",
    background: "blue",
  },
};

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    // prepare();
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppProvider>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="Home"
                  component={PeopleScreen}
                  options={({ navigation }) => ({
                    headerRight: () =>
                      Platform.OS ? <IOSAddPersonButton /> : null,
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
