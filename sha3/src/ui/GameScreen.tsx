import React, { useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import { PlayerView } from "../components/PlayerView";
import { MyDeck } from "../components/MyDeck";
import { SelectHeroModal } from "./SelectHeroModal";

interface IProps extends ViewProps {
}

export const GameScreen = (props: IProps) => {

  function onSelectHero(info: string) {
    console.log(`szw info = `, info);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.row}>
        <PlayerView/>
        <PlayerView/>
        <PlayerView/>
      </View>

      <MyDeck/>

      <SelectHeroModal onSelect={onSelectHero}/>

    </SafeAreaView>
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