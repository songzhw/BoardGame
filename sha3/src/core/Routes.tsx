import React from "react";
import { Text, View } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { NavigationBar } from "beeshell";
import { GameScreen } from "../ui/GameScreen";
import { HomeScreen } from "../ui/HomeScreen";

const RouteList = createStackNavigator({
  HomeScreen, GameScreen
}, {
  defaultNavigationOptions: {
    headerTitle: (
      <NavigationBar
        title="Sha3"
        titleStyle={{ color: "white" }}
        backLabelText=""
        backLabelIcon={(<View/>)}
        style={{ backgroundColor: "#1b5e20" }}
      />
    )
  }
});

export const Routes = createAppContainer(RouteList);