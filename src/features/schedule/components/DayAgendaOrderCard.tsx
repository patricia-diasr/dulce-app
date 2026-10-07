import { useState } from 'react';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CustomerAvatar } from '@/shared/components/CustomerAvatar/CustomerAvatar';
import { ORDER_STATUS_LABELS } from '@/features/orders/constants/orderStatus';
import { orderStatusColor } from '@/theme/colors';
import { formatOrderItemsSummary } from '@/features/orders/utils/orderItemsSummary';
import { toBusinessTime } from '@/shared/utils/businessDate';
import type { OrderListItem } from '@/features/orders/types/order';

interface DayAgendaOrderCardProps {
  order: OrderListItem;
}

export function DayAgendaOrderCard({ order }: DayAgendaOrderCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const time = toBusinessTime(order.pickupAt).format('HH:mm');

  return (
    <Card
      padding="md"
      onClick={() => navigate(`/admin/pedidos/${order.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 6px 16px rgba(0, 0, 0, 0.08)' : undefined,
      }}
    >
      <Group align="center" wrap="nowrap" gap="sm">
        <Text fw={900} c="plum.7" style={{ width: 44, flexShrink: 0 }}>
          {time}
        </Text>
        <CustomerAvatar name={order.customerName} size={36} />
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} size="sm" style={{ overflowWrap: 'break-word' }}>
            {order.customerName}
          </Text>
          <Text size="xs" c="dimmed">
            {formatOrderItemsSummary(order.items)}
          </Text>
        </Stack>
        <Badge
          color={orderStatusColor[order.status]}
          variant="light"
          size="sm"
          style={{ flexShrink: 0 }}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </Group>
    </Card>
  );
}
