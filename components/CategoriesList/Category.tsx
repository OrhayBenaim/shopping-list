import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { Font, Layout } from "../../constants/Layout";
import type { CategoryType } from "../../types";
import { Card } from "../Card";
import {
  AnimatedText,
  AnimatedView,
  BackgroundColor,
  Text,
  useThemeColor,
  View,
} from "../Themed";

import type { CategoriesProps } from "./Categories";

const SPACING = Layout.s;
interface CategoryProps {
  category: CategoryType;
  type: CategoriesProps["type"];
  selected: boolean;
  onSelect: (category: CategoryType) => void;
}

const Category = React.memo(
  ({ type, category, selected, onSelect }: CategoryProps) => {
    return type === "tags" ? (
      <Tag {...{ category, selected, onSelect }} />
    ) : (
      <ShadowCard {...{ category, selected, onSelect }} />
    );
  }
);

export { Category };

const TAG_WIDTH = 110;
const tagStyles = StyleSheet.create({
  container: {
    borderRadius: Font.m,
    borderBottomStartRadius: 0,
    paddingVertical: Font.s / 2,
    justifyContent: "center",
    alignItems: "center",
    width: TAG_WIDTH,
    margin: SPACING,
    position: "relative",
  },
  containerBg: {
    borderRadius: Font.m,
    borderBottomStartRadius: 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: Font.m,
  },
});
const Tag = ({ onSelect, category, selected }: Omit<CategoryProps, "type">) => {
  const primaryColor = useThemeColor({}, "primary");
  const textLight = useThemeColor({}, "textLight");

  const textColor = useThemeColor({}, "text");

  const active = useDerivedValue(
    () =>
      selected
        ? withTiming(1, { easing: Easing.exp })
        : withTiming(0, { easing: Easing.exp }),
    [selected]
  );

  const scaleAniamtion = useAnimatedStyle(
    () => ({
      transform: [{ scale: active.value }],
    }),
    [active]
  );

  return (
    <Pressable onPress={() => onSelect(category)}>
      <View style={tagStyles.container}>
        <Text style={[tagStyles.name, { color: textColor }]}>
          {category.name}
        </Text>

        <AnimatedView
          style={[
            tagStyles.containerBg,
            { backgroundColor: primaryColor },
            scaleAniamtion,
          ]}
        >
          <AnimatedText style={[tagStyles.name, { color: textLight }]}>
            {category.name}
          </AnimatedText>
        </AnimatedView>
      </View>
    </Pressable>
  );
};

const CARD_WIDTH = 110;
const cardStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: SPACING,
  },
  card: {
    elevation: 5,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    marginBottom: SPACING / 2,
  },
});
const ShadowCard = ({ onSelect, category }: Omit<CategoryProps, "type">) => {
  const lightAccent = useThemeColor({}, "lightAccent");

  return (
    <Pressable onPress={() => onSelect(category)}>
      <BackgroundColor style={cardStyles.container}>
        <Card style={cardStyles.card}>
          {category.icon ? (
            <Feather name={category.icon} size={24} color={lightAccent} />
          ) : null}
        </Card>
        <Text>{category.name}</Text>
      </BackgroundColor>
    </Pressable>
  );
};
