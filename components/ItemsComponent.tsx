import { StyleSheet, View } from "react-native";
import { observer } from "@legendapp/state/react";
import { Item } from "@/models/item";
import ItemComponent from "./Item";
import { Text } from "@/components/ui/Text";
import { settings } from "@/utils/store";

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
      <View key={category}>
        <Text>{category}</Text>
        {items.map((item) => (
          <ItemComponent
            onItemPress={onItemPress}
            item={item}
            key={item.id}
            IncreaseQuantity={IncreaseQuantity}
            DecreaseQuantity={DecreaseQuantity}
            ChangeQuantity={ChangeQuantity}
          />
        ))}
      </View>
    );
  }
);
export default ItemsComponent;
