import type { ProductStoreType } from "..";

import { productActionTypes } from "./actionTypes";

type actionType = {
  type: productActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export const productReducer = (
  state: ProductStoreType,
  { type, payload }: actionType
) => {
  switch (type) {
    case productActionTypes.set:
      state.products = payload;
  }
};
