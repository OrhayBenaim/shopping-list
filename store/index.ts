import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { UserProduct } from "./products/types";
import { setProducts } from "./products/actions";

export interface ProductStoreType {
  products: Array<UserProduct>;
  computed: { productsLength: number };

  setProducts: (products: Array<UserProduct>) => void;
}
export const useProductStore = create<ProductStoreType>()(
  persist(
    immer((set, get) => ({
      products: [],
      computed: {
        get productsLength() {
          return get().products.length;
        },
      },
      setProducts: (products) => set((state) => setProducts(state, products)),
    })),
    {
      name: "products",
      getStorage: () => AsyncStorage,
    }
  )
);
