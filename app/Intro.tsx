import { Text } from "@/components/ui/Text";
import { spacing } from "@/utils/theme";
import { translations } from "@/utils/translations";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { useScreen } from "@/hooks/useScreen";
import { usePostHog } from "posthog-react-native";
const WIDTH = Dimensions.get("window").width;
const Intro = () => {
  const screen = useScreen();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("Intro page loaded", { screen });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/intro.png")}
        contentFit="contain"
        style={{
          width: WIDTH,
          aspectRatio: 1,
        }}
      />
      <Text style={styles.header} variant="xl">
        {translations.IntroTitle}
      </Text>
      <Text style={styles.subtitle} variant="l">
        {translations.IntroSubtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.m,
  },
  header: {
    marginTop: spacing.xl,
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.s,
    textAlign: "center",
    maxWidth: 320,
  },
});

export default Intro;
