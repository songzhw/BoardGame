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
      <Image style={styles.suit} source={suit}/>
      <Image style={styles.card} source={image}/>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },
  suit: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 20,
    left: 20
  }
});