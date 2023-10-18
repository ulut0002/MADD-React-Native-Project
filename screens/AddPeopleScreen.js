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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddPeopleScreen = () => {
  const {
    addPerson,
    deletePerson,
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
    if (currentPersonId && currentPerson) {
      // use current person
      setPerson({ ...currentPerson });
      let dt = newPerson.dob ? currentPerson.dob : DateTime.now();
      setDOB(formatDateForCalendar(dt));
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
    >
      <View style={[globalStyles.inputContainer]}>
        <Text style={[globalStyles.inputLabel]}>Name</Text>
        <TextInput
          value={person.name}
          onChangeText={(value) => {
            // setPerson({ ...person, newName: value });
            if (currentPersonId) {
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
          <DatePicker
            mode="calendar"
            isGregorian={true}
            selected={DOB}
            current={DOB}
            onDateChange={(val) => {
              if (currentPersonId) {
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
        )}
      </View>

      <Button
        onPress={() => {
          addPerson();
        }}
        disabled={!person.name || !DOB}
      >
        {person.id ? `Update Person` : `Add Person`}
      </Button>

      {currentPersonId && (
        <Button
          onPress={() => {
            deletePerson();
          }}
        >{`Delete`}</Button>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default AddPeopleScreen;
