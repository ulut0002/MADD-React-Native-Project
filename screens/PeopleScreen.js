import React, { useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Platform } from "react-native";
import { useApp } from "../context/appContext";
import EmptyList from "../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button, Modal } from "react-native-paper";
import { ModalAlert, PersonListItem } from "../components";

const PeopleScreen = () => {
  const { people, dataLoading, setModalVisible, setPersonToDelete } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderItem = (item) => {
    return <PersonListItem id={item.id} />;
    // return <Text>AAA</Text>;
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
      <ModalAlert />
      <Button
        title="Show Modal"
        onPress={() => {
          // setModalVisible(true);
          // setPersonToDelete(Date.now());
        }}
      >
        Show Modal
      </Button>
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
