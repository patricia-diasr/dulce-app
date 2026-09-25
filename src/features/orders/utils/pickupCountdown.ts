import dayjs from 'dayjs';

export function formatPickupCountdown(pickupAt: string): string {
  const pickup = dayjs(pickupAt);
  const now = dayjs();
  const diffDays = pickup.startOf('day').diff(now.startOf('day'), 'day');

  if (diffDays <= 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  return `Em ${diffDays} dias`;
}
