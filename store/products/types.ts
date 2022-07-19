import type { ProductType } from "../../types";

export interface UserProduct extends ProductType {
  amount: number;
  favorite: boolean;
}
