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
  IncreaseQuantity?: (item: Item) => void;
  DecreaseQuantity?: (item: Item) => void;
  ChangeQuantity?: (item: Item, quantity: string) => void;
  onItemPress: (item: Item) => void;
}
const ItemsComponent = observer(
  ({
    category,
    items,
    onItemPress,
    IncreaseQuantity,
    DecreaseQuantity,
    ChangeQuantity,
  }: Props) => {
    return (
      <View key={category} style={styles.container}>
        <Text variant="sm">{category}</Text>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ItemComponent
              onItemPress={onItemPress}
              item={item}
              IncreaseQuantity={IncreaseQuantity}
              DecreaseQuantity={DecreaseQuantity}
              ChangeQuantity={ChangeQuantity}
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
