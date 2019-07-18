import React from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import { PlayerView } from "../components/PlayerView";
import { MyDeck } from "../components/MyDeck";

interface IProps extends ViewProps {
}

export const GameScreen = (props: IProps) => {
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <PlayerView/>
        <PlayerView/>
        <PlayerView/>
      </View>

      <View style={styles.row}>
        <PlayerView/>
        <PlayerView/>
      </View>

      <View style={styles.row}>
        <PlayerView/>
        <PlayerView/>
      </View>

      <MyDeck/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});