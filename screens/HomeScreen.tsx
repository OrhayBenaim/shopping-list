import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { Card } from "../components/Card";
import { Categories } from "../components/CategoriesList/Categories";
import { BackgroundColor, Text } from "../components/Themed";
import { Font } from "../constants/Layout";
import { useProductStore } from "../store";
import type { AuthParamList } from "../types";
import { Units, HomeStackScreen } from "../types";

export function HomeScreen() {
  const { products, setProducts } = useProductStore((state) => state);
  const navigation = useNavigation<StackNavigationProp<AuthParamList>>();
  const NavigateToProduct = useCallback(
    (product) => {
      navigation.navigate(HomeStackScreen.Product, { product });
    },
    [navigation]
  );

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Milk",
        amount: 0,
        favorite: false,
        unit: Units.Piece,
        category: { id: 2, name: "Diary" },
        image:
          // eslint-disable-next-line max-len
          "https://images.squarespace-cdn.com/content/v1/60271465598ca61a670b27b0/9ad36907-601b-4ba3-a5c0-246559def497/Camperdown+Fresh+Whole+Milk+2L.png",
      },
    ]);
  }, [setProducts]);

  return (
    <BackgroundColor>
      <Categories title="All Categories" type="normal" />
      <Text style={styles.title}>Home</Text>
      {products.map((product) => (
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
