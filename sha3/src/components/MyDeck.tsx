import React from "react";
import { Image, StyleSheet, View, ViewProps } from "react-native";
import { CARD_WIDTH, PLAYER_HEIGHT } from "../core/Const";
import { PlayerView } from "./PlayerView";
import { ICard } from "../data/CardDeck";

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const MyDeck = (props: IProps) => {
  console.log(`szw mydeck = `, props.hand);
  let positionOffset = 0;
  const handViews: Element[] = [];
  props.hand.forEach((card, index) => {
    handViews.push(
      <Image
        style={[styles.oneCard, { position: "absolute", left: positionOffset }]}
        source={require("../../res/images/cards/basic/杀.png")}
        key={index + card.label}/>
    );
    positionOffset += 40;
  });

  return (
    <View style={styles.parent}>
      <PlayerView hand={props.hand} avatar={props.avatar}/>
      <View style={{ flexDirection: "row" }}>
        {handViews}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: "row",
    height: PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  },
  oneCard: {
    width: CARD_WIDTH,
    height: PLAYER_HEIGHT
  }
});