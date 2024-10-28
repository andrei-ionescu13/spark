import type { Product } from "./products";
import type { User } from "./user";

export interface PromoCode {
  code: string;
  endDate: string | null;
  productSelection: 'general' | 'selected';
  products: Product[] | null;
  startDate: string;
  type: 'amount' | 'percentage';
  userSelection: 'general' | 'selected';
  users: User[] | null;
  value: number
  _id: string;
}