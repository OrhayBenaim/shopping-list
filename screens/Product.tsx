import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { Image, StyleSheet } from "react-native";
import type { SharedElementCompatRoute } from "react-navigation-shared-element";
import { SharedElement } from "react-navigation-shared-element";

import { BackgroundColor, View } from "../components/Themed";
import type { AuthParamList, ProductType } from "../types";

export const Product = () => {
  const route = useRoute<RouteProp<AuthParamList>>();
  const params = route.params as { product: ProductType };
  const product = useMemo(() => params.product, [params]);

  return (
    <BackgroundColor style={StyleSheet.absoluteFillObject}>
      <View style={styles.productShowcase}>
        <SharedElement
          style={StyleSheet.absoluteFillObject}
          id={`product-${product.id}.photo`}
        >
          <Image style={styles.image} source={{ uri: product.image }} />
        </SharedElement>
      </View>
    </BackgroundColor>
  );
};

Product.sharedElements = (route: SharedElementCompatRoute) => {
  const { product } = route.params as { product: ProductType };

  return [{ id: `product-${product.id}.photo` }];
};

const styles = StyleSheet.create({
  productShowcase: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
});
