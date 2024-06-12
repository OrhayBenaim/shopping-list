import {
  Dimensions,
  ScrollView,
  StyleSheet,
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
} from "@/utils/store";
import { type Item } from "@/models/item";
import { useState } from "react";
import { usePopup } from "@/components/Popup";
import ItemForm from "@/components/ItemForm";
import Categories from "@/components/Categories";
import ItemsComponent from "@/components/ItemsComponent";
import { translations } from "@/utils/translations";
import { TextInput } from "@/components/ui/TextInput";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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
