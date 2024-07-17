import "react-native-get-random-values";
import {
  Dimensions,
  I18nManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname } from "expo-router";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useLayoutEffect } from "react";
import { usePopup } from "./Popup";
import ItemForm from "./ItemForm";
import { onInsert } from "@/utils/store";
import { Item } from "@/models/item";
import { useTheme } from "@/utils/theme";
import * as Crypto from "expo-crypto";

const WIDTH = Dimensions.get("window").width;
const ADD_BUTTON_SIZE = WIDTH / 4;
const ICON_SIZE = WIDTH / 8;

const INDICATOR_SIZE = ICON_SIZE * 1.2;

const INDICATOR_POSITIONS = {
  "/": WIDTH / 4 - ICON_SIZE,
  "/Missing": WIDTH - WIDTH / 4,
} as {
  [key: string]: number;
};

export function Nav() {
  const theme = useTheme();
  const pathname = usePathname();
  const { setContent, setOpen } = usePopup();
  const left = useSharedValue(INDICATOR_POSITIONS[pathname]);

  useLayoutEffect(() => {
    left.value = INDICATOR_POSITIONS[pathname];
  }, [pathname]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: withTiming(left.value, {
        duration: 500,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
      }),
    };
  });

  const onInsertItem = (item: Item) => {
    onInsert(item);
    setOpen(false);
  };
  const onAddPress = () => {
    setContent(
      <ItemForm
        item={{
          name: "",
          category: "",
          quantity: 0,
          missingThreshold: 0,
          missing: true,
          id: Crypto.randomUUID(),
          updatedAt: new Date().getTime(),
        }}
        onSubmit={onInsertItem}
      />
    );
  };

  if (INDICATOR_POSITIONS[pathname] === undefined) return null;
  return (
    <View style={styles.container}>
      <Svg fill="none" style={styles.svg} viewBox="0 0 360 85">
        <Path
          fill={theme.colors.primaryAction}
          fillRule="evenodd"
          d="M135.123 8.034a10.753 10.753 0 0 1-1.448-2.081 10.772 10.772 0 0 0-9.917-5.695L19.234 4.263C8.494 4.675 0 13.501 0 24.25V85h360V24.248c0-10.747-8.494-19.573-19.234-19.985L237.504.307a12.422 12.422 0 0 0-11.586 6.857c-.32.64-.693 1.248-1.116 1.821C222.661 33.115 203.42 52 180 52c-23.727 0-43.165-19.383-44.877-43.966Z"
          clipRule="evenodd"
        />
      </Svg>

      <TouchableOpacity
        onPress={onAddPress}
        style={[
          styles.addButton,
          {
            backgroundColor: theme.colors.mainBackground,
            borderRadius: ADD_BUTTON_SIZE / 2,
          },
        ]}
      >
        <Ionicons
          size={ADD_BUTTON_SIZE}
          color={theme.colors.primaryAction}
          name="add-circle-outline"
        />
      </TouchableOpacity>

      <Link href="/" style={styles.homeButton}>
        <Ionicons
          size={ICON_SIZE}
          color={theme.colors.mainBackground}
          name="home-outline"
        />
      </Link>

      <Link href="/Missing" style={styles.missingButton}>
        <Ionicons
          size={ICON_SIZE}
          color={theme.colors.mainBackground}
          name="cart-outline"
        />
      </Link>

      <Animated.View
        style={[
          styles.indicator,
          animatedStyles,
          {
            backgroundColor: theme.colors.mainBackground,
          },
        ]}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  svg: {
    width: "100%",
    aspectRatio: 360 / 85,
  },
  indicator: {
    height: INDICATOR_SIZE / 15,
    width: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 10,
    position: "absolute",
    bottom: INDICATOR_SIZE / 8,
    transform: [
      {
        translateX:
          ((INDICATOR_SIZE - ICON_SIZE) / 2) * (I18nManager.isRTL ? 1 : -1),
      },
    ],
  },
  addButton: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [
      { translateX: (ADD_BUTTON_SIZE / 2) * (I18nManager.isRTL ? 1 : -1) },
      { translateY: -ADD_BUTTON_SIZE / 2.3 },
    ],
  },
  homeButton: {
    position: "absolute",
    top: "60%",
    left: INDICATOR_POSITIONS["/"],
    transform: [{ translateY: -ICON_SIZE / 1.8 }],
  },
  missingButton: {
    position: "absolute",
    top: "60%",
    left: INDICATOR_POSITIONS["/Missing"],
    transform: [{ translateY: -ICON_SIZE / 1.8 }],
  },
});
