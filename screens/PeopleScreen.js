import React from "react";
import { View, StyleSheet, Text, FlatList, Button } from "react-native";
import { useApp } from "../context/appContext";
import EmptyList from "../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const PeopleScreen = () => {
  const { people } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderItem = (item) => {
    // implement
  };

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

      <Button
        title="Add (TODO)"
        onPress={() => {
          navigation.navigate("AddPeople");
        }}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PeopleScreen;
