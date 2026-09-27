import type { NestedOrder } from '@/features/orders/types/order';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

export type Order = NestedOrder;

export interface CustomerDetail extends Customer {
  orders: Order[];
}
