import { DonutChart } from '@mantine/charts';
import { Box, Card, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { ORDER_STATUS_LABELS } from '@/features/orders/constants/orderStatus';
import { formatCurrency } from '@/shared/utils/currency';
import { orderStatusColor, textColor } from '@/theme/colors';
import type { OrdersByStatusReport } from '../../types/reports';

interface OrdersByStatusCardProps {
  report?: OrdersByStatusReport;
  isLoading: boolean;
  isError: boolean;
}

export function OrdersByStatusCard({
  report,
  isLoading,
  isError,
}: OrdersByStatusCardProps) {
  const total = report?.total.ordersCount ?? 0;

  return (
    <Card padding="lg">
      <Stack gap="md">
        <div>
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Pedidos por status
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            Todos os pedidos com retirada no período, de qualquer status.
          </Text>
        </div>

        {isLoading && <Skeleton height={260} radius="md" />}

        {isError && (
          <Text c="rejected" size="sm">
            Não foi possível carregar os pedidos por status.
          </Text>
        )}

        {report && !isError && total === 0 && (
          <Text c="dimmed" size="sm">
            Nenhum pedido no período selecionado.
          </Text>
        )}

        {report && !isError && total > 0 && (
          <>
            <Group justify="center">
              <DonutChart
                size={170}
                thickness={26}
                chartLabel={String(total)}
                valueFormatter={(value) =>
                  `${value} ${value === 1 ? 'pedido' : 'pedidos'}`
                }
                data={report.byStatus.map((item) => ({
                  name: ORDER_STATUS_LABELS[item.status],
                  value: item.ordersCount,
                  color: `${orderStatusColor[item.status]}.6`,
                }))}
              />
            </Group>

            <Stack gap="xs">
              {report.byStatus.map((item) => (
                <Group key={item.status} justify="space-between" wrap="nowrap" gap="sm">
                  <Group gap={8} wrap="nowrap">
                    <Box
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        flexShrink: 0,
                        backgroundColor: `var(--mantine-color-${orderStatusColor[item.status]}-6)`,
                      }}
                    />
                    <Text size="sm" c={item.ordersCount === 0 ? 'dimmed' : undefined}>
                      {ORDER_STATUS_LABELS[item.status]}
                    </Text>
                  </Group>
                  <Group gap="sm" wrap="nowrap">
                    <Text size="sm" fw={700}>
                      {item.ordersCount}
                    </Text>
                    <Text size="xs" c="dimmed" w={92} ta="right">
                      {formatCurrency(item.netAmount)}
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}
