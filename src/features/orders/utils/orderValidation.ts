import dayjs from 'dayjs';
import type { CartItem } from '../hooks/useOrderCart';
import type { OrderResponse } from '../types/order';
import { calculateGrossAmount } from './pricing';

export const MIN_HOURS_BEFORE_PICKUP = 72;
export const MIN_HOURS_BEFORE_CANCEL = 12;

export function isDiscountValid(discount: number | null, items: CartItem[]): boolean {
  if (discount == null) return true;
  const grossAmount = calculateGrossAmount(items);
  return discount >= 0 && discount <= grossAmount;
}

export function isPickupTooSoon(
  pickupDate: string | null,
  pickupTime: string | null,
): boolean {
  if (!pickupDate || !pickupTime) return false;
  const pickupDateTime = dayjs(`${pickupDate}T${pickupTime}`);
  const minPickupAt = dayjs().add(MIN_HOURS_BEFORE_PICKUP, 'hour');
  return pickupDateTime.isBefore(minPickupAt);
}

export function hoursUntilPickup(pickupAt: string): number {
  return dayjs(pickupAt).diff(dayjs(), 'hour', true);
}

export function canCustomerEditOrder(
  order: Pick<OrderResponse, 'status' | 'pickupAt'>,
): boolean {
  if (order.status === 'PENDING') return true;
  if (order.status === 'ACCEPTED')
    return hoursUntilPickup(order.pickupAt) >= MIN_HOURS_BEFORE_PICKUP;
  return false;
}

export function canCustomerCancelOrder(
  order: Pick<OrderResponse, 'status' | 'pickupAt'>,
): boolean {
  if (order.status !== 'PENDING' && order.status !== 'ACCEPTED') return false;
  return hoursUntilPickup(order.pickupAt) >= MIN_HOURS_BEFORE_CANCEL;
}
