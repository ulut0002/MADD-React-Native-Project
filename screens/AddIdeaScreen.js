import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Text, TextInput } from "react-native";
import { View, StyleSheet } from "react-native";
import { useApp } from "../context/appContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../styles/globalStyles";
import { Button } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
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
  const { currentPersonId, isRealDevice } = useApp();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);
  const [mode, setMode] = useState(MODE.SHOW_REAL_IMAGE);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [camera, setCamera] = useState(null);
  const [takePhotoButtonDisabled, setTakePhotoButtonDisabled] = useState(false);

  const { addGift, deleteGift, findGift } = useApp();
  const giftIdeaRef = useRef();

  const [idea, setIdea] = useState({ ...EMPTY_GIFT });
  const { giftId } = useRoute().params;

  // Images are stored in a ref variable because:
  // async takePhoto() used to call setImage or setDraftImage functions
  // and when the page was re-rendered, image and draftImage variables didn't have the most up to date value
  const draftImageRef = useRef("");
  const imageRef = useRef("");

  useEffect(() => {
    const checkCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status === "granted") {
        setCameraPermission(true);
      } else if (status === "undetermined") {
        setCameraPermission(false);
      } else {
        setCameraPermission(false);
      }
    };
    checkCameraPermission();

    console.log("real device", isRealDevice);
  }, []);

  useEffect(() => {
    const initializeCameraMode = async () => {
      if (giftId && currentPersonId) {
        const foundGift = findGift(currentPersonId, giftId);
        if (foundGift) {
          draftImageRef.current = "";
          if (foundGift.image) {
            imageRef.current = foundGift.image;
            setMode(MODE.SHOW_REAL_IMAGE);
          } else {
            imageRef.current = "";
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

      if (giftIdeaRef && giftIdeaRef.current) {
        giftIdeaRef.current.focus();
      }
    };

    initializeCameraMode();
  }, [giftId, currentPersonId]);

  const cameraComponent = () => {
    if (isRealDevice && cameraPermission) {
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
        <DisabledCameraView />
      </View>
    );
  };

  const takePicture = async () => {
    if (cameraPermission) {
      let sizes = [];
      try {
        sizes = await camera.getAvailablePictureSizesAsync();
      } catch (error) {
        // this is always an error
        // console.warn(error);
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

  const shouldDisableButton = () => {
    try {
      if (mode === MODE.SHOW_LIVE_CAMERA) {
        return true;
      }

      return !idea.text.trim();
    } catch (error) {
      return false;
    }
  };

  const handleTakeAPicture = async () => {
    // setTakePhotoButtonDisabled(true);

    console.log("xxx");
    try {
      await takePicture();
      setMode(MODE.SHOW_DRAFT_IMAGE);
    } catch (error) {
      console.error(error);
    }
    // setTakePhotoButtonDisabled(false);
  };

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
        globalStyles.screen,
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={[globalStyles.screenContent]}>
          <Text style={[globalStyles.screenTitle]}>Gift Idea</Text>
          <View style={[globalStyles.inputContainer]}>
            <Text style={[globalStyles.inputLabel]}>Idea</Text>
            <TextInput
              ref={giftIdeaRef}
              placeholder="Idea"
              label={"Gift idea"}
              placeholderTextColor={"#cccccc"}
              value={idea.text}
              onChangeText={(text) => {
                setIdea({ ...idea, text });
              }}
              autoCapitalize="none"
              autoCorrect={true}
              returnKeyType="next"
              style={[globalStyles.input]}
            ></TextInput>
          </View>

          <View style={styles.mediaContainer}>
            {mode === MODE.SHOW_LIVE_CAMERA && (
              <View>
                {cameraComponent()}
                <View style={[globalStyles.buttonContainer]}>
                  <Button
                    style={[globalStyles.button, globalStyles.lightButton]}
                    onPress={() => {
                      console.log("aaaa");
                      handleTakeAPicture();
                    }}
                  >
                    <Text>Take a Picture</Text>
                  </Button>
                  {imageRef.current && (
                    <Button
                      style={[globalStyles.button, globalStyles.lightButton]}
                      onPress={() => {
                        setMode(MODE.SHOW_REAL_IMAGE);
                      }}
                    >
                      <Text>Cancel</Text>
                    </Button>
                  )}
                </View>
              </View>
            )}

            {mode === MODE.SHOW_DRAFT_IMAGE && (
              <View>
                {draftImageRef && (
                  <Image
                    source={{ uri: draftImageRef.current }}
                    style={styles.imageLiveCameraContainer}
                  ></Image>
                )}
                <View style={[globalStyles.buttonContainer]}>
                  <Button
                    style={[globalStyles.button, globalStyles.lightButton]}
                    onPress={async () => {
                      draftImageRef.current = "";
                      setMode(MODE.SHOW_LIVE_CAMERA);
                    }}
                  >
                    Take Another Picture
                  </Button>

                  {imageRef.current && (
                    <Button
                      style={[globalStyles.lightButton]}
                      onPress={async () => {
                        draftImageRef.current = "";
                        setMode(MODE.SHOW_REAL_IMAGE);
                      }}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    disabled={shouldDisableButton()}
                    style={[
                      globalStyles.button,
                      shouldDisableButton()
                        ? globalStyles.disabledButton
                        : globalStyles.lightButton,
                    ]}
                    onPress={async () => {
                      await addGift({
                        text: idea.text,
                        id: giftId,
                        image: draftImageRef.current,
                      });
                    }}
                  >
                    Save
                  </Button>
                </View>
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
                <View style={[globalStyles.buttonContainer]}>
                  <Button
                    style={[globalStyles.button, globalStyles.lightButton]}
                    onPress={() => {
                      setMode(MODE.SHOW_LIVE_CAMERA);
                    }}
                  >
                    Replace Image
                  </Button>

                  <Button
                    disabled={shouldDisableButton()}
                    style={[
                      globalStyles.button,
                      shouldDisableButton()
                        ? globalStyles.disabledButton
                        : globalStyles.lightButton,
                    ]}
                    onPress={() => {
                      addGift({
                        text: idea.text,
                        id: giftId,
                        image: imageRef.current,
                      });
                    }}
                  >
                    Save
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
