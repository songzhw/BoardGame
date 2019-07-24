import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { ICard } from "../data/CardDeck";
import { MY_PLAYER_WIDTH } from "../core/Const";

interface IProps extends ViewProps {
  avatar: ImageSourcePropType;
  hand: ICard[]
}

export const PlayerView = (props: IProps) => {
  let cards = "";
  for (let card of props.hand) {
    cards += card.label;
    cards += ", ";
  }
  return (
    <Image source={props.avatar}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.equipmentCell}>{cards}</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.equipmentCell}>青龙</Text>
          <Text style={styles.equipmentCell}>八卦</Text>
          <Text style={styles.horseCell}>+2</Text>
          <Text style={styles.horseCell}>-2</Text>
        </View>
      </View>
      <Text>张辽</Text>
    </Image>
  );
};

const width = 120;
const height = 40;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "grey"
  },
  top: {
    flex: 1,
    flexDirection: "row"
  },
  equipmentCell: {
    width: 35,
    textAlign: "center"
  },
  horseCell: {
    width: 25,
    textAlign: "center"
  },
  bottom: {
    flex: 1,
    flexDirection: "row"
  },
  adjugementCell: {
    width: MY_PLAYER_WIDTH / 5,
    height: MY_PLAYER_WIDTH / 5
  }

});