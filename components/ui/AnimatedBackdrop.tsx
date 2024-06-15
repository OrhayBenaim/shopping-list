import React from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Keyframe,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme";
import { StyleSheet } from "react-native";

const AnimatedBackdrop = () => {
  const theme = useTheme();

  const enteringAnimation = new Keyframe({
    0: {
      opacity: 0,
    },
    100: {
      opacity: 0.3,
      easing: Easing.inOut(Easing.ease),
    },
  }).duration(70);

  const exitingAnimation = new Keyframe({
    0: {
      opacity: 0.3,
    },
    100: {
      opacity: 0,
      easing: Easing.inOut(Easing.ease),
    },
  }).duration(70);

  return (
    <Animated.View
      entering={enteringAnimation}
      exiting={exitingAnimation}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: theme.colors.border,
        },
      ]}
    />
  );
};

export default AnimatedBackdrop;
