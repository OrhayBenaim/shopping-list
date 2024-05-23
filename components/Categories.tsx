import { useState } from "react";
import { StyleSheet } from "react-native";
import Tag from "@/components/ui/Tag";
import { ScrollView } from "react-native-gesture-handler";
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
      <ScrollView
        horizontal
        contentContainerStyle={[
          styles.categories,
          {
            flexDirection: settings.get().isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        {categories.map((category) => (
          <Tag
            label={category}
            key={category}
            onPress={() => {
              onCategoryToggle(category);
            }}
          />
        ))}
      </ScrollView>
    );
  }
);

export default Categories;
const styles = StyleSheet.create({
  categories: {
    gap: 10,
    paddingVertical: 10,
    flex: 1,
  },
});
