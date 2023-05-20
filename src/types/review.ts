import type { Product } from "./products";
import type { User } from "./user";

export interface Review {
  _id: string;
  userName: string;
  user: User;
  product: Product;
  rating: number,
  content: string;
  createdAt: string;
  status: 'published' | 'unpublished' | 'flagged';
}