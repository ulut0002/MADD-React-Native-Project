import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";
import DatePicker from "react-native-modern-datepicker";
import { createLuxonDate, formatDateForCalendar } from "../util/util";
import { useApp } from "../context/appContext";
import { Button } from "react-native-paper";

const AddPeopleScreen = () => {
  const {
    currentPersonDOB,
    currentPersonName,
    setCurrentPersonDOB,
    setCurrentPersonName,
    addPerson,
  } = useApp();

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    formatDateForCalendar(currentPersonDOB)
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const luxonDate = createLuxonDate(date);
    setCurrentPersonDOB(luxonDate);
    // console.log("handleDateChange", date, luxonDate);
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
          value={currentPersonName}
          onChangeText={setCurrentPersonName}
          style={[globalStyles.input]}
          placeholder="Enter a name"
        ></TextInput>
        <DatePicker
          mode="calendar"
          isGregorian={true}
          selected={selectedDate}
          current={selectedDate}
          onDateChange={(date) => handleDateChange(date)}
        ></DatePicker>
      </View>

      <Button
        title="Add Person"
        onPress={() => {
          // navigation.navigate("Home");
          addPerson();
        }}
        disabled={!currentPersonName || !selectedDate}
      >
        Add {currentPersonName}
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default AddPeopleScreen;

// maximumDate={formatDateForCalendar()}
//          selected={formatDateForCalendar(newPersonDOB)}
//   current={formatDateForCalendar(currentPersonDOB)}
