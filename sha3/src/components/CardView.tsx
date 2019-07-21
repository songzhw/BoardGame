import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH, PLAYER_HEIGHT } from "../core/Const";
import { ICard } from "../data/CardDeck";
import { imageSources } from "../core/Images";

interface IProps extends ViewProps {
  image: ImageSourcePropType;
  card: ICard
}

export const CardView = (props: IProps) => {
  const suit = imageSources[props.card.suit];
  return (
    <View>
      <Image style={styles.suit} source={suit}/>
      <Image style={{ flex: 1 }} source={props.image}/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
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