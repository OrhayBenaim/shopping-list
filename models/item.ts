export type Item = {
  id: string;
  name: string;
  quantity: number;
  missing: boolean;
  missingThreshold: number;
  category: string;
  updatedAt: number;
  image?: string;
};

export type FormItem = Omit<Item, "quantity" | "missingThreshold"> & {
  quantity: string;
  missingThreshold: string;
};

export const MAX_QUANTITY = 999 as const;
