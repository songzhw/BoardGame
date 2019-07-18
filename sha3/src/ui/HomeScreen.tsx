import React from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import { Button } from "beeshell";
import { NavigationScreenProps } from "react-navigation";

interface IProps extends ViewProps, NavigationScreenProps {
}

// BeeShell/Stepper , BeeShell/Scrollpicker : 增加人数
// BeeShell/TopviewGetInstance : 选将

export const HomeScreen = (props: IProps) => {

  function onStart() {
    props.navigation.navigate("GameScreen");
  }

  return (
    <View>
      <Button type="primary" size="md" onPress={onStart}> Start </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});