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

const AddPeopleScreen = () => {
  const {
    addPerson,
    deletePerson,
    deletePersonWithConfirm,
    findPerson,
    setCurrentPerson,
    setNewPerson,
  } = useApp();

  const { personId } = useRoute().params;

  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [DOB, setDOB] = useState(); // default value must remain blank
  const insets = useSafeAreaInsets();
  const textFieldRef = useRef(null);

  useEffect(() => {
    let foundPerson = findPerson(personId);
    if (!foundPerson) foundPerson = _.cloneDeep(EMPTY_PERSON);
    setPerson(_.cloneDeep(foundPerson));
    let dt = foundPerson.dob ? foundPerson.dob : DateTime.now();
    setDOB(formatDateForCalendar(dt));

    // focus on the text field
    if (textFieldRef && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [personId]);

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
        <Text style={[globalStyles.inputLabel]}>Name</Text>

        <TextInput
          value={person.name}
          ref={textFieldRef}
          onChangeText={(value) => {
            if (personId) {
              const obj = { ...person, name: value };
              setCurrentPerson({ ...obj });
              setPerson({ ...obj });
            } else {
              const obj = { ...person, name: value };
              setPerson({ ...obj });
              setNewPerson({ ...obj }); // update context
            }
          }}
          style={[globalStyles.input]}
          placeholder={"Enter a name"}
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
        ></TextInput>
        {DOB && (
          <View style={{ marginTop: 20 }}>
            <Text style={[globalStyles.inputLabel]}>Birthday</Text>
            <DatePicker
              mode="calendar"
              isGregorian={true}
              selected={DOB}
              current={DOB}
              options={{
                backgroundColor: colors.background,
                textHeaderColor: "#FFA25B",
                textDefaultColor: "#F6E7C1",
                selectedTextColor: "#fff",
                mainColor: "#F4722B",
                textSecondaryColor: "#D6C7A1",
                borderColor: colors.accent,
              }}
              onDateChange={(val) => {
                if (personId) {
                  const obj = { ...person, dob: createLuxonDate(val) };
                  setDOB(val);
                  setCurrentPerson({ ...obj }); // update context
                } else {
                  const obj = { ...person, dob: createLuxonDate(val) };
                  setDOB(val);
                  setNewPerson({ ...obj }); // update context
                }
              }}
            ></DatePicker>
          </View>
        )}
      </View>

      <View style={[globalStyles.buttonContainer]}>
        <Button
          onPress={() => {
            const personPayload = {
              ...EMPTY_PERSON,
              id: personId,
              name: person.name,
              dob: createLuxonDate(DOB),
            };
            addPerson(personPayload);
          }}
          disabled={!person.name || !DOB}
          style={[globalStyles.button, globalStyles.lightButton]}
        >
          <Text style={[globalStyles.lightText]}>
            {personId ? `Update Person` : `Add Person`}
          </Text>
        </Button>
        {personId && (
          <Button
            style={[globalStyles.button, globalStyles.lightButton]}
            onPress={async () => {
              deletePersonWithConfirm(personId)
                .then((deleted) => {
                  if (deleted) {
                  } else {
                  }
                })
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

const styles = StyleSheet.create({});

export default AddPeopleScreen;
