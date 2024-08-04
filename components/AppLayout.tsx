import { StyleSheet, View } from "react-native";
import { Nav } from "@/components/Nav";
import { colors, spacing } from "@/utils/theme";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { SetIntro, settings, state } from "@/utils/store";

export default function AppLayout() {
  const router = useRouter();
  const showIntro = settings.get().showIntro;
  const list = state.get();
  useEffect(() => {
    if (showIntro && list && list.length === 0) {
      router.replace("/Intro");
    }
    if (list && list.length > 0) {
      SetIntro(false);
    }
  }, []);
  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor: colors.foreground,
        },
      ]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            contentStyle: {
              backgroundColor: colors.foreground,
            },
          }}
        />
        <Stack.Screen
          name="Missing"
          options={{
            contentStyle: {
              backgroundColor: colors.foreground,
            },
          }}
        />
        <Stack.Screen
          name="Share"
          options={{
            contentStyle: {
              backgroundColor: colors.foreground,
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          options={{
            contentStyle: {
              backgroundColor: colors.foreground,
            },
          }}
        />
        <Stack.Screen
          name="Intro"
          options={{
            contentStyle: {
              backgroundColor: colors.foreground,
            },
          }}
        />
      </Stack>

      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
});
