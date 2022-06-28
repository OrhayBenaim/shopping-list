import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "./components/Themed";
import { useCachedResources } from "./hooks/useCachedResources";
import { Navigation } from "./navigation";

// eslint-disable-next-line import/no-default-export
export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return (
      <View>
        <Text style={{ fontFamily: "normal" }}>Loading</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
