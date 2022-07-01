import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { Card } from "../components/Card";
import { Categories } from "../components/CategoriesList/Categories";
import { BackgroundColor, Text } from "../components/Themed";
import { Font } from "../constants/Layout";
import type { AuthParamList, ProductType } from "../types";
import { HomeStackScreen, Units } from "../types";

const Products: Array<ProductType> = [
  {
    id: 1,
    name: "Milk",
    unit: Units.Piece,
    category: { id: 2, name: "Diary" },
    image:
      // eslint-disable-next-line max-len
      "https://hinawi.co.il/wp-content/uploads/2020/10/%D7%97%D7%9C%D7%91-%D7%AA%D7%A0%D7%95%D7%91%D7%94-3-%D7%9C%D7%99%D7%98%D7%A8.jpg",
  },
];
export function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthParamList>>();
  const NavigateToProduct = useCallback(
    (product) => {
      navigation.navigate(HomeStackScreen.Product, { product });
    },
    [navigation]
  );

  return (
    <BackgroundColor>
      <Categories title="All Categories" type="normal" />
      <Text style={styles.title}>Home</Text>
      {Products.map((product) => (
        <Pressable
          onPress={() => NavigateToProduct(product)}
          key={`product-${product.id}`}
        >
          <Card
            style={styles.card}
            renderDescription={() => (
              <Text style={styles.description}>{product.name}</Text>
            )}
          >
            <SharedElement
              style={StyleSheet.absoluteFillObject}
              id={`product-${product.id}.photo`}
            >
              <Image style={styles.image} source={{ uri: product.image }} />
            </SharedElement>
          </Card>
        </Pressable>
      ))}
    </BackgroundColor>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  card: {
    height: 250,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: Font.l,
    textAlign: "center",
  },
});
