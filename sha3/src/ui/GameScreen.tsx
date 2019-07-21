import React, { useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import { PlayerView } from "../components/PlayerView";
import { MyDeck } from "../components/MyDeck";
import { SelectHeroModal } from "./SelectHeroModal";
import { drawCards, shuffleCards } from "../utils/CardUtils";
import { OriginalCardDeck } from "../data/CardDeck";

interface IProps extends ViewProps {
}

export const GameScreen = (props: IProps) => {
  const [deck, setDeck] = useState(OriginalCardDeck);

  function onSelectHero(info: string) {
    const cardDeck = shuffleCards();
    setDeck(cardDeck);
    console.log(`szw info = ${info} ; `, cardDeck);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.row}>
        <PlayerView hand={drawCards(OriginalCardDeck, 4)} avatar={require("../../res/images/heros/孙权.jpg")}/>
        <PlayerView hand={drawCards(OriginalCardDeck, 4)} avatar={require("../../res/images/heros/赵云.jpg")}/>
        <PlayerView hand={drawCards(OriginalCardDeck, 4)} avatar={require("../../res/images/heros/张辽.jpg")}/>
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