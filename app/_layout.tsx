import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { PopupProvider } from "@/components/Popup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BackHandler, I18nManager } from "react-native";
import theme from "@/utils/theme";
import AppLayout from "@/components/AppLayout";
import { CameraProvider } from "@/components/Camera";
import { observer } from "@legendapp/state/react";
import { settings } from "@/utils/store";

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

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

const RootLayoutNav = observer(() => {
  const lang = settings.get().language;
  return (
    <ThemeProvider theme={theme} key={lang}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CameraProvider>
          <PopupProvider>
            <AppLayout />
          </PopupProvider>
        </CameraProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
});
