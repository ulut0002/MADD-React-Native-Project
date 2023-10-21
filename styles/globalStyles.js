import { I18nManager, StyleSheet } from "react-native";

const colors = {
  background: "#3b2f2a",
  primary: "#f2d072",

  secondary: "#f5f2e9",
  accent: "#f2d072",
  buttonColor: "#3b2f2a",
  primary_light: "#fae6af",
  danger: "#dc3545",
  info: "#007bff",

  futureHighlight: "#f2d072",
  pastHighlight: "#ded3e6",
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

  screenTitleStickNoBills: {
    fontFamily: "StickNoBills-Bold",
    fontSize: 44,
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
    borderRadius: 10,
    padding: 10,
    borderColor: colors.accent,
    color: colors.secondary,
  },

  inputLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.secondary,
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

  button: {
    borderRadius: 25, // Adjust the border radius as needed
    width: 150, // Adjust the button width as needed
    margin: 10,
    // maxWidth: 150,
  },
  lightButton: {
    backgroundColor: colors.primary,
  },
  darkButton: {
    backgroundColor: "black", // Dark background color
  },
  disabledButton: {
    backgroundColor: "#f2eded",
  },
  lightText: {
    color: "black", // Light text color
  },
  darkText: {
    color: colors.secondary,
  },
  disableText: {
    color: "#c9c9c1",
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

  personListActionButtonContainer: {
    width: 180,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    marginRight: 12,
    justifyContent: "flex-end",
    gap: 4,
  },

  personListItemDeleteContainer: {
    flex: 1,
    backgroundColor: colors.danger,
    justifyContent: "center",
  },

  personListItemEditContainer: {
    flex: 1,
    borderRadius: 8,
    // marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.info,
  },

  buttonContainer: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  personDobPast: {
    backgroundColor: colors.pastHighlight,
  },
  personDobFuture: {
    backgroundColor: colors.futureHighlight,
  },
});

export { colors, styles as globalStyles };
