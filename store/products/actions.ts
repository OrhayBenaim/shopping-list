import type { ProductStoreType } from "..";

import type { UserProduct } from "./types";

export const setProducts = (
  state: ProductStoreType,
  product: Array<UserProduct>
) => {
  state.products = product;
};
