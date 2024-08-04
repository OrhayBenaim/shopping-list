import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { observer } from "@legendapp/state/react";
import {
  FilteredItemsByCategories,
  FilteredItemsByName,
  GetMissingCategories,
  GetMissingItems,
  ItemsByCategories,
  onUpdate,
} from "@/utils/store";
import type { Item } from "@/models/item";
import { useMemo, useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import ItemsComponent from "@/components/ItemsComponent";
import Categories from "@/components/Categories";
import { translations } from "@/utils/translations";
import { TextInput } from "@/components/ui/TextInput";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SearchInput from "@/components/ui/Search";

const WIDTH = Dimensions.get("window").width;

const Missing = observer(() => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { setContent, setOpen } = usePopup();
  const navigation = useNavigation();

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

  const onItemPopupSave = (item: Item) => {
    setOpen(false);
    onUpdate(item);
  };

  const onItemPress = (item: Item) => {
    setContent(
      <ItemForm
        onSubmit={onItemPopupSave}
        hiddenFields={["category", "missingThreshold", "name", "camera"]}
        item={item}
      />,
      "25%"
    );
  };

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
            onItemPress={onItemPress}
            key={category}
            items={items}
            category={category}
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
