import React from "react";
import { Image, StyleSheet, View, ViewProps } from "react-native";
import { PLAYER_HEIGHT } from "../core/Const";
import { PlayerView } from "./PlayerView";
import { ICard } from "../data/CardDeck";

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const MyDeck = (props: IProps) => {
  console.log(`szw mydeck = `, props.hand);
  const handViews = [];
  for (let card of props.hand) {
    handViews.push(<Image source={require("../../res/images/cards/basic/杀.png")}/>);
  }


  return (
    <View style={styles.parent}>
      <PlayerView hand={props.hand} avatar={props.avatar}/>
      {handViews}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  }
});