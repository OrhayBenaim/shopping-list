import { FlatList, StyleSheet, View } from "react-native";
import { observer } from "@legendapp/state/react";
import {
  FilteredItemsByCategories,
  FilteredItemsByName,
  GetCategories,
  GetItems,
  ItemsByCategories,
  onDelete,
  onUpdate,
} from "@/utils/store";
import { type Item } from "@/models/item";
import { useEffect, useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import Categories from "@/components/Categories";
import ItemsComponent from "@/components/ItemsComponent";
import SearchInput from "@/components/ui/Search";
import { usePostHog } from "posthog-react-native";
import { useScreen } from "@/hooks/useScreen";

const Home = observer(() => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const posthog = usePostHog();
  const screen = useScreen();

  const { setContent, setOpen } = usePopup();

  const filteredItems = FilteredItemsByName(
    FilteredItemsByCategories(GetItems(), selectedCategories),
    search
  );
  const itemsByCategories = ItemsByCategories(filteredItems);

  const onItemPopupSave = (item: Item) => {
    setOpen(false);
    onUpdate(item);
    posthog.capture("Updated item", { screen });
  };

  const onItemDelete = (itemId: string) => {
    onDelete(itemId);
    setOpen(false);
    posthog.capture("Delete item", { screen });
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

  useEffect(() => {
    posthog.capture("Home page loaded", { screen });
  }, []);

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
            onItemPress={onItemPress}
            key={category}
            items={item}
            category={category}
            ToggleMissing={onUpdate}
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
