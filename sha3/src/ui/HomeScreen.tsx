import React, { useEffect, useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import { Button, Icon, Radio } from "beeshell";
import { NavigationScreenProps } from "react-navigation";
import { GAME_MODEL_4, GAME_MODEL_6, GAME_MODEL_8 } from "../data/Const";
import Orientation from "react-native-orientation";

interface IProps extends ViewProps, NavigationScreenProps {
}

// BeeShell/Stepper , BeeShell/Scrollpicker : 增加人数
// BeeShell/TopviewGetInstance : 选将

export const HomeScreen = (props: IProps) => {
  const [gameMode, setGameMode] = useState(GAME_MODEL_4);

  // useEffect(() => {
  //   Orientation.lockToLandscape();
  // }, []);

  function onStart() {
    console.log(`szw onstart()`);
    props.navigation.navigate("GameScreen");
  }

  return (
    <SafeAreaView>
      <Radio value={gameMode} onChange={(mode: number) => setGameMode(mode)}
      >
        <Radio.Item label={"四人局(1主公, 1忠臣, 1反贼, 1内奸"} value={GAME_MODEL_4}/>
        <Radio.Item label={"六人局(1主公, 1忠臣, 2反贼, 2内奸"} value={GAME_MODEL_6}/>
        <Radio.Item label={"八人局(1主公, 2忠臣, 3反贼, 2内奸"} value={GAME_MODEL_8}/>
      </Radio>

      <Button type="primary" size="md" onPress={onStart}> Start </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {}
});