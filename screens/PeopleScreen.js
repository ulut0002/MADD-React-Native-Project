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
import { Button, withTheme } from "react-native-paper";
import {
  ListSeparatorComponent,
  ModalAlert,
  PersonListItem,
} from "../components";
import globalStyles from "../styles/globalStyles";

const PeopleScreen = () => {
  const { people, loadFromStorage } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [localPeople, setLocalPeople] = useState(people);

  useEffect(() => {
    setLocalPeople(people);
  }, [people]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadFromStorage();
    setRefreshing(false);
  }, [people]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const renderItem = (item) => {
    return <PersonListItem person={item} />;
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
      <Text style={[globalStyles.screenTitle]}>Your List</Text>

      <FlatList
        data={localPeople}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => renderItem(item)}
        style={[globalStyles.peopleList]}
        ItemSeparatorComponent={<ListSeparatorComponent />}
        ListEmptyComponent={
          <EmptyList text={["Your list is empty.", "Press + to add people"]} />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      ></FlatList>

      <ModalAlert />

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

export default withTheme(PeopleScreen);
