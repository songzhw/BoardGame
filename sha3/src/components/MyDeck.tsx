import React from "react";
import { StyleSheet, View } from "react-native";
import { PLAYER_HEIGHT } from "../core/Const";
import { PlayerView } from "./PlayerView";

interface IProps {
}

export const MyDeck = (props: IProps) => {

  return (
    <View style={styles.parent}>
      <PlayerView/>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  }
});