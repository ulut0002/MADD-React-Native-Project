import React, { useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Platform } from "react-native";
import { useApp } from "../context/appContext";
import EmptyList from "../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

const PeopleScreen = () => {
  const { people } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderItem = (item) => {
    // implement
    console.log("item", item);
    return item.id;
  };

  useEffect(() => {
    console.log("people", people);
  }, [people]);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <Text>People</Text>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyList text={"Press + to add people"} />}
      ></FlatList>

      {/* TODO: FOB button*/}
      {!Platform.OS && (
        <Button
          title="Add (TODO)"
          onPress={() => {
            navigation.navigate("AddPeople");
          }}
        >
          Add (TODO)
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default PeopleScreen;
