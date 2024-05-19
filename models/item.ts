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
