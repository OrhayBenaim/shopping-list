import React, { useMemo } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { AnimatedView } from "./Themed";

interface CardType {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style: _style }: CardType) => {
  const calcualtedStyles = useMemo(() => {
    const stylesBorderR = _style?.borderRadius;

    if (!stylesBorderR) {
      return _style;
    }

    const calculatedBorderR = (_style?.width as number) / 5;
    return { ..._style, borderRadius: calculatedBorderR };
  }, [_style]);
  return (
    <AnimatedView style={[style.container, calcualtedStyles]}>
      {children}
    </AnimatedView>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
