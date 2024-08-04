import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-gesture-handler";
import { PopupProvider } from "@/components/Popup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BackHandler,
  I18nManager,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import AppLayout from "@/components/AppLayout";
import { CameraProvider } from "@/components/Camera";
import { observer } from "@legendapp/state/react";
import { settings } from "@/utils/store";
import { useNavigation } from "expo-router";
import { translations } from "@/utils/translations";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
SplashScreen.preventAutoHideAsync();

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
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          return false;
        }
        Alert.alert(
          translations.exitApp,
          translations.exitAppQuestion,
          [
            {
              text: translations.exitAppCancel,
              style: "cancel",
            },
            {
              text: translations.exitAppOk,
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {
            cancelable: false,
          }
        );

        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AutocompleteDropdownContextProvider>
      <View onLayout={onLayoutRootView} style={StyleSheet.absoluteFill}>
        <RootLayoutNav />
      </View>
    </AutocompleteDropdownContextProvider>
  );
}

const RootLayoutNav = observer(() => {
  const lang = settings.get().language;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <CameraProvider>
          <PopupProvider>
            <AppLayout />
          </PopupProvider>
        </CameraProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
});
