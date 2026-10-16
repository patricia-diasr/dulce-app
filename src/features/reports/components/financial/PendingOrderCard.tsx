import { useState } from 'react';
import { Card, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CustomerAvatar } from '@/shared/components/CustomerAvatar/CustomerAvatar';
import { formatCurrency } from '@/shared/utils/currency';
import { toBusinessTime } from '@/shared/utils/businessDate';
import { formatPhoneNumber } from '@/shared/utils/phone';
import type { PendingCompletedOrder } from '../../types/reports';

interface PendingOrderCardProps {
  order: PendingCompletedOrder;
}

export function PendingOrderCard({ order }: PendingOrderCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const pickupDate = toBusinessTime(order.pickupAt).format('DD/MM/YYYY');

  return (
    <Card
      padding="lg"
      onClick={() => navigate(`/admin/pedidos/${order.orderId}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.10)' : undefined,
      }}
    >
      <Group justify="space-between" align="start" wrap="nowrap" gap="md">
        <Group gap="sm" align="start" wrap="nowrap" style={{ minWidth: 0 }}>
          <CustomerAvatar name={order.customerName} size={44} />
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text fw={800} style={{ overflowWrap: 'break-word' }}>
              {order.customerName}
            </Text>
            <Text size="sm" c="dimmed">
              {formatPhoneNumber(order.customerPhone)}
            </Text>
            <Text size="sm" c="dimmed">
              Pedido #{order.orderId} · retirada em {pickupDate}
            </Text>
          </Stack>
        </Group>

        <Stack gap={2} align="end" style={{ flexShrink: 0 }}>
          <Text size="xs" c="dimmed">
            Saldo
          </Text>
          <Text fw={900} fz={20} c="rejected.7" style={{ whiteSpace: 'nowrap' }}>
            {formatCurrency(order.balance)}
          </Text>
          <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
            Pago {formatCurrency(order.amountPaid)} de {formatCurrency(order.netAmount)}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
