import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import DatePicker from "react-native-modern-datepicker";
import { createLuxonDate, formatDateForCalendar } from "../util/util";
import { useApp } from "../context/appContext";
import { Button } from "react-native-paper";
import { DateTime } from "luxon";
import { EMPTY_PERSON } from "../util/constants";

const AddPeopleScreen = () => {
  const {
    addPerson,
    findPerson,
    currentPerson,
    setCurrentPerson,
    newPerson,
    setNewPerson,
    currentPersonId,
  } = useApp();

  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [DOB, setDOB] = useState(); // default value must remain blank
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (currentPersonId) {
      // use current person
    } else {
      setPerson({ ...newPerson });
      let dt = newPerson.dob ? newPerson.dob : DateTime.now();
      setDOB(formatDateForCalendar(dt));
    }
  }, [currentPerson, newPerson, currentPersonId]);

  const handleDateChange = (date) => {
    if (currentPersonId) {
    } else {
      // setNewPerson({ ...person, dob: createLuxonDate(date) });
    }
    // setCurrentPerson({ ...person, newDob: createLuxonDate(date) });
  };

  return (
    <KeyboardAvoidingView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[globalStyles.inputContainer]}>
        <Text style={[globalStyles.inputLabel]}>Name</Text>
        <TextInput
          value={person.name}
          onChangeText={(value) => {
            // setPerson({ ...person, newName: value });
            if (currentPersonId) {
              setCurrentPerson({ ...person, name: value });
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
        ></TextInput>
        {DOB && (
          <DatePicker
            mode="calendar"
            isGregorian={true}
            selected={DOB}
            current={DOB}
            onDateChange={(val) => {
              const obj = { ...person, dob: createLuxonDate(val) };
              setDOB(val);
              setNewPerson(obj); // update context
            }}
          ></DatePicker>
        )}
      </View>

      <Button
        onPress={() => {
          // navigation.navigate("Home");
          // const obj = { ...person, dob: createLuxonDate(DOB) };
          // setNewPerson(obj);
          addPerson();
        }}
        disabled={!person.name || !DOB}
      >
        {person.id ? "Save" : `Add ${person.name}`}
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default AddPeopleScreen;
