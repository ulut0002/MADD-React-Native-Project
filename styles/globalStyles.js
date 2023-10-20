import { StyleSheet } from "react-native";

const colors = {
  background: "#3b2f2a",
  primary: "#f2d072",
  secondary: "#f5f2e9",
  accent: "#f2d072",
  buttonColor: "#3b2f2a",
  primary_light: "#fae6af",
};

const defaultVerticalPadding = 20;

const styles = StyleSheet.create({
  primaryColor: {
    color: colors.primary,
  },
  secondaryColor: {
    color: colors.secondary,
  },
  accentColor: {
    color: colors.accent,
  },
  screen: {
    backgroundColor: colors.background,
  },

  screenContent: {
    // paddingVertical: defaultVerticalPadding,
    flex: 1,
  },

  screenTitle: {
    fontWeight: "bold",
    fontSize: 32,
    paddingBottom: 12,
    color: colors.secondary,
    paddingStart: 16,
  },

  line: {
    borderBottomColor: colors.secondary,
    borderBottomWidth: 1,
  },

  emptyListText: {
    fontSize: 24,
    paddingBottom: 4,
    color: colors.secondary,
    textAlign: "center",
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

  peopleList: {
    // flex: 1,
  },

  toolbarButton: {
    color: colors.buttonColor,
    // color: "black",
  },

  personListItemDefault: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 12,
  },

  personListItemContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 12,
  },

  personListItemDeleteContainer: {
    flex: 1,
    backgroundColor: "#dc3545",
    justifyContent: "center",
  },

  personListItemEditContainer: {
    flex: 1,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
  },
});

export { colors, styles as globalStyles };
