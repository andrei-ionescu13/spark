import type { Product } from "./products";
import type { Image } from "./common";

export interface Collection {
  description: string;
  title: string;
  slug: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  products: Product[];
  startDate: string;
  _id: string;
  cover: Image;
  isDeal: boolean;
  meta: {
    description: string;
    title: string;
    keywords: string[];
  }
}