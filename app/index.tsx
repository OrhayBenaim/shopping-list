import {
  Dimensions,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  state,
} from "@/utils/store";
import { type Item } from "@/models/item";
import { useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import Categories from "@/components/Categories";
import ItemsComponent from "@/components/ItemsComponent";
import { translations } from "@/utils/translations";

const WIDTH = Dimensions.get("window").width;

const Home = observer(() => {
  const [search, setSearch] = useState("");
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

  const onItemDelete = (item: Item) => {
    onDelete(item);
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
    <ScrollView style={styles.container}>
      <TextInput
        onChangeText={(value) => setSearch(value)}
        style={styles.input}
        placeholder={translations.search}
      />
      <Categories
        categories={GetCategories()}
        onCategoriesChange={setSelectedCategories}
      />
      {Object.entries(itemsByCategories).map(([category, items]) => (
        <ItemsComponent
          ChangeQuantity={ChangeQuantity}
          DecreaseQuantity={DecreaseQuantity}
          IncreaseQuantity={IncreaseQuantity}
          onItemPress={onItemPress}
          key={category}
          items={items}
          category={category}
        />
      ))}
    </ScrollView>
  );
});
export default Home;
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
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
});
