import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Font, Layout } from "../../constants/Layout";
import type { IconName } from "../../types";
import { BackgroundColor, Text, useThemeColor, View } from "../Themed";

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
  transparent?: boolean;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

export function Header({
  title,
  leftIcon,
  rightIcon,
  transparent,
  onLeftIconPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, "primary");
  const textLight = useThemeColor({}, "textLight");
  const text = useThemeColor({}, "text");

  const textColor = transparent ? text : textLight;

  return (
    <BackgroundColor>
      <View
        style={[
          styles.header,
          {
            position: transparent ? "absolute" : undefined,
            paddingTop: insets.top,
            backgroundColor: transparent ? "transparent" : primaryColor,
          },
        ]}
      >
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress}>
            <Feather name={leftIcon} size={24} color={textColor} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
        {rightIcon && <Feather name={rightIcon} size={24} color={textColor} />}
      </View>
    </BackgroundColor>
  );
}
