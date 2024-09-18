import "react-native-get-random-values";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useLayoutEffect } from "react";
import { usePopup } from "./Popup";
import ItemForm from "./ItemForm";
import { onInsert, SetIntro, settings } from "@/utils/store";
import { Item } from "@/models/item";
import { Text } from "@/components/ui/Text";
import * as Crypto from "expo-crypto";
import { colors, spacing } from "@/utils/theme";
import ShareIcon from "./ui/icons/Share";
import { usePostHog } from "posthog-react-native";
import { useScreen } from "@/hooks/useScreen";

const INDICATOR_POSITIONS = {
  "/": 0,
  "/Missing": 20,
} as {
  [key: string]: number;
};

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const posthog = usePostHog();
  const screen = useScreen();

  const { setContent, setOpen } = usePopup();
  const left = useSharedValue(INDICATOR_POSITIONS[pathname]);
  const showIntro = settings.get().showIntro;

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
    posthog.capture("Created item", { screen });

    if (showIntro) {
      SetIntro(false);
      router.replace("/");
    }
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

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onAddPress} style={styles.createButton}>
          <Ionicons size={30} color={colors.primary} name="add" />
        </TouchableOpacity>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons
              size={20}
              color={colors.foreground}
              name={pathname === "/" ? "home" : "home-outline"}
            />
            <Text variant="sm" style={styles.linkText}>
              Home
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/Missing" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons
              size={20}
              color={colors.foreground}
              name={pathname === "/Missing" ? "cart" : "cart-outline"}
            />
            <Text variant="sm" style={styles.linkText}>
              Missing
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/Share" asChild>
          <TouchableOpacity style={{ ...styles.link, ...styles.alignEnd }}>
            <ShareIcon
              style={{ transform: [{ scale: 0.85 }] }}
              variant={pathname === "/Share" ? "primary" : "default"}
            />
            <Text variant="sm" style={styles.linkText}>
              Share
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/Settings" asChild>
          <TouchableOpacity style={styles.link}>
            <Ionicons
              size={20}
              color={colors.foreground}
              name={pathname === "/Settings" ? "settings" : "settings-outline"}
            />
            <Text variant="sm" style={styles.linkText}>
              Settings
            </Text>
          </TouchableOpacity>
        </Link>
        <Animated.View
          style={[styles.indicator, animatedStyles]}
        ></Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    paddingVertical: spacing.m,
  },
  container: {
    position: "relative",
    backgroundColor: colors.primary,
    flexDirection: "row-reverse",
    borderRadius: 9999,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  createButton: {
    position: "absolute",
    left: "50%",
    top: -25,
    borderWidth: 4,
    borderColor: colors.primary,
    padding: spacing.s,
    transform: [
      {
        translateX: -5,
      },
    ],
    backgroundColor: colors.foreground,
    borderRadius: 9999,
  },

  indicator: {
    borderRadius: 9999,
    backgroundColor: colors.foreground,
    position: "absolute",
    bottom: 5,
  },
  link: {
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.s,
  },
  alignEnd: {
    marginEnd: "auto",
  },
  linkText: {
    color: colors.foreground,
  },
});
