// source: https://snack.expo.dev/

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image, Modal } from "react-native";
import { useApp } from "../context/appContext";
import { DateTime } from "luxon";

import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import { EMPTY_GIFT } from "../util/constants";

import SwipeableGiftRow from "./SwipeableGiftRow";
import { Avatar, Button, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
// source: https://dribbble.com/shots/16577502-Mobile-List-UI

const GiftListItem = ({ gift, personId }) => {
  const navigation = useNavigation();
  const { deleteGiftWithConfirm } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 300, height: 400 });

  useEffect(() => {
    if (gift.image) {
      const size = Image.getSize(gift.image, (width, height) => {
        if (height !== 0 && width !== 0) {
          const defaultImageWidth = 300;
          const imageHeight = Math.ceil(defaultImageWidth * (height / width));
          setImageSize({ width: defaultImageWidth, height: imageHeight });
        } else {
        }
      });
    }
  }, []);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!gift.image && (
              <Text style={styles.modalText}>
                You haven't saved a picture for this gift idea yet.
              </Text>
            )}

            {gift.image && (
              <Image
                source={{ uri: gift.image }}
                style={{ width: imageSize.width, height: imageSize.height }}
              ></Image>
            )}

            <Button
              style={[globalStyles.button, globalStyles.lightButton]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>

      <Pressable
        onPress={() => {
          navigation.navigate("AddIdea", { giftId: gift.id });
        }}
      >
        <View style={[styles.container]}>
          <View style={{ flexDirection: "row", flex: 1, gap: 10 }}>
            {gift.image && (
              <Pressable
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Image
                  source={{ uri: gift.image }}
                  style={{ width: 50, height: 50 }}
                ></Image>
              </Pressable>
            )}

            {!gift.image && (
              <MaterialIcons
                name="image-not-supported"
                size={50}
                color="black"
              />
            )}

            <Text style={[styles.name]}>{gift.text || "Unnamed"}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 0 }}>
            <Button
              onPress={async () => {
                deleteGiftWithConfirm({ giftId: gift.id, personId: personId })
                  .then(() => {})
                  .catch((err) => {});
              }}
            >
              <View style={styles.deleteButton}>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color="black"
                  style={[{ alignSelf: "center" }, globalStyles.danger]}
                />
                <Text
                  style={[styles.deleteColor, { color: globalStyles.danger }]}
                >
                  Delete
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 12,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  deleteButton: {
    color: globalStyles.danger,
    alignSelf: "center",
    textAlign: "center",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },

  deleteColor: {
    color: globalStyles.danger,
  },

  row: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  column: {
    flexDirection: "column",
    alignContent: "center",
  },

  name: {
    fontWeight: "bold",
    fontSize: 22,
    paddingTop: 8,
  },

  dobContainer: {
    paddingBottom: 8,
    flexDirection: "row",
    gap: 24,
  },
});

export default GiftListItem;
