import type { CakeBase } from '@/shared/utils/cakeBase';
import type { CreationChannel, OrderStatus } from '@/features/orders/types/order';

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

export interface OrderItem {
  id: number;
  flavorId: number;
  flavorName: string;
  sizeId: number;
  sizeName: string;
  topping: CakeBase;
  cakeBase: CakeBase;
  unitPrice: number;
  message: string | null;
  notes: string | null;
}

export interface Payment {
  id: number;
  amount: number;
  paidAt: string;
  paymentMethod: string;
}

export interface Invoice {
  id: number;
  grossAmount: number;
  discount: number;
  status: string;
  payments: Payment[];
}

export interface Order {
  id: number;
  createdAt: string;
  pickupAt: string;
  completedAt: string | null;
  status: OrderStatus;
  creationChannel: CreationChannel;
  notes: string | null;
  items: OrderItem[];
  invoice: Invoice | null;
}

export interface CustomerDetail extends Customer {
  orders: Order[];
}
