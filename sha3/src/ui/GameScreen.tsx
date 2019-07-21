import React, { useEffect, useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import { PlayerView } from "../components/PlayerView";
import { MyDeck } from "../components/MyDeck";
import { SelectHeroModal } from "./SelectHeroModal";
import { drawCards, shuffleCards } from "../utils/CardUtils";
import { ICard, OriginalCardDeck } from "../data/CardDeck";
import Orientation from "react-native-orientation";

interface IProps extends ViewProps {
}

export const GameScreen = (props: IProps) => {
  const [deck, setDeck] = useState(OriginalCardDeck);
  const [myHand, setMyHand] = useState<ICard[]>([]);

  useEffect(() => {
    Orientation.lockToLandscape();
  }, []);

  function onSelectHero(info: string) {
    const cardDeck = shuffleCards();
    setDeck(cardDeck);
    setMyHand(drawCards(cardDeck, 4));
    console.log(`szw info = ${info} ; `, cardDeck);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.row}>
        <PlayerView hand={drawCards(deck, 4)} avatar={require("../../res/images/heroes/孙权.jpg")}/>
        <PlayerView hand={drawCards(deck, 4)} avatar={require("../../res/images/heroes/赵云.jpg")}/>
        <PlayerView hand={drawCards(deck, 4)} avatar={require("../../res/images/heroes/张辽.jpg")}/>
      </View>

      <MyDeck hand={myHand} avatar={require("../../res/images/heroes/魏延.jpg")}/>

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