import type { Image } from "./common";
import type { Genre } from "./genres";
import type { Platform } from "./platforms";
import type { Publisher } from "./publishers";
import type { User } from "./user";

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductReview {
  _id: string;
  userName: string;
  user: User;
  product: string;
  rating: number,
  content: string;
  createdAt: string;
}

export interface Product {
  rating: {
    distribution: {
      '1': number,
      '2': number,
      '3': number,
      '4': number,
      '5': number,
    },
    average: number;
  };
  reviews: ProductReview[];
  slug: string;
  _id: string;
  cover: Image;
  images: Image[];
  selectedImages: Image[];
  videos: string[];
  title: string;
  price: number;
  initialPrice: number;
  genres: Genre[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  publisher: Publisher;
  developers: string[];
  languages: string[];
  features: string[];
  link: string;
  platform: Platform;
  markdown: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  status: ProductStatus;
  minimumRequirements: string;
  recommendedRequirements: string;
  os: string[];
}


export interface Bundle {
  title: string;
  id: string;
  createdAt: Date;
  status: 'draft' | 'published';
}

