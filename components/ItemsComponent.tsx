import { View, StyleSheet } from "react-native";
import { observer } from "@legendapp/state/react";
import { Item } from "@/models/item";
import ItemComponent from "./Item";
import { Text } from "@/components/ui/Text";
import { FlatList } from "react-native-gesture-handler";
import { spacing } from "@/utils/theme";

interface Props {
  items: Item[];
  category: string;
  ToggleMissing?: (item: Item) => void;
  onItemPress?: (item: Item) => void;
}
const ItemsComponent = observer(
  ({ category, items, onItemPress, ToggleMissing }: Props) => {
    return (
      <View key={category} style={styles.container}>
        <Text variant="sm">{category}</Text>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ItemComponent
              onItemPress={onItemPress}
              item={item}
              onToggleMissing={ToggleMissing}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.s,
    flexDirection: "column",
  },
});

export default ItemsComponent;
