import React from "react";
import { View, ViewProps, Text, StyleSheet, ImageSourcePropType, Image, ImageBackground } from "react-native";
import { ICard } from "../data/CardDeck";
import { MY_PLAYER_WIDTH } from "../core/Const";

interface IProps extends ViewProps {
  avatar: ImageSourcePropType;
  hand: ICard[]
}

export const PlayerView = (props: IProps) => {

  return (
    <View style={styles.container}>
      <Image source={props.avatar} style={[styles.container, { position: "absolute" }]} resizeMode={"cover"}/>

      <View style={[styles.circle, styles.handleAmountParent]}>
        <Text style={styles.handAmount}> {props.hand.length} </Text>
      </View>

      {/*<View style={styles.top}>*/}
      {/*  <Text style={styles.equipmentCell}>{cards}</Text>*/}
      {/*</View>*/}

      {/*<View style={styles.bottom}>*/}
      {/*  <Text style={styles.equipmentCell}>青龙</Text>*/}
      {/*  <Text style={styles.equipmentCell}>八卦</Text>*/}
      {/*  <Text style={styles.horseCell}>+2</Text>*/}
      {/*  <Text style={styles.horseCell}>-2</Text>*/}
      {/*</View>*/}
    </View>
  );
};

const width = 170;
const height = 80;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderStyle: "solid",
    borderColor: "green"
  },
  handleAmountParent: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#f76260"
  },
  handAmount: {
    fontSize: 19,
    textAlign: "center"

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