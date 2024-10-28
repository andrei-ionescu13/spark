export interface User {
  _id: string;
  email: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt?: Date;
  orders: any[]
  activeOrders: any[],
  ordersCount: number;
  totalSpend: number;
}