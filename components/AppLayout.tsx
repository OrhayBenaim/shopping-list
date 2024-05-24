import { useTheme } from "@/utils/theme";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Nav } from "@/components/Nav";
import { Drawer } from "expo-router/drawer";
import { translations } from "@/utils/translations";

export default function AppLayout() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor: theme.colors.mainBackground,
        },
      ]}
    >
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: translations.home,
            title: translations.home,
            headerShown: false,
            sceneContainerStyle: {
              backgroundColor: theme.colors.mainBackground,
            },
          }}
        />
        <Drawer.Screen
          name="Missing" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: translations.missingItems,
            headerShown: false,
            title: translations.missingItems,
            sceneContainerStyle: {
              backgroundColor: theme.colors.mainBackground,
            },
          }}
        />

        <Drawer.Screen
          name="Settings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: translations.settings,
            headerShown: false,
            title: translations.settings,
            sceneContainerStyle: {
              backgroundColor: theme.colors.mainBackground,
            },
          }}
        />
      </Drawer>

      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
