import { I18nManager, StyleSheet } from "react-native";

const colors = {
  background: "#24262e",
  primary: "#f2d072",

  secondary: "#f5f2e9",
  accent: "#f2d072",
  buttonColor: "#3b2f2a",
  primary_light: "#f5cbcf",
  danger: "#dc3545",
  info: "#007bff",

  futureHighlight: "#e4969e",
  pastHighlight: "#c8bcd1",

  calendar_text_header_color: "#FFA25B",
  calendar_text_default_color: "#F6E7C1",
  calendar_text_selected_text_color: "#fff",
  calendar_main_color: "#F4722B",
  calendar_text_secondary_color: "#D6C7A1",
  calendar_border_color: "#f2d072",

  text_field_place_holder_color: "#cccccc",
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
    borderRadius: 4,
    marginHorizontal: 16,
  },

  personListItemContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
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

  danger: {
    color: colors.danger,
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

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },

  row: {
    flexDirection: "row",
  },
});

export { colors, styles as globalStyles };
