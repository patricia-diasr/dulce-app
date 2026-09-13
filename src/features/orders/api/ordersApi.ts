import { apiClient } from '@/lib/api/client';
import type {
  CreateOrderPayload,
  InvoiceResponse,
  OrderResponse,
  PaymentPayload,
} from '../types/order';

export async function getOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.get<OrderResponse>(`/orders/${orderId}`);
  return data;
}

export async function createOrder(
  customerId: number,
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(
    `/customers/${customerId}/orders`,
    payload,
  );
  return data;
}

export async function updateOrder(
  orderId: number,
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const { data } = await apiClient.patch<OrderResponse>(`/orders/${orderId}`, payload);
  return data;
}

export async function acceptOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(`/orders/${orderId}/accept`);
  return data;
}

export async function rejectOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(`/orders/${orderId}/reject`);
  return data;
}

export async function cancelOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(`/orders/${orderId}/cancel`);
  return data;
}

export async function completeOrder(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(`/orders/${orderId}/complete`);
  return data;
}

export async function createPayment(
  orderId: number,
  payload: PaymentPayload,
): Promise<InvoiceResponse> {
  const { data } = await apiClient.post<InvoiceResponse>(
    `/orders/${orderId}/payments`,
    payload,
  );
  return data;
}

export async function updatePayment(
  orderId: number,
  paymentId: number,
  payload: Partial<PaymentPayload>,
): Promise<InvoiceResponse> {
  const { data } = await apiClient.patch<InvoiceResponse>(
    `/orders/${orderId}/payments/${paymentId}`,
    payload,
  );
  return data;
}

export async function deletePayment(orderId: number, paymentId: number): Promise<void> {
  await apiClient.delete(`/orders/${orderId}/payments/${paymentId}`);
}
