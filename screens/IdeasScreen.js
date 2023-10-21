import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EMPTY_PERSON } from "../util/constants";
import { colors, globalStyles } from "../styles/globalStyles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { EmptyList, GiftListItem, ListSeparatorComponent } from "../components";
import { useRoute } from "@react-navigation/native";
import _ from "lodash";
import { Text } from "react-native-paper";

const IdeasScreen = () => {
  const insets = useSafeAreaInsets();

  const { findPerson, setCurrentPersonId, people } = useApp();
  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [refreshing, setRefreshing] = useState(false);
  const { personId } = useRoute().params;

  const reloadGiftList = () => {
    const foundPerson = findPerson(personId);

    // setCurrentPersonId(foundPerson ? foundPerson.id : ""); //needed for add-gift page

    if (foundPerson) {
      setPerson(_.cloneDeep(foundPerson));
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    reloadGiftList();
    setRefreshing(false);
  }, [people]);

  useEffect(() => {
    reloadGiftList();
  }, [people]);

  useEffect(() => {
    setCurrentPersonId(personId);
  }, [personId]);

  const renderItem = (item) => {
    return <GiftListItem gift={item} personId={personId} />;
  };

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
      <View style={{ flexDirection: "row" }}>
        <Text style={[globalStyles.screenTitle]}>
          Gifts for{" "}
          <Text style={[globalStyles.screenTitle, globalStyles.primaryColor]}>
            {person.name}
          </Text>
        </Text>
      </View>
      <View style={[globalStyles.line]}></View>
      <View style={[globalStyles.screenContent]}>
        <FlatList
          data={person.gifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
          style={[globalStyles.peopleList, { paddingVertical: 30 }]}
          ItemSeparatorComponent={<ListSeparatorComponent />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary_light}
            />
          }
          ListEmptyComponent={
            <EmptyList useCakeIcon={true}>
              <Text style={[globalStyles.emptyListText, styles.padding]}>
                {`No gift ideas for yet ${person.name} yet?`}
              </Text>
            </EmptyList>
          }
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default IdeasScreen;
