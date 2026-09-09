import { apiClient } from '@/lib/api/client';
import type { CreateOrderPayload, OrderResponse } from '../types/order';

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
