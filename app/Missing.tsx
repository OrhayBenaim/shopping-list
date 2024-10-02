import { FlatList, StyleSheet, View } from "react-native";
import { observer } from "@legendapp/state/react";
import {
  FilteredItemsByCategories,
  FilteredItemsByName,
  GetMissingCategories,
  GetMissingItems,
  ItemsByCategories,
  onUpdate,
} from "@/utils/store";
import { useEffect, useMemo, useState } from "react";
import ItemsComponent from "@/components/ItemsComponent";
import Categories from "@/components/Categories";
import SearchInput from "@/components/ui/Search";
import { usePostHog } from "posthog-react-native";
import { useScreen } from "@/hooks/useScreen";

const Missing = observer(() => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const posthog = usePostHog();
  const screen = useScreen();

  const filteredItems = FilteredItemsByName(
    FilteredItemsByCategories(GetMissingItems(), selectedCategories),
    search
  );

  const itemsByCategories = ItemsByCategories(filteredItems);

  const sortedCategories = useMemo(() => {
    return Object.entries(itemsByCategories).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [itemsByCategories]);

  useEffect(() => {
    posthog.capture("Missing page loaded", { screen });
  }, []);

  return (
    <View style={styles.container}>
      <SearchInput onChangeText={setSearch} />

      <Categories
        categories={GetMissingCategories()}
        onCategoriesChange={setSelectedCategories}
      />

      <FlatList
        style={{ flex: 1 }}
        data={sortedCategories}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, items] }) => (
          <ItemsComponent
            key={category}
            items={items}
            category={category}
            ToggleMissing={onUpdate}
          />
        )}
      />
    </View>
  );
});
export default Missing;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
