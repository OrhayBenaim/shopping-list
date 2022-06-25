import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { Font, Layout } from "../../constants/Layout";
import type { CategoryType } from "../../types";
import { useThemeColor } from "../Themed";

import type { CategoriesProps } from "./Categories";

interface CategoryProps {
  category: CategoryType;
  type: CategoriesProps["type"];
  selected: boolean;
  onSelect: (category: CategoryType) => void;
}

const categoryStyle = StyleSheet.create({
  tag: {
    borderRadius: Font.m,
    borderBottomStartRadius: 0,
    paddingVertical: Font.s / 2,
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    margin: Layout.s,
    elevation: 10,
  },
  nameTag: {
    fontSize: Font.m,
  },
});

export const Category = ({
  type,
  category,
  selected,
  onSelect,
}: CategoryProps) => {
  return type === "tags" ? <Tag {...{ category, selected, onSelect }} /> : null;
};

const Tag = ({ onSelect, category, selected }: Omit<CategoryProps, "type">) => {
  const primaryColor = useThemeColor({}, "primary");
  const textLight = useThemeColor({}, "textLight");

  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const active = useDerivedValue(
    () =>
      selected
        ? withTiming(1, { easing: Easing.exp })
        : withTiming(0, { easing: Easing.exp }),
    [selected]
  );

  const textStyles = useAnimatedStyle(
    () => ({
      color: interpolateColor(active.value, [1, 0], [textLight, textColor]),
    }),
    [active]
  );

  const bgStyles = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        active.value,
        [1, 0],
        [primaryColor, bgColor]
      ),
    }),
    [active]
  );

  return (
    <Pressable onPress={() => onSelect(category)}>
      <Animated.View style={[categoryStyle.tag, bgStyles]}>
        <Animated.Text style={[categoryStyle.nameTag, textStyles]}>
          {category.name}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};
