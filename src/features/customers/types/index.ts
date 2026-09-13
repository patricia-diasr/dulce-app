import type { NestedOrder } from '@/features/orders/types/order';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type Order = NestedOrder;

export interface CustomerDetail extends Customer {
  orders: Order[];
}
