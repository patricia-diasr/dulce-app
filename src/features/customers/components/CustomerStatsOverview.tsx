import { Card, Divider, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ORDER_STATUS_LABELS } from '@/features/orders/constants/orderStatus';
import type { OrderStatus } from '@/features/orders/types/order';
import { orderStatusColor } from '@/theme/colors';
import { formatCurrency } from '@/shared/utils/currency';
import type { Order } from '../types';

interface CustomerStatsOverviewProps {
  orders: Order[];
}

const STATUS_ORDER: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'COMPLETED',
  'REJECTED',
  'CANCELED',
];

export function CustomerStatsOverview({ orders }: CustomerStatsOverviewProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');

  const totalOrders = orders.length;
  const totalPaid = orders.reduce(
    (sum, order) =>
      sum + (order.invoice?.payments.reduce((s, p) => s + p.amount, 0) ?? 0),
    0,
  );
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  })).filter((entry) => entry.count > 0);

  return (
    <Card padding="lg">
      <Stack gap="lg">
        <div>
          <Text size="sm" c="dimmed">
            Total pago
          </Text>
          <Text
            fw={900}
            c="plum.7"
            fz={isSmallScreen ? 26 : 32}
            style={{ overflowWrap: 'break-word' }}
          >
            {formatCurrency(totalPaid)}
          </Text>
        </div>

        <Divider color="caramel.2" />

        <Stack gap={6}>
          <Text size="sm" c="dimmed">
            {totalOrders} {totalOrders === 1 ? 'pedido no total' : 'pedidos no total'}
          </Text>

          {totalOrders > 0 && (
            <Group gap={2} style={{ height: 10, borderRadius: 6, overflow: 'hidden' }}>
              {statusCounts.map(({ status, count }) => (
                <div
                  key={status}
                  style={{
                    flex: count,
                    height: '100%',
                    backgroundColor: `var(--mantine-color-${orderStatusColor[status]}-5)`,
                  }}
                />
              ))}
            </Group>
          )}
        </Stack>

        <Stack gap="xs">
          {statusCounts.map(({ status, count }) => (
            <Group key={status} justify="space-between">
              <Group gap={6}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: `var(--mantine-color-${orderStatusColor[status]}-5)`,
                  }}
                />
                <Text size="sm">{ORDER_STATUS_LABELS[status]}</Text>
              </Group>
              <Text size="sm" fw={700}>
                {count}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
