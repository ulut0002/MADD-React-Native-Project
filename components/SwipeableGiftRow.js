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

export default class SwipeableGiftRow extends Component {
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

  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      // alert(text);

      this.close();
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = (progress) => (
    <View
      style={{
        width: 80,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {this.renderRightAction("Edit Person", "#C8C7CD", 192, progress)}
    </View>
  );

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  deleteRow = () => {
    const { deleteGift, gift, personId } = this.props;

    Alert.alert(`Delete gift?`, `Are you sure? `, [
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
          if (typeof deleteGift === "function") {
            deleteGift({ personId: personId, giftId: gift.id });
          }
          this._swipeableRow.close();
        },
        style: "default",
      },
    ]);
  };

  // closes the swipable
  close = () => {
    if (this._swipeableRow) {
      this._swipeableRow.close();
    }
  };

  onSwipeableOpen = (direction) => {
    //
    if (direction === "left") {
      this.deleteRow();
    } else {
      // do nothing
    }
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
        // renderRightActions={this.renderRightActions}
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
