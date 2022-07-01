import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Font, Layout } from "../../constants/Layout";
import type { IconName } from "../../types";
import { Text, useThemeColor, View } from "../Themed";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Layout.l,
    paddingHorizontal: Layout.s,
  },
  headerTitle: {
    fontSize: Font.l,
    textAlign: "center",
    flex: 1,
  },
});

interface HeaderProps {
  title: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

export function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftIconPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, "primary");
  const textLight = useThemeColor({}, "textLight");

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          backgroundColor: primaryColor,
        },
      ]}
    >
      {leftIcon && (
        <TouchableOpacity onPress={onLeftIconPress}>
          <Feather name={leftIcon} size={24} color={textLight} />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: textLight }]}>{title}</Text>
      {rightIcon && <Feather name={rightIcon} size={24} color={textLight} />}
    </View>
  );
}
