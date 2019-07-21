import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH, PLAYER_HEIGHT } from "../core/Const";
import { ICard } from "../data/CardDeck";
import { imageSources } from "../core/Images";

interface IProps extends ViewProps {
  card: ICard
}

export const CardView = (props: IProps) => {
  const suit = imageSources[props.card.suit];
  const image = imageSources[props.card.label];
  return (
    <View>
      <Image style={styles.card} source={image}/>
      <Image style={styles.suit} source={suit}/>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },
  suit: {
    width: 21,
    height: 17,
    position: "absolute",
    top: 7,
    left: 3
  }
});