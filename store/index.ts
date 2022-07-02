import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Units } from "../types";

import type { productActionTypes, UserProduct } from "./product/actionTypes";
import { productReducer } from "./product/reducer";

const initalState: UserProduct = {
  id: 1,
  name: "Milk",
  amount: 0,
  favorite: false,
  unit: Units.Piece,
  category: { id: 2, name: "Diary" },
  image:
    // eslint-disable-next-line max-len
    "https://hinawi.co.il/wp-content/uploads/2020/10/%D7%97%D7%9C%D7%91-%D7%AA%D7%A0%D7%95%D7%91%D7%94-3-%D7%9C%D7%99%D7%98%D7%A8.jpg",
};

export interface ProductStoreType {
  products: Array<UserProduct>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: (args: { type: productActionTypes; payload: any }) => void;
}
export const useProductStore = create<ProductStoreType>()(
  persist(
    immer((set) => ({
      products: [initalState],
      dispatch: (args) => set((state) => productReducer(state, args)),
    }))
  )
);
