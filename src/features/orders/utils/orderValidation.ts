import dayjs from 'dayjs';
import type { CartItem } from '../hooks/useOrderCart';
import { calculateGrossAmount } from './pricing';

export const MIN_HOURS_BEFORE_PICKUP = 72;

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
