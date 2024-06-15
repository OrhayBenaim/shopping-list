import {
  Dimensions,
  ScrollView,
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
      "30%"
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          onChangeText={(value) => setSearch(value)}
          style={styles.input}
          placeholder={translations.search}
          containerStyles={{ flex: 1 }}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Ionicons size={30} name="menu-outline" />
        </TouchableOpacity>
      </View>
      <Categories
        categories={GetMissingCategories()}
        onCategoriesChange={setSelectedCategories}
      />
      {sortedCategories.map(([category, items]) => (
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
  searchContainer: {
    gap: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    fontSize: 18,
  },
});
