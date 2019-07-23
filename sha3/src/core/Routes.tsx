import React from "react";
import { Text, View } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { NavigationBar } from "beeshell";
import { GameScreen } from "../ui/GameScreen";
import { HomeScreen } from "../ui/HomeScreen";

const RouteList = createStackNavigator({
  // HomeScreen, //TODO get it back on production
  GameScreen
}, {
  headerMode: "none"
});

export const Routes = createAppContainer(RouteList);