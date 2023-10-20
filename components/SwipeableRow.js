import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  Alert,
  View,
  I18nManager,
  Text,
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { colors, globalStyles } from "../styles/globalStyles";

export default class SwipeableRow extends Component {
  handleNavigate = () => {
    this.close();
    const navigation = this.props.navigation;
    if (navigation && navigation.navigate)
      navigation.navigate("AddPeople", { personId: this.props.person.id });
  };

  renderRightAction = (text, color, x, progress, pressHandler) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[
            globalStyles.personListItemEditContainer,
            { backgroundColor: color },
          ]}
          onPress={() => {
            if (pressHandler && typeof pressHandler === "function") {
              pressHandler();
            }
          }}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = (progress) => (
    <View style={[globalStyles.personListActionButtonContainer]}>
      {this.renderRightAction(
        "Delete",
        colors.danger,
        60,
        progress,
        this.deleteRow
      )}
      {this.renderRightAction(
        "Edit",
        colors.info,
        60,
        progress,
        this.handleNavigate
      )}
    </View>
  );

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  deleteRow = () => {
    const { person, deletePersonWithConfirm } = this.props;

    if (
      deletePersonWithConfirm &&
      typeof deletePersonWithConfirm === "function"
    ) {
      deletePersonWithConfirm(person.id)
        .then((result) => {
          if (result) {
            // User is on People screen. Do nothing. The state will trigger the re-render
          } else {
            // not deleted
            this._swipeableRow.close();
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  };

  // closes the swipable
  close = () => {
    if (this._swipeableRow) {
      this._swipeableRow.close();
    }
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        rightThreshold={40}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "transparent",
    padding: 0,
  },
});
