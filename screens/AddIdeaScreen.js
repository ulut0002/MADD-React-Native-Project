import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const MODE = {
  SHOW_REAL_IMAGE: "SHOW_REAL_IMAGE",
  SHOW_LIVE_CAMERA: "SHOW_LIVE_CAMERA",
  SHOW_DRAFT_IMAGE: "SHOW_DRAFT_IMAGE",
};

const AddIdeaScreen = () => {
  const { currentPersonId } = useApp();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);
  const [mode, setMode] = useState(MODE.SHOW_REAL_IMAGE);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const { giftId } = useRoute().params;

  const { addGift, deleteGift, findGift } = useApp();

  const [idea, setIdea] = useState({ ...EMPTY_GIFT });

  // Images are stored in a ref variable because:
  // async takePhoto() used to call setImage or setDraftImage functions
  // and when the page was re-rendered, image and draftImage variables didn't have the most up to date value
  const draftImageRef = useRef("");
  const imageRef = useRef("");

  useEffect(() => {
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
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (giftId && currentPersonId) {
      const foundGift = findGift(currentPersonId, giftId);
      if (foundGift) {
        draftImageRef.current = "";
        if (foundGift.image) {
          imageRef.current = foundGift.image;
          setMode(MODE.SHOW_REAL_IMAGE);
        } else {
          imageRef.current = "";
          console.log("aaa");
          setMode(MODE.SHOW_LIVE_CAMERA);
        }
        setIdea({ ...foundGift });
      } else {
        // this is an error
        console.error("What a mess");
      }
      // get the gift
    } else {
      setMode(MODE.SHOW_LIVE_CAMERA);
    }
  }, [giftId, currentPersonId]);

  const cameraComponent = useMemo(() => {
    if (cameraPermission) {
      return (
        <Camera
          style={[styles.imageLiveCameraContainer]}
          type={type}
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <MaterialIcons
                name="flip-camera-ios"
                size={32}
                color="white"
                style={styles.flipCameraIcon}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      );
    }
    return (
      <View>
        <Text>Sorry buddy. You don't have access to your camera</Text>
      </View>
    );
  }, [cameraPermission, type, toggleCameraType]);

  const takePicture = async () => {
    if (cameraPermission) {
      let sizes = [];
      try {
        sizes = await camera.getAvailablePictureSizesAsync();
        console.log("sizes: ", sizes);
      } catch (error) {
        console.warn(error);
      }

      const data = await camera.takePictureAsync({
        quality: 0.8,
        pictureSize: sizes ? sizes[0] : "1200x1800",
        imageType: "jpg",
        skipProcessing: false,
      });

      draftImageRef.current = data.uri;
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

      <View style={styles.mediaContainer}>
        {/**
          SHOW_LIVE_CAMERA:
          1) Taking picture for an item with no existing image (imageRef.current = false)
          2) Taking a picture as a replacement to an existing image
    */}
        {mode === MODE.SHOW_LIVE_CAMERA && (
          <View>
            {cameraPermission && (
              <View>
                {cameraComponent}
                <Button
                  onPress={async () => {
                    try {
                      await takePicture();
                      setMode(MODE.SHOW_DRAFT_IMAGE);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Take a Picture
                </Button>
                {imageRef.current && (
                  <Button
                    onPress={() => {
                      setMode(MODE.SHOW_REAL_IMAGE);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </View>
            )}

            {!cameraPermission && <DisabledCameraView />}
          </View>
        )}

        {mode == MODE.SHOW_DRAFT_IMAGE && (
          <View>
            {draftImageRef && (
              <Image
                source={{ uri: draftImageRef.current }}
                style={styles.imageLiveCameraContainer}
              ></Image>
            )}

            <Button
              onPress={async () => {
                draftImageRef.current = "";
                setMode(MODE.SHOW_LIVE_CAMERA);
              }}
            >
              Try again!
            </Button>

            {imageRef.current && (
              <Button
                onPress={async () => {
                  draftImageRef.current = "";
                  setMode(MODE.SHOW_REAL_IMAGE);
                }}
              >
                Cancel
              </Button>
            )}
          </View>
        )}

        {mode === MODE.SHOW_REAL_IMAGE && (
          <View>
            {imageRef.current && (
              <Image
                source={{ uri: imageRef.current }}
                style={styles.imageLiveCameraContainer}
              ></Image>
            )}
            <Button
              onPress={() => {
                setMode(MODE.SHOW_LIVE_CAMERA);
              }}
            >
              Replace Image
            </Button>
          </View>
        )}

        {mode === MODE.SHOW_DRAFT_IMAGE && (
          <Button
            disabled={!idea.text}
            onPress={() => {
              addGift({
                text: idea.text,
                id: giftId,
                image: draftImageRef.current,
              });
            }}
          >
            Save
          </Button>
        )}

        {mode === MODE.SHOW_REAL_IMAGE && (
          <Button
            disabled={!idea.text}
            onPress={() => {
              // return;
              addGift({
                text: idea.text,
                id: giftId,
                image: imageRef.current,
              });
            }}
          >
            Save
          </Button>
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

  mediaContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 20,
  },

  imageLiveCameraContainer: {
    width: 300,
    height: 400,
  },

  cameraContainer: {
    // flex: 1, // This ensures that it takes up the available space
    // borderWidth: 2,
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 400,
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  button: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  flipCameraIcon: {
    padding: 10,
  },
});

export default AddIdeaScreen;
