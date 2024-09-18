import { Text } from "@/components/ui/Text";
import { useScreen } from "@/hooks/useScreen";
import { spacing } from "@/utils/theme";
import { translations } from "@/utils/translations";
import { Image } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import { Dimensions, View, StyleSheet } from "react-native";

const WIDTH = Dimensions.get("window").width;
const Share = () => {
  const screen = useScreen();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("Share page loaded", { screen });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/share.png")}
        contentFit="contain"
        style={{
          width: WIDTH,
          aspectRatio: 1,
        }}
      />
      <Text style={styles.header} variant="xl">
        {translations.comingSoon}
      </Text>
      <Text style={styles.subtitle} variant="l">
        {translations.ShareFeatureDescription}
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
    maxWidth: 200,
  },
});

export default Share;
