import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EMPTY_PERSON } from "../util/constants";
import globalStyles from "../styles/globalStyles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { EmptyList, GiftListItem, ListSeparatorComponent } from "../components";

const IdeasScreen = ({ personId }) => {
  const insets = useSafeAreaInsets();

  const { currentPersonId, findPerson, people } = useApp();
  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {};

  useEffect(() => {
    const foundPerson = findPerson(currentPersonId);
    if (foundPerson) {
      setPerson({ ...foundPerson });
    }
  }, [currentPersonId, people]);

  const renderItem = (item) => {
    return <GiftListItem gift={item} />;
    // return <Text>Item</Text>;
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={[globalStyles.screenTitle]}>
        Gift Ideas for {person.name}
      </Text>
      <FlatList
        data={person.gifts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderItem(item)}
        ItemSeparatorComponent={<ListSeparatorComponent />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyList text={[`You have no gift ideas for ${person.name}`]} />
        }
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({});

export default IdeasScreen;
