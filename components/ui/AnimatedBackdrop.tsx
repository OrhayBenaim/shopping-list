import React from "react";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { colors } from "@/utils/theme";

const AnimatedBackdrop = () => {
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
          backgroundColor: colors.secondary,
        },
      ]}
    />
  );
};

export default AnimatedBackdrop;
