import type { User } from "./user";

export interface LineItem {
  product: any;
  finalLinePrice: number
  finalPrice: number
  originalPrice: number
  originalLinePrice: number
  quantity: number
}

export type OrderStatus = 'open' | 'archived' | 'canceled';

export interface Order {
  _id: string;
  email: string;
  createdAt: Date;
  status: OrderStatus;
  orderNumber: string;
  paymentStatus: 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
  fulfillmentStatus: 'fulfilled' | 'unfulfilled' | 'partially fulfilled' | 'partially fulfilled';
  customer: User;
  itemCount: number;
  totalPrice: number;
  totalDiscounts: number;
  lineItems: LineItem[];
}