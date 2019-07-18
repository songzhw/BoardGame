import { useTheme } from "beeshell/dist/common/styles/variables";

// 自定义主题变量
const customTheme = {
  mtdBrandPrimary: "#388e3c",
  mtdBrandPrimaryDark: "#1b5e20",
  mtdGrayBase: "#333333",

  buttonBorderRadius: 30
};

const customized = useTheme(customTheme);
export default customized;
