import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { Font, Layout } from "../../constants/Layout";
import type { CategoryType } from "../../types";
import { Text, View } from "../Themed";

import { Category } from "./Category";

export interface CategoriesProps {
  title: string;
  type: "tags" | "normal";
}

const categoriesStyle = StyleSheet.create({
  title: {
    fontSize: Font.xl,
  },
  categoriesContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    paddingHorizontal: Layout.s / 2,
  },
});

export const Categories = ({ title, type }: CategoriesProps) => {
  const categories: Array<CategoryType> = [
    { id: 1, name: "Fruits", icon: "archive" },
    { id: 2, name: "Vegetables", icon: "archive" },
    { id: 3, name: "Bakery", icon: "archive" },
    { id: 4, name: "Drink", icon: "archive" },
  ];

  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

  const onSelect = (category: CategoryType) => {
    setSelectedIndex(category.id);
  };

  return (
    <View>
      <View>
        <Text style={categoriesStyle.title}>{title}</Text>
      </View>
      <ScrollView
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator={false}
        style={categoriesStyle.categoriesContainer}
      >
        {categories.map((category, index) => (
          <Category
            selected={selectedIndex === category.id}
            {...{ category, onSelect, type }}
            key={`category_${index}`}
          />
        ))}
      </ScrollView>
    </View>
  );
};
