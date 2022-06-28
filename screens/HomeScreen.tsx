import { StyleSheet } from "react-native";

import { Categories } from "../components/CategoriesList/Categories";
import { Text, View } from "../components/Themed";
import type { HomeStackScreen, HomeStackScreenProps } from "../types";

export function HomeScreen({
  navigation,
}: HomeStackScreenProps<HomeStackScreen.HomeScreen>) {
  return (
    <View>
      <Categories title="All Categories" type="tags" />
      <Text style={styles.title}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});
