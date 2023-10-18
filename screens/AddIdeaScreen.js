import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import { Button, TextInput } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DisabledCameraView } from "../components";
import { EMPTY_GIFT, GIFT_IDEA_VIEW_MODE } from "../util/constants";

/*
1. Add new gift idea: giftId=falsy, preview=false
2. View existing gift idea: giftId=truthy, preview=true
3. Update existing gift idea: giftId=truthy, preview=false
*/

const AddIdeaScreen = ({ giftId, preview = false }) => {
  const { currentPersonId } = useApp();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);
  const [mode, setMode] = useState(GIFT_IDEA_VIEW_MODE.NEW);
  const [cameraPermission, setCameraPermission] = useState(null);

  const { people, findPerson, addGift, deleteGift, updateGift } = useApp();

  const [idea, setIdea] = useState({ ...EMPTY_GIFT });

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (giftId && currentPersonId) {
      if (preview) {
        setMode(GIFT_IDEA_VIEW_MODE.PREVIEW);
      } else {
        setMode(GIFT_IDEA_VIEW_MODE.EDIT);
      }
    }
  }, [giftId, currentPersonId]);

  const checkCameraPermission = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();

    if (status === "granted") {
      setCameraPermission(true);
    } else if (status === "undetermined") {
      setCameraPermission(false);
    } else {
      setCameraPermission(false);
    }
  };

  const shouldShowCamera = () => {
    return (
      cameraPermission &&
      (mode === GIFT_IDEA_VIEW_MODE.EDIT || mode === GIFT_IDEA_VIEW_MODE.NEW)
    );
  };

  const shouldShowPreview = () => {
    return cameraPermission && mode === GIFT_IDEA_VIEW_MODE.PREVIEW;
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        styles.container,
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={[globalStyles.screenTitle]}> New Idea</Text>
      <TextInput
        placeholder="Idea"
        label={"Gift idea"}
        value={idea.text}
        onChangeText={(text) => {
          setIdea({ ...idea, text });
        }}
        autoCapitalize="none"
        autoCorrect={true}
      ></TextInput>
      <View style={styles.camera}>
        {shouldShowCamera() && (
          <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        )}

        {shouldShowPreview() && <Text>Preview Mode</Text>}
        {!cameraPermission && <DisabledCameraView />}
      </View>
      {mode === GIFT_IDEA_VIEW_MODE.NEW && (
        <Button
          onPress={() => {
            addGift(idea);
          }}
        >
          Add
        </Button>
      )}
      {mode === GIFT_IDEA_VIEW_MODE.EDIT && (
        <Button
          onPress={() => {
            updateGift({ ...idea });
          }}
        >
          Save
        </Button>
      )}
      {mode === GIFT_IDEA_VIEW_MODE.PREVIEW && (
        <Button
          onPress={() => {
            console.log("change current screen");
          }}
        >
          Edit
        </Button>
      )}

      {(mode === GIFT_IDEA_VIEW_MODE.EDIT ||
        mode === GIFT_IDEA_VIEW_MODE.PREVIEW) && (
        <Button
          onPress={() => {
            deleteGift({ ...idea });
          }}
        >
          Delete
        </Button>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddIdeaScreen;
