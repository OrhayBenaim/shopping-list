import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { observer } from "@legendapp/state/react";
import {
  ChangeQuantity,
  DecreaseQuantity,
  FilteredItemsByCategories,
  FilteredItemsByName,
  GetCategories,
  GetItems,
  IncreaseQuantity,
  ItemsByCategories,
  onDelete,
  onUpdate,
} from "@/utils/store";
import { type Item } from "@/models/item";
import { useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import Categories from "@/components/Categories";
import ItemsComponent from "@/components/ItemsComponent";
import { useNavigation } from "expo-router";
import SearchInput from "@/components/ui/Search";

const WIDTH = Dimensions.get("window").width;

const Home = observer(() => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { setContent, setOpen } = usePopup();

  const filteredItems = FilteredItemsByName(
    FilteredItemsByCategories(GetItems(), selectedCategories),
    search
  );
  const itemsByCategories = ItemsByCategories(filteredItems);

  const onItemPopupSave = (item: Item) => {
    setOpen(false);
    onUpdate(item);
  };

  const onItemDelete = (itemId: string) => {
    onDelete(itemId);
    setOpen(false);
  };

  const onItemPress = (item: Item) => {
    setContent(
      <ItemForm
        deleteAble
        onDelete={onItemDelete}
        onSubmit={onItemPopupSave}
        item={item}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchInput onChangeText={setSearch} />
      <Categories
        categories={GetCategories()}
        onCategoriesChange={setSelectedCategories}
      />
      <FlatList
        style={{ flex: 1 }}
        data={Object.entries(itemsByCategories)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, item] }) => (
          <ItemsComponent
            ChangeQuantity={ChangeQuantity}
            DecreaseQuantity={DecreaseQuantity}
            IncreaseQuantity={IncreaseQuantity}
            onItemPress={onItemPress}
            key={category}
            items={item}
            category={category}
          />
        )}
      />
    </View>
  );
});
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
