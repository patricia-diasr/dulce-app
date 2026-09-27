import { useState } from 'react';
import { Badge, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CustomerAvatar } from '@/shared/components/CustomerAvatar/CustomerAvatar';
import { orderStatusColor } from '@/theme/colors';
import { ORDER_STATUS_LABELS } from '../constants/orderStatus';
import { formatOrderItemsSummary } from '../utils/orderItemsSummary';
import type { OrderListItem } from '../types/order';

interface DashboardOrderRowProps {
  order: OrderListItem;
}

export function DashboardOrderRow({ order }: DashboardOrderRowProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const pickupDate = new Date(order.pickupAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap="sm"
      onClick={() => navigate(`/admin/pedidos/${order.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        padding: 8,
        margin: -8,
        borderRadius: 8,
        backgroundColor: isHovered ? 'var(--mantine-color-lilac-0)' : undefined,
        transition: 'background-color 150ms ease',
      }}
    >
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <CustomerAvatar name={order.customerName} />
        <Stack gap={0} style={{ minWidth: 0 }}>
          <Text fw={700} size="sm" style={{ overflowWrap: 'break-word' }}>
            {order.customerName}
          </Text>
          <Text size="xs" c="dimmed">
            {pickupDate}
          </Text>
          <Text size="xs" c="dimmed">
            {formatOrderItemsSummary(order.items)}
          </Text>
        </Stack>
      </Group>

      <Badge
        color={orderStatusColor[order.status]}
        variant="light"
        style={{ flexShrink: 0 }}
      >
        {ORDER_STATUS_LABELS[order.status]}
      </Badge>
    </Group>
  );
}
