// 第一步，这个必须放在最前面
import "./src/core/Themes";

// 第二步，import 带有组件库的 APP
import { AppRegistry } from "react-native";
import App from "./App";

import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
