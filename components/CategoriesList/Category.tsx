import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { Font, Layout } from "../../constants/Layout";
import type { CategoryType } from "../../types";
import { useThemeColor, View } from "../Themed";

import type { CategoriesProps } from "./Categories";

interface CategoryProps {
  category: CategoryType;
  type: CategoriesProps["type"];
  selected: boolean;
  onSelect: (category: CategoryType) => void;
}

export const Category = ({
  type,
  category,
  selected,
  onSelect,
}: CategoryProps) => {
  return type === "tags" ? <Tag {...{ category, selected, onSelect }} /> : null;
};

const WIDTH = 110;
const tagStyles = StyleSheet.create({
  container: {
    borderRadius: Font.m,
    borderBottomStartRadius: 0,
    paddingVertical: Font.s / 2,
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH,
    margin: Layout.s,
    elevation: 10,
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

  const activeTextStyles = useAnimatedStyle(
    () => ({
      opacity: withTiming(active.value),
    }),
    [active]
  );

  const textStyles = useAnimatedStyle(
    () => ({
      opacity: withTiming(interpolate(active.value, [1, 0], [0, 1])),
    }),
    [active]
  );

  const bgStyles = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(active.value, { duration: 75 }) }],
    }),
    [active]
  );

  return (
    <Pressable onPress={() => onSelect(category)}>
      <View style={[tagStyles.container]}>
        <Animated.View
          style={[
            tagStyles.containerBg,
            { backgroundColor: primaryColor },
            bgStyles,
          ]}
        >
          <Animated.Text
            style={[tagStyles.name, activeTextStyles, { color: textLight }]}
          >
            {category.name}
          </Animated.Text>
        </Animated.View>
        <Animated.Text
          style={[tagStyles.name, textStyles, { color: textColor }]}
        >
          {category.name}
        </Animated.Text>
      </View>
    </Pressable>
  );
};
