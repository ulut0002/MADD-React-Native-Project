import { StyleSheet } from "react-native";

const Colors = {
  primary: "#f2d072",
  secondary: "#040610",
  accent: "#bb443e",
};

export default styles = StyleSheet.create({
  screenTitle: {
    fontWeight: "bold",
    fontSize: 32,
    paddingBottom: 12,
  },

  emptyList: {
    fontSize: 24,
    paddingBottom: 4,
  },

  input: {
    height: 40,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  inputLabel: {
    fontWeight: "600",
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: "column",
    gap: 4,
    margin: 12,
  },

  peopleList: {},
});
