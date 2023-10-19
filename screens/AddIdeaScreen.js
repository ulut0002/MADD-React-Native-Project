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
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

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
  NEW: "NEW", // for ideas without an existing image
  DRAFT_NEW: "DRAFT_NEW", // when user takes an image for an idea that has no image
  PREVIEW: "PREVIEW", // for actual image
  DRAFT_PREVIEW: "DRAFT_PREVIEW", // when user wants to replace the image
};

const AddIdeaScreen = () => {
  const { currentPersonId } = useApp();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);

  const [currentImageMode, setCurrentImageMode] = useState(CAMERA_MODE.NEW);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const navigation = useNavigation();
  const { giftId, preview = false } = useRoute().params;

  const { addGift, deleteGift, updateGift, findGift } = useApp();

  const [idea, setIdea] = useState({ ...EMPTY_GIFT });

  const [image, setImage] = useState("");
  const [draftImage, setDraftImage] = useState("");

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
        setIdea({ ...foundGift });
        if (foundGift.image) {
          imageRef.current = foundGift.image;
          setCurrentImageMode(CAMERA_MODE.PREVIEW);
        } else {
          imageRef.current = "";
          setCurrentImageMode(CAMERA_MODE.NEW);
        }
      } else {
        // this is an error
        console.error("What a mess");
      }
      // get the gift
    }
  }, []);

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

      console.log("draft", data.uri);

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
        <Text>{currentImageMode}</Text>
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
        {currentImageMode === CAMERA_MODE.NEW && (
          <View>
            {cameraPermission && (
              <View>
                {cameraComponent}
                <Button
                  onPress={async () => {
                    try {
                      await takePicture();
                      // imageRef.current = draftImageRef.current;
                      setCurrentImageMode(CAMERA_MODE.DRAFT_NEW);
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
          </View>
        )}

        {currentImageMode === CAMERA_MODE.DRAFT_PREVIEW && (
          <View>
            {draftImageRef.current && (
              <View>
                <Image
                  source={{ uri: draftImageRef.current }}
                  style={styles.imageLiveCameraContainer}
                ></Image>

                <Button
                  onPress={async () => {
                    // console.log("clean the draft image and change the mode");
                    draftImageRef.current = "";
                    if (imageRef.current) {
                      setCurrentImageMode(CAMERA_MODE.DRAFT_NEW);
                    } else {
                      setCurrentImageMode(CAMERA_MODE.NEW);
                    }
                  }}
                >
                  Take a another shot
                </Button>
                <Button
                  onPress={() => {
                    const savedImg = draftImageRef.current;
                    draftImageRef.current = "";
                    imageRef.current = savedImg;

                    setCurrentImageMode(CAMERA_MODE.PREVIEW);
                  }}
                >
                  Use the photo
                </Button>
              </View>
            )}

            {!draftImageRef.current && (
              <View>
                <Text>Sorry but there is an error</Text>
              </View>
            )}
          </View>
        )}

        {currentImageMode === CAMERA_MODE.DRAFT_NEW && (
          <View>
            {cameraPermission && (
              <View>
                <Image
                  source={{ uri: draftImageRef.current }}
                  style={styles.imageLiveCameraContainer}
                ></Image>
                <Button
                  onPress={() => {
                    imageRef.current = draftImageRef.current;
                    setCurrentImageMode(CAMERA_MODE.PREVIEW);
                  }}
                >
                  Save
                </Button>
                <Button
                  onPress={() => {
                    if (imageRef.current) {
                      //something else
                    } else {
                      setCurrentImageMode(CAMERA_MODE.NEW);
                    }
                  }}
                >
                  Take another shot
                </Button>
                <Button
                  onPress={() => {
                    if (imageRef.current) {
                      setCurrentImageMode(CAMERA_MODE.PREVIEW);
                    } else {
                      setCurrentImageMode(CAMERA_MODE.NEW);
                    }
                  }}
                >
                  Cancel
                </Button>
              </View>
            )}

            {!cameraPermission && <View>Sorry buddy</View>}
          </View>
        )}

        {currentImageMode === CAMERA_MODE.PREVIEW && (
          <View>
            {imageRef.current && (
              <View>
                <Text>Display the image</Text>
                <Image
                  source={{ uri: imageRef.current }}
                  style={styles.imageLiveCameraContainer}
                ></Image>
                <Button
                  onPress={() => {
                    draftImageRef.current = "";
                    setCurrentImageMode(CAMERA_MODE.DRAFT_NEW);
                  }}
                >
                  Replace Image
                </Button>
              </View>
            )}
            {!imageRef.current && (
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

/**
 *
 *   View: Centered
 *      ImageCameraContainer: width: 300 height: 400, flex : 1, centered
 *
 */
