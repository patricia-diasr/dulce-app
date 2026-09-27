import { useState } from 'react';
import { Badge, Card, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { CustomerAvatar } from '@/shared/components/CustomerAvatar/CustomerAvatar';
import { orderStatusColor } from '@/theme/colors';
import { ORDER_STATUS_LABELS } from '../constants/orderStatus';
import { formatOrderItemsSummary } from '../utils/orderItemsSummary';
import type { OrderListItem } from '../types/order';

interface OrderListCardProps {
  order: OrderListItem;
}

export function OrderListCard({ order }: OrderListCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');

  const pickupDateTime = new Date(order.pickupAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <Card
      padding="lg"
      onClick={() => navigate(`/admin/pedidos/${order.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.10)' : undefined,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isVerySmallScreen
            ? '1fr'
            : isSmallScreen
              ? '48px minmax(0, 1fr)'
              : '60px minmax(0, 1fr)',
          gap: isSmallScreen ? '8px' : '12px',
          alignItems: 'start',
        }}
      >
        {!isVerySmallScreen && (
          <CustomerAvatar name={order.customerName} size={isSmallScreen ? 48 : 60} />
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gridTemplateRows: 'auto auto',
            columnGap: isSmallScreen ? '8px' : '16px',
            rowGap: '6px',
            alignItems: 'start',
            minWidth: 0,
          }}
        >
          <Text fw={900} size="xl" style={{ minWidth: 0, overflowWrap: 'break-word' }}>
            {order.customerName}
          </Text>

          <Badge
            color={orderStatusColor[order.status]}
            variant="light"
            style={{ flexShrink: 0 }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>

          <Stack gap={2} style={{ gridColumn: '1 / -1' }}>
            <Text size="sm" c="dimmed">
              {pickupDateTime}
            </Text>
            <Text size="sm" c="dimmed" style={{ overflowWrap: 'break-word' }}>
              {formatOrderItemsSummary(order.items)}
            </Text>
          </Stack>
        </div>
      </div>
    </Card>
  );
}
