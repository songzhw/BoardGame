import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH, PLAYER_HEIGHT } from "../core/Const";
import { ICard } from "../data/CardDeck";
import { imageSources } from "../core/Images";

interface IProps extends ViewProps {
  card: ICard
}

export const CardView = (props: IProps) => {
  const { card } = props;
  const suit = imageSources[card.suit];
  const image = imageSources[card.label];
  return (
    <View>
      <Image style={styles.card} source={image}/>
      <Text style={[styles.rank]}> {card.rank} </Text>
      <Image style={styles.suit} source={suit}/>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },
  rank: {
    width: 15,
    height: 15,
    position: "absolute",
    top: 5,
    left: 6,
    fontWeight: "bold",
    color: "red"
  },
  suit: {
    width: 21,
    height: 17,
    position: "absolute",
    top: 20,
    left: 3
  }
});