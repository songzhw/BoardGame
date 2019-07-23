import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { ICard } from "../data/CardDeck";
import { MY_PLAYER_WIDTH } from "../core/Const";

interface IProps extends ViewProps {
  avatar: ImageSourcePropType;
  hand: ICard[]
}

export const PlayerView = (props: IProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.equipmentCell}>木牛</Text>
        <Image source={require("../../res/images/cards/adjugement/乐不思蜀.png")} style={styles.adjugementCell}/>
        <Image source={require("../../res/images/cards/adjugement/兵粮寸断.png")} style={styles.adjugementCell}/>
        <Image source={require("../../res/images/cards/adjugement/闪电.png")} style={styles.adjugementCell}/>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.equipmentCell}>青龙</Text>
        <Text style={styles.equipmentCell}>八卦</Text>
        <Text style={styles.horseCell}>+2</Text>
        <Text style={styles.horseCell}>-2</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    backgroundColor: "grey"
  },
  top: {
    flex: 1,
    flexDirection: "row"
  },
  equipmentCell: {
    flex: 1.5,
    textAlign: "center"
  },
  horseCell: {
    flex: 1,
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