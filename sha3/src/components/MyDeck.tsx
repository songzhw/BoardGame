import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { PLAYER_HEIGHT } from "../core/Const";
import { PlayerView } from "./PlayerView";
import { ICard } from "../data/CardDeck";

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const MyDeck = (props: IProps) => {
  console.log(`szw mydeck = `, props.hand);
  return (
    <View style={styles.parent}>
      <PlayerView hand={props.hand} avatar={props.avatar}/>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: PLAYER_HEIGHT,
    backgroundColor: "powderblue"
  }
});