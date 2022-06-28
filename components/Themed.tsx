/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light //& keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = useThemeColor({}, "text");

  return (
    <DefaultText
      style={[{ color, fontFamily: "rubik-regular" }, style]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, "viewColor");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function BackgroundColor(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, "background");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function AnimatedView(props: AnimateProps<ViewProps>) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, "viewColor");

  return <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function AnimatedText(props: AnimateProps<TextProps>) {
  const { style, ...otherProps } = props;
  const color = useThemeColor({}, "text");

  return <Animated.Text style={[{ color }, style]} {...otherProps} />;
}
