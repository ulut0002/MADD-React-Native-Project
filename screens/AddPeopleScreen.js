import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../styles/globalStyles";
import DatePicker from "react-native-modern-datepicker";
import { createLuxonDate, formatDateForCalendar } from "../util/util";
import { useApp } from "../context/appContext";
import { Button } from "react-native-paper";
import { DateTime } from "luxon";
import { EMPTY_PERSON } from "../util/constants";
import { useRoute } from "@react-navigation/native";
import _ from "lodash";

const AddPeopleScreen = () => {
  const {
    addPerson,
    deletePerson,
    findPerson,
    setCurrentPerson,
    setNewPerson,
  } = useApp();

  const { personId } = useRoute().params;

  const [person, setPerson] = useState({ ...EMPTY_PERSON });
  const [DOB, setDOB] = useState(); // default value must remain blank
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let foundPerson = findPerson(personId);
    if (!foundPerson) foundPerson = _.cloneDeep(EMPTY_PERSON);
    setPerson(_.cloneDeep(foundPerson));
    let dt = foundPerson.dob ? foundPerson.dob : DateTime.now();
    setDOB(formatDateForCalendar(dt));
  }, [personId]);

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
          <DatePicker
            mode="calendar"
            isGregorian={true}
            selected={DOB}
            current={DOB}
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
        )}
      </View>

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
      >
        {personId ? `Update Person` : `Add Person`}
      </Button>

      {personId && (
        <Button
          onPress={() => {
            deletePerson(personId);
          }}
        >{`Delete`}</Button>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default AddPeopleScreen;
