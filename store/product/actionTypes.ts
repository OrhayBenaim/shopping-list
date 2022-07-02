import type { ProductType } from "../../types";

export enum productActionTypes {
  set,
  update,
}

export interface UserProduct extends ProductType {
  amount: number;
  favorite: boolean;
}
