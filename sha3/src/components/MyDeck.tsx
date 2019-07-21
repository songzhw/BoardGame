import React from "react";
import { Image, StyleSheet, View, ViewProps } from "react-native";
import { PLAYER_HEIGHT } from "../core/Const";
import { PlayerView } from "./PlayerView";
import { ICard } from "../data/CardDeck";
import { JSXElement } from "@babel/types";

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const MyDeck = (props: IProps) => {
  console.log(`szw mydeck = `, props.hand);
  const handViews: Element[] = [];
  props.hand.forEach((card, index) => {
    handViews.push(
      <Image source={require("../../res/images/cards/basic/杀.png")} key={index + card.label}/>
    );
  });

  return (
    <View style={styles.parent}>
      <PlayerView hand={props.hand} avatar={props.avatar}/>
      {handViews}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: "row",
    height: PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  }
});