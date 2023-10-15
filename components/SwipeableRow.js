import React, { Component } from "react";
import { Animated, StyleSheet, Alert } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export default class SwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text style={[styles.actionText]}>Delete</Animated.Text>
      </RectButton>
    );
  };

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  deleteRow = () => {
    const { deletePerson, person } = this.props;
    const name = person.name || "this user";
    const giftCount = Array.isArray(person.gifts) ? person.gifts.length : 0;

    const giftCountText =
      giftCount === 0
        ? `${name} has no gifts in its list. `
        : `You have entered ${giftCount} gift ideas for ${name}`;

    Alert.alert(`Deleting ${name}?`, `${giftCountText}`, [
      {
        text: "Cancel",
        onPress: () => {
          this._swipeableRow.close();
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log("OK Pressed");
          if (typeof deletePerson === "function") {
            console.log("hereee");
            deletePerson({ id: person.id });
          }
          this._swipeableRow.close();
        },
        style: "default",
      },
    ]);
  };

  close = () => {
    // this.deleteRow();
  };

  onSwipeableOpen = () => {
    this.deleteRow();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        onSwipeableOpen={this.onSwipeableOpen}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
