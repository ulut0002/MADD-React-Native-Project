import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EMPTY_PERSON } from "../util/constants";
import { colors, globalStyles } from "../styles/globalStyles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { EmptyList, GiftListItem, ListSeparatorComponent } from "../components";
import { useRoute } from "@react-navigation/native";
import _ from "lodash";
import { FAB, Text } from "react-native-paper";

// Component for displaying gift ideas for a person

const IdeasScreen = ({ navigation }) => {
  // Get safe area insets for handling device notch and status bar
  const insets = useSafeAreaInsets();

  // Use context to access app state and functions
  const { findPerson, setCurrentPersonId, people } = useApp();

  // State to manage the person and gift list
  const [person, setPerson] = useState({ ...EMPTY_PERSON });

  // State for managing refresh status
  const [refreshing, setRefreshing] = useState(false);

  // Extract personId from the navigation route parameters
  const { personId } = useRoute().params;

  // Function to reload the gift list for the current person
  const reloadGiftList = React.useCallback(() => {
    const foundPerson = findPerson(personId);

    if (foundPerson) {
      setPerson(JSON.parse(JSON.stringify(foundPerson)));
    }
  }, [findPerson, personId]);

  // Effect to reload the gift list when the people data changes
  useEffect(() => {
    reloadGiftList();
  }, [people]);

  // Effect to update the current person ID when it changes
  useEffect(() => {
    setCurrentPersonId(personId);
  }, [personId]);

  // Function to render each item in the FlatList
  const renderItem = React.useCallback(
    (item) => {
      return <GiftListItem gift={item} personId={personId} />;
    },
    [personId]
  );

  // Function to handle manual refresh of the gift list
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    reloadGiftList();
    setRefreshing(false);
  }, [reloadGiftList, people]);

  // Function to navigate to the "AddIdea" screen with the current personId
  const navigateToAddIdea = React.useCallback(() => {
    navigation.navigate("AddIdea", { personId: personId });
  }, [navigation, personId]);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header displaying the person's name */}
      <View style={globalStyles.row}>
        <Text style={[globalStyles.screenTitle]}>
          Gifts for <Text style={[styles.nameStyle]}>{person.name}</Text>
        </Text>
      </View>

      {/* Separator line */}
      <View style={[globalStyles.line]}></View>

      {/* Gift list content */}
      <View style={[globalStyles.screenContent]}>
        <FlatList
          data={person.gifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
          style={[styles.listStyle]}
          ItemSeparatorComponent={<ListSeparatorComponent />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary_light}
            />
          }
          // Empty list message when there are no gift ideas
          ListEmptyComponent={
            <EmptyList useCakeIcon={true}>
              <Text style={[styles.emptyListStyle]}>
                {`No gift ideas for ${person.name} yet?`}
              </Text>
            </EmptyList>
          }
        ></FlatList>
      </View>

      {/* FAB (Floating Action Button) for adding a new gift */}
      {Platform.OS === "android" && (
        <FAB
          icon="plus"
          style={globalStyles.fab}
          label="Add Gift"
          onPress={navigateToAddIdea}
        />
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  nameStyle: {
    ...globalStyles.screenTitle,
    ...globalStyles.primaryColor,
  },

  listStyle: {
    ...globalStyles.peopleList,
    paddingVertical: 30,
  },

  emptyListStyle: {
    ...globalStyles.emptyListText,
  },
});

export default IdeasScreen;
