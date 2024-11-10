import type { Image } from './common';
import type { Product } from './products';

export interface Deal {
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
  meta: {
    description: string;
    title: string;
    keywords: string[];
  };
}
