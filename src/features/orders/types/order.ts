import type { CakeBase } from '@/shared/utils/cakeBase';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'COMPLETED';
export type CreationChannel = 'CUSTOMER' | 'ADMIN';
export type InvoiceStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface OrderItemPayload {
  flavorId: number;
  sizeId: number;
  cakeBase: CakeBase;
  topping: CakeBase;
  message?: string;
  notes?: string;
}

export interface CreateOrderPayload {
  pickupAt: string;
  notes?: string;
  discount?: number;
  items: OrderItemPayload[];
}

export interface OrderItemResponse {
  id: number;
  flavorId: number;
  flavorName: string;
  sizeId: number;
  sizeName: string;
  cakeBase: CakeBase;
  topping: CakeBase;
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

export interface PaymentPayload {
  amount: number;
  paymentMethod: string;
}

export interface InvoiceResponse {
  id: number;
  grossAmount: number;
  discount: number;
  status: InvoiceStatus;
  refundDue?: number;
  payments: Payment[];
}

export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  pickupAt: string;
  completedAt: string | null;
  status: OrderStatus;
  creationChannel: CreationChannel;
  notes: string | null;
  items: OrderItemResponse[];
  invoice: InvoiceResponse | null;
}

export type NestedOrder = Omit<
  OrderResponse,
  'customerId' | 'customerName' | 'customerPhone'
>;
