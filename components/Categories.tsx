import { useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import Tag from "@/components/ui/Tag";
import { observer } from "@legendapp/state/react";
import { settings } from "@/utils/store";

interface CategoriesProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}
const Categories = observer(
  ({ categories, onCategoriesChange }: CategoriesProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const onCategoryToggle = (category: string) => {
      let copy = [...selectedCategories];
      const index = copy.indexOf(category);
      if (index !== -1) {
        copy.splice(index, 1);
      } else {
        copy.push(category);
      }
      onCategoriesChange(copy);
      setSelectedCategories(copy);
    };

    return (
      <FlatList
        inverted={settings.get().isRTL}
        horizontal
        style={styles.categories}
        contentContainerStyle={styles.categories}
        data={categories}
        renderItem={({ item }) => (
          <Tag
            label={item}
            onPress={() => {
              onCategoryToggle(item);
            }}
          />
        )}
        keyExtractor={(category) => category}
      />
    );
  }
);

export default Categories;
const styles = StyleSheet.create({
  categories: {
    gap: 10,
    paddingVertical: 10,
    flexGrow: 0,
  },
});
