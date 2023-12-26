import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  RefreshControl,
} from "react-native";
import { useApp } from "../context/appContext";
import EmptyList from "../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { ListSeparatorComponent, PersonListItem } from "../components";
import { colors, globalStyles } from "../styles/globalStyles";

// Functional component representing the main screen for managing a list of people.
const PeopleScreen = () => {
  // Destructure state and functions from the app context, SafeAreaInsets, and Navigation.
  const { people, loadFromStorage } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State to manage pull-to-refresh functionality.
  const [refreshing, setRefreshing] = useState(false);

  // State to manage local copy of people data.
  const [localPeople, setLocalPeople] = useState(people);

  // Effect to update localPeople when the main people data changes.
  useEffect(() => {
    setLocalPeople(people);
  }, [people]);

  // Callback function for pull-to-refresh action.
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadFromStorage();
    setRefreshing(false);
  }, [people]);

  // Effect to load data from storage on component mount.
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Callback function to render individual items in the FlatList.
  const renderItem = React.useCallback(({ item }) => {
    return <PersonListItem person={item} />;
  }, []);

  // JSX structure for the PeopleScreen component.
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        globalStyles.screen,
      ]}
    >
      {/* Header displaying the title of the screen. */}
      <Text style={[styles.header]}>Lucky People</Text>

      {/* Horizontal line separating the header from the content. */}
      <View style={[globalStyles.line]}></View>

      {/* Main content area including a FlatList to display the list of people. */}
      <View style={[globalStyles.screenContent]}>
        <FlatList
          data={localPeople}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderItem(item)}
          style={[styles.list]}
          ItemSeparatorComponent={<ListSeparatorComponent />}
          // Component to display when the list is empty.
          ListEmptyComponent={
            <EmptyList>
              <Text style={[styles.emptyListText]}>
                Your gift list is empty.
              </Text>
              <Text style={[styles.emptyListText]}>
                Add some birthday buddies and let's get this party started!
              </Text>
            </EmptyList>
          }
          // Pull-to-refresh functionality.
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary_light}
            />
          }
        ></FlatList>

        {/* Floating Action Button (FAB) to add a new person, visible only on Android. */}
        {Platform.OS === "android" && (
          <FAB
            icon="plus"
            style={globalStyles.fab}
            label="Add Person"
            onPress={() => {
              navigation.navigate("AddPeople", {});
            }}
          />
        )}
      </View>
    </View>
  );
};

// Styles for the PeopleScreen component.
const styles = StyleSheet.create({
  header: {
    ...globalStyles.screenTitle,
    ...globalStyles.screenTitleStickNoBills,
  },

  list: {
    ...globalStyles.peopleList,
    paddingVertical: 30,
    // paddingHorizontal: 10,
  },

  emptyListText: {
    ...globalStyles.emptyListText,
  },
});

// Export the PeopleScreen component as the default export.
export default PeopleScreen;
