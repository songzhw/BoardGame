import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { ICard } from "../data/CardDeck";

interface IProps extends ViewProps {
  avatar: ImageSourcePropType;
  hand: ICard[]
}

export const PlayerView = (props: IProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.topCell}>青龙</Text>
        <Text style={styles.topCell}>八卦</Text>
        <Text style={styles.topCell}>+2</Text>
        <Text style={styles.topCell}>-2</Text>
        <Text style={styles.topCell}>木牛</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    backgroundColor: "grey"
  },
  top: {
    flex: 1,
    flexDirection: "row"
  },
  topCell: {
    flex: 1,
    textAlign: "center"
  },
  bottom: {
    flex: 1,
    flexDirection: "row"
  }
});