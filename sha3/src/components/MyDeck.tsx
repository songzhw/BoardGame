import React, { useState } from "react";
import { GestureResponderEvent, Image, StyleSheet, TouchableOpacity, View, ViewProps, YellowBox } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH, HAND_OFFSET_4, MY_PLAYER_HEIGHT } from "../core/Const";
import { MyPlayerView } from "./MyPlayerView";
import { ICard } from "../data/CardDeck";
import { imageSources } from "../core/Images";
import { CardView } from "./CardView";

YellowBox.ignoreWarnings(["Remote debugger"]);

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const MyDeck = (props: IProps) => {
  const [selected, setSelected] = useState(-1);

  let positionOffset = 0;
  const handViews: Element[] = [];
  props.hand.forEach((card, index) => {
    handViews.push(
      <TouchableOpacity
        onPress={() => selectCard(card, index)}
        key={index + card.label}
        style={[styles.oneCard, { position: "absolute", left: positionOffset }]}>
        <CardView
          style={{ flex: 1 }}
          card={card}
        />
      </TouchableOpacity>
    );
    positionOffset += HAND_OFFSET_4;
  });

  const selectCard = (card: ICard, index: number) => {
    console.log(`szw select: ${index} || `, card);
  };

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
    height: MY_PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  },
  oneCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  }
});