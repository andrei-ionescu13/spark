import type { Product } from "./products";

export interface Discount {
  endDate: Date;
  products: Product[];
  startDate: Date;
  title: string;
  type: string;
  value: number;
  _id: string;
} 