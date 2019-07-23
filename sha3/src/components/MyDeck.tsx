import React from "react";
import { Image, StyleSheet, View, ViewProps } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH, HAND_OFFSET_4, PLAYER_HEIGHT } from "../core/Const";
import { MyPlayerView } from "./MyPlayerView";
import { ICard } from "../data/CardDeck";
import { imageSources } from "../core/Images";
import { CardView } from "./CardView";

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
      <CardView
        style={[styles.oneCard, { position: "absolute", left: positionOffset }]}
        card={card}
        key={index + card.label}/>
    );
    positionOffset += HAND_OFFSET_4;
  });

  return (
    <View style={styles.parent}>
      <MyPlayerView hand={props.hand} avatar={props.avatar}/>
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
    height: CARD_HEIGHT
  }
});