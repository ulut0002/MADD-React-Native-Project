import React, { useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Platform } from "react-native";
import { useApp } from "../context/appContext";
import EmptyList from "../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

const PeopleScreen = () => {
  const { people, dataLoading } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("people", people);
    for (let index = 0; index < people.length; index++) {
      const element = people[index];
      console.log(element);
    }
  }, [people]);

  const renderItem = (item) => {
    return <Text>{item.id}</Text>;
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
      {dataLoading && <Text>Loading</Text>}

      <FlatList
        data={people}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => renderItem(item)}
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
