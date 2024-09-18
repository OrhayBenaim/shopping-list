export type Item = {
  id: string;
  name: string;
  missing: boolean;
  category: string;
  updatedAt: number;
  image?: string;
  blurHash?: string;
};

export type FormItem = Item;
export const MAX_QUANTITY = 999 as const;
