import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { productActionTypes, UserProduct } from "./product/actionTypes";
import { productReducer } from "./product/reducer";

export interface ProductStoreType {
  products: Array<UserProduct>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: (args: { type: productActionTypes; payload: any }) => void;
}
export const useProductStore = create<ProductStoreType>()(
  persist(
    immer((set) => ({
      products: [],
      dispatch: (args) => set((state) => productReducer(state, args)),
    })),
    {
      name: "products",
      getStorage: () => AsyncStorage,
    }
  )
);
