import { Product } from "./products";

export interface Key {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  value: string;
  status: "secret" | "revealed" | "reported";
  availability: "available" | "unavailable";
  product?: Product;
}
