import React from "react";
import { StyleSheet, View, Text, ViewProps, Image } from "react-native";
import { PLAYER_HEIGHT, PLAYER_WIDTH } from "../core/Const";
import { ICard } from "../data/CardDeck";

interface IProps extends ViewProps {
  avatar: any;
  hand: ICard[]
}

export const PlayerView = (props: IProps) => {
  const passedInStyles = props.style;

  return (
    <View style={[styles.container, passedInStyles]}>

      <Image style={styles.avatar} source={props.avatar}/>

      <View style={[styles.circle, styles.handleAmountParent]}>
        <Text style={styles.handAmount}> {props.hand.length} </Text>
      </View>

      <View style={styles.emptyPlaceHolder}/>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomCell}>倚天剑</Text>
          <Text style={styles.bottomCell}>护心镜</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomCell}>+1马</Text>
          <Text style={styles.bottomCell}>-1马</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomCell}>静心香</Text>
          <Text style={styles.bottomCell}>木牛流马</Text>
        </View>
        <View style={styles.bottomRow}>
          <Image source={require("../../res/images/adjugement/乐不思蜀.png")} style={styles.bottomAdjugementCell}/>
          <Image source={require("../../res/images/adjugement/兵粮寸断.png")} style={styles.bottomAdjugementCell}/>
          <Image source={require("../../res/images/adjugement/闪电.png")} style={styles.bottomAdjugementCell}/>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    borderWidth: 2,
    borderColor: "black"
  },
  avatar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
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
    right: 0,
    top: 0,
    backgroundColor: "#f76260"
  },
  handAmount: {
    fontSize: 22,
    textAlign: "center"

  },
  emptyPlaceHolder: {
    flex: 1
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#ccc"
  },
  bottomRow: {
    flex: 1,
    flexDirection: "row"
  },
  bottomCell: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "black",
    fontSize: 15
  },
  bottomAdjugementCell: {
    width: PLAYER_WIDTH / 4,
    height: PLAYER_WIDTH / 4
  }

});