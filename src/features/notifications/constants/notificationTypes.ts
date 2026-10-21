import type { NotificationTypeCode } from '../types/notificationTemplate';

export const NOTIFICATION_TYPE_ORDER: NotificationTypeCode[] = [
  'ORDER_CREATED',
  'ORDER_UPDATED',
  'ORDER_ACCEPTED',
  'ORDER_REJECTED',
  'ORDER_CANCELED',
  'ORDER_COMPLETED',
  'PICKUP_REMINDER',
  'PAYMENT_UPDATED',
];
