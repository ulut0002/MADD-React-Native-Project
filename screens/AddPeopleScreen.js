import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, globalStyles } from "../styles/globalStyles";
import DatePicker from "react-native-modern-datepicker";
import { createLuxonDate, formatDateForCalendar } from "../util/util";
import { useApp } from "../context/appContext";
import { Button, Text } from "react-native-paper";
import { DateTime } from "luxon";
import { EMPTY_PERSON } from "../util/constants";
import { useRoute } from "@react-navigation/native";
import _ from "lodash";
import { produce } from "immer";

// Component for adding and updating people
const AddPeopleScreen = () => {
  // Destructuring various functions from the app context
  const { addPersonAsync, deletePersonWithConfirm, findPerson } = useApp();

  // Extracting personId from the route parameters
  const { personId } = useRoute().params;

  // State variables to manage person data and date of birth
  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [DOB, setDOB] = useState(); // default value must remain blank
  const insets = useSafeAreaInsets();
  const textFieldRef = useRef(null);
  const [disableAddButton, setDisableAddButton] = useState(true);

  // Effect hook to initialize the component asynchronously
  useEffect(() => {
    const initializeAsync = async () => {
      // Finding the person using personId or using an empty person object
      let foundPerson = findPerson(personId);
      if (!foundPerson) foundPerson = EMPTY_PERSON;
      setPerson(_.cloneDeep(foundPerson));

      // Setting the date of birth, defaulting to the current date if not available
      let dt = foundPerson.dob ? foundPerson.dob : DateTime.now();
      setDOB(formatDateForCalendar(dt));

      // Focusing on the text field
      if (textFieldRef && textFieldRef.current) {
        textFieldRef.current.focus();
      }
    };

    initializeAsync();
  }, [personId]);

  const handleNameChange = (value = "") => {
    setDisableAddButton(!value.trim() || !DOB);

    setPerson(
      produce((draftState) => {
        draftState.name = value;
      })
    );
  };

  const handleDobChange = (value) => {
    // Update local state and context state based on personId
    setDisableAddButton(!person.name.trim() || !value);

    setDOB(
      produce((draftState) => {
        draftState.dob = createLuxonDate(value);
      })
    );
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
    >
      <View style={[globalStyles.inputContainer]}>
        {/* Input for person's name */}
        <Text style={[globalStyles.inputLabel]}>Name</Text>

        <TextInput
          value={person.name}
          ref={textFieldRef}
          placeholderTextColor={colors.text_field_place_holder_color}
          onChangeText={(value) => {
            handleNameChange(value);
          }}
          style={[globalStyles.input]}
          placeholder={"Enter a name"}
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
        ></TextInput>

        {/* Date picker for person's birthday */}
        {DOB && (
          <View style={[styles.dobContainer]}>
            <Text style={[globalStyles.inputLabel]}>Birthday</Text>
            <DatePicker
              mode="calendar"
              isGregorian={true}
              selected={DOB}
              current={DOB}
              options={{
                backgroundColor: colors.background,
                textHeaderColor: colors.calendar_text_header_color,
                textDefaultColor: colors.calendar_text_default_color,
                selectedTextColor: colors.calendar_text_selected_text_color,
                mainColor: colors.calendar_main_color,
                textSecondaryColor: colors.calendar_text_secondary_color,
                borderColor: colors.calendar_border_color,
              }}
              onDateChange={(val) => {
                handleDobChange(val);
              }}
            ></DatePicker>
          </View>
        )}
      </View>

      {/* Button container for adding/updating and deleting person */}
      <View style={[globalStyles.buttonContainer]}>
        <Button
          onPress={() => {
            // Create payload for adding/updating person
            const personPayload = {
              ...EMPTY_PERSON,
              id: personId,
              name: person.name,
              dob: createLuxonDate(DOB),
            };
            setDisableAddButton(true);
            addPersonAsync(personPayload)
              .then(() => {
                setDisableAddButton(false);
              })
              .catch((error) => {
                setDisableAddButton(false);
              });
          }}
          disabled={disableAddButton}
          style={[
            globalStyles.button,
            disableAddButton
              ? globalStyles.disabledButton
              : globalStyles.lightButton,
          ]}
        >
          <Text
            style={[
              disableAddButton
                ? globalStyles.disableText
                : globalStyles.lightText,
            ]}
          >
            {personId ? `Update Person` : `Add Person`}
          </Text>
        </Button>

        {/* Button to delete person (visible only if personId is present) */}

        {personId && (
          <Button
            style={[globalStyles.button, globalStyles.lightButton]}
            onPress={async () => {
              deletePersonWithConfirm(personId)
                .then((deleted) => {})
                .catch((error) => {
                  console.warn(error);
                });
            }}
          >
            <Text style={[globalStyles.lightText]}>Delete</Text>
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  dobContainer: {
    marginTop: 20,
  },
});

export default AddPeopleScreen;
