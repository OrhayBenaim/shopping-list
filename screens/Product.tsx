import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { Image, StyleSheet } from "react-native";
import type { SharedElementCompatRoute } from "react-navigation-shared-element";
import { SharedElement } from "react-navigation-shared-element";

import { BackgroundColor, Text, View } from "../components/Themed";
import { Layout } from "../constants/Layout";
import type { AuthParamList, ProductType } from "../types";

const { height, width } = Layout.window;
export const Product = () => {
  const route = useRoute<RouteProp<AuthParamList>>();
  const params = route.params as { product: ProductType };
  const product = useMemo(() => params.product, [params]);

  return (
    <BackgroundColor style={styles.bgContainer}>
      <BackgroundColor>
        <SharedElement
          style={styles.imageContainer}
          id={`product-${product.id}.photo`}
        >
          <Image style={styles.image} source={{ uri: product.image }} />
        </SharedElement>
      </BackgroundColor>
      <View style={styles.details}>
        <Text>{product.name}</Text>
      </View>
    </BackgroundColor>
  );
};

Product.sharedElements = (route: SharedElementCompatRoute) => {
  const { product } = route.params as { product: ProductType };

  return [{ id: `product-${product.id}.photo` }];
};

const styles = StyleSheet.create({
  bgContainer: {},
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: width,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "80%",
  },
  details: {
    height: height,
    borderRadius: Layout.xl,
    paddingVertical: Layout.xl,
    paddingHorizontal: Layout.s,
  },
});
