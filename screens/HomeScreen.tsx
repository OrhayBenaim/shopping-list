import { StyleSheet } from "react-native";

import { Card } from "../components/Card";
import { Categories } from "../components/CategoriesList/Categories";
import { BackgroundColor, Text } from "../components/Themed";
import type { HomeStackScreen, HomeStackScreenProps } from "../types";

export function HomeScreen({
  navigation,
}: HomeStackScreenProps<HomeStackScreen.HomeScreen>) {
  return (
    <BackgroundColor>
      <Categories title="All Categories" type="normal" />
      <Text style={styles.title}>Home</Text>
      <Card>
        <Text>Card</Text>
      </Card>
    </BackgroundColor>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});
