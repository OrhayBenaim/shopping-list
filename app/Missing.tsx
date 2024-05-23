import { Dimensions, I18nManager, ScrollView, StyleSheet } from "react-native";
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
import { useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import ItemsComponent from "@/components/ItemsComponent";
import Categories from "@/components/Categories";
import { translations } from "@/utils/translations";
import { TextInput } from "@/components/ui/TextInput";

const WIDTH = Dimensions.get("window").width;

const Missing = observer(() => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { setContent, setOpen } = usePopup();

  const filteredItems = FilteredItemsByName(
    FilteredItemsByCategories(GetMissingItems(), selectedCategories),
    search
  );

  const itemsByCategories = ItemsByCategories(filteredItems);

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
      "30%"
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        onChangeText={(value) => setSearch(value)}
        style={styles.input}
        placeholder={translations.search}
      />
      <Categories
        categories={GetMissingCategories()}
        onCategoriesChange={setSelectedCategories}
      />
      {Object.entries(itemsByCategories).map(([category, items]) => (
        <ItemsComponent
          onItemPress={onItemPress}
          key={category}
          items={items}
          category={category}
        />
      ))}
    </ScrollView>
  );
});
export default Missing;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    width: WIDTH,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    fontSize: 18,
  },
});
