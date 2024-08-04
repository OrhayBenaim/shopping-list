import { Text } from "@/components/ui/Text";
import { spacing } from "@/utils/theme";
import { translations } from "@/utils/translations";
import { Image } from "expo-image";
import { Dimensions, View, StyleSheet } from "react-native";

const WIDTH = Dimensions.get("window").width;
const Share = () => {
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
