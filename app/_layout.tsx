import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import * as DevClient from "expo-dev-client";
import { PopupProvider } from "@/components/Popup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BackHandler, I18nManager } from "react-native";
import theme from "@/utils/theme";
import AppLayout from "@/components/AppLayout";
import { CameraProvider } from "@/components/Camera";

I18nManager.forceRTL(true);
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CameraProvider>
          <PopupProvider>
            <AppLayout />
          </PopupProvider>
        </CameraProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
