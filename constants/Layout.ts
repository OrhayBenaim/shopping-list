import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  s: 12,
  m: 24,
  l: 38,
  xl: 54,
};

export const Font = {
  s: 12,
  m: 18,
  l: 24,
  xl: 32,
};
