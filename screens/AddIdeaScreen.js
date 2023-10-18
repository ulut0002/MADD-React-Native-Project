import React, { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import { Button, TextInput } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DisabledCameraView } from "../components";
import { EMPTY_GIFT } from "../util/constants";
import { useNavigation, useRoute } from "@react-navigation/native";

/*
1. Add new gift idea: giftId=falsy, preview=false
2. View existing gift idea: giftId=truthy, preview=true
3. Update existing gift idea: giftId=truthy, preview=false
*/

/**
 
image
original image: 
draftImage : take another picture, cancel : (only draft image changes)
mode: Live, Preview
if .image is not there, then it is Live mode by default. Initially the draft is blank. If draft is availanle

 User opens the screen: 
  - If there is an .image, display the image with a button "take new picture"
  - if there is no image, display the live camera with a button "take picture"
  - if there is an .image, and user had clicked on the "take image", then show the live window with two buttons. "Take picture" and "cancel": if user takes the picture, then display the newly taken image, and display two buttons "Use this", "Take another one"
 */

const CAMERA_MODE = {
  LIVE: "LIVE",
  PREVIEW: "PREVIEW",
  DRAFT_LIVE: "DRAFT_LIVE",
  DRAFT_PREVIEW: "DRAFT_PREVIEW",
};

const AddIdeaScreen = () => {
  const { currentPersonId } = useApp();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);

  const [currentImageMode, setCurrentImageMode] = useState(CAMERA_MODE.LIVE);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const navigation = useNavigation();
  const { giftId, preview = false } = useRoute().params;

  const { addGift, deleteGift, updateGift, findGift } = useApp();

  const [idea, setIdea] = useState({ ...EMPTY_GIFT });
  const [image, setImage] = useState("");
  const [draftImage, setDraftImage] = useState("");
  const cameraRef = useRef(null); // Create a ref for the Camera component

  useEffect(() => {
    checkCameraPermission();
    console.log("permission", permission);
  }, []);

  useEffect(() => {
    if (giftId && currentPersonId) {
      const foundGift = findGift(currentPersonId, giftId);
      if (foundGift) {
        setIdea({ ...foundGift });
        if (foundGift.image) {
          setImage(foundGift.image);
          setCurrentImageMode(CAMERA_MODE.PREVIEW);
        } else {
          setImage("");
          setCurrentImageMode(CAMERA_MODE.LIVE);
        }
      } else {
        // this is an error
        console.error("What a mess");
      }
      // get the gift
    }
  }, []);

  const takePicture = async () => {
    if (cameraPermission) {
      if (cameraRef.current) {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          pictureSize: "1200x1800",
          imageType: "jpg",
          skipProcessing: false,
        });
        setDraftImage(data.uri);
      }
    }
  };

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log("camera status", status);

    if (status === "granted") {
      setCameraPermission(true);
    } else if (status === "undetermined") {
      setCameraPermission(false);
    } else {
      setCameraPermission(false);
    }
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
      <View>
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
          returnKeyType="next"
        ></TextInput>
      </View>

      <View style={styles.cameraContainer}>
        {currentImageMode === CAMERA_MODE.LIVE && (
          <React.Fragment>
            {cameraPermission && (
              <View style={{ marginTop: 20 }}>
                <View style={{ flex: 1 }}>
                  <Camera style={[styles.camera]} type={type} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraType}
                      >
                        <Text style={styles.text}>Flip Camera</Text>
                      </TouchableOpacity>
                    </View>
                  </Camera>
                </View>
                <Button
                  onPress={async () => {
                    //take the shot and go into draft_preview mode
                    console.log("take a shot and go into draft_preview mode");
                    try {
                      await takePicture();
                      setCurrentImageMode(CAMERA_MODE.DRAFT_PREVIEW);
                    } catch (error) {
                      console.warn(error);
                    }
                  }}
                >
                  Take a shot
                </Button>
              </View>
            )}

            {!cameraPermission && (
              <Text>Sorry buddy. You don't have access to your camera</Text>
            )}
          </React.Fragment>
        )}

        {currentImageMode === CAMERA_MODE.DRAFT_PREVIEW && (
          <View>
            {draftImage && (
              <View>
                <Text>Display the Draft image</Text>
                <Image
                  source={{ uri: draftImage }}
                  style={{ width: 100, height: 100 }}
                ></Image>
                <Button
                  onPress={() => {
                    console.log("clean the draft image and change the mode");
                    setDraftImage("");
                    if (image) {
                      setCurrentImageMode(CAMERA_MODE.DRAFT_LIVE);
                    } else {
                      setCurrentImageMode(CAMERA_MODE.LIVE);
                    }
                  }}
                >
                  Take a another shot
                </Button>
                <Button
                  onPress={() => {
                    const savedImg = draftImage;
                    setDraftImage("");
                    setImage(savedImg);
                    setCurrentImageMode(CAMERA_MODE.PREVIEW);
                  }}
                >
                  Use the photo
                </Button>
              </View>
            )}

            {!draftImage && <View>Sorry but there is an error</View>}
          </View>
        )}

        {currentImageMode === CAMERA_MODE.DRAFT_LIVE && (
          <View>
            {cameraPermission && (
              <View>
                <Text>Display Live image again</Text>
                <Button
                  onPress={() => {
                    console.log("clean the draft image and change the mode");
                  }}
                >
                  Take a shot
                </Button>
                <Button>Cancel</Button>
              </View>
            )}

            {!cameraPermission && <View>Sorry buddy</View>}
          </View>
        )}

        {currentImageMode === CAMERA_MODE.PREVIEW && (
          <View>
            {image && (
              <View>
                <Text>Display the image</Text>
              </View>
            )}
            {!image && (
              <View>
                <Text>Error condition</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 40,
  },
  cameraContainer: {
    // flex: 1, // This ensures that it takes up the available space
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 400,
    alignSelf: "center",
    // borderWidth: 2,
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
