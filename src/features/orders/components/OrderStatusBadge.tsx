import { Badge } from '@mantine/core';
import { ORDER_STATUS_LABELS } from '../constants/orderStatus';
import { orderStatusColor } from '@/theme/colors';
import type { OrderStatus } from '../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge color={orderStatusColor[status]} variant="light">
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
