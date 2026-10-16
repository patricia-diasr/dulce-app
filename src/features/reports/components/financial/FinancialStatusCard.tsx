import { BarChart } from '@mantine/charts';
import { Box, Card, Divider, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import type { InvoiceStatus } from '@/features/orders/types/order';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import type { FinancialReport } from '../../types/reports';

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  PENDING: 'Sem pagamento',
  PARTIAL: 'Parcial',
  PAID: 'Pago',
};

interface FinancialStatusCardProps {
  report?: FinancialReport;
  isLoading: boolean;
}

export function FinancialStatusCard({ report, isLoading }: FinancialStatusCardProps) {
  const isEmpty = report !== undefined && report.summary.ordersCount === 0;

  return (
    <Card padding="lg">
      <Stack gap="md">
        <div>
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Situação dos pagamentos
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            A situação é calculada pelos pagamentos registrados em cada pedido.
          </Text>
        </div>

        {isLoading && <Skeleton height={280} radius="md" />}

        {isEmpty && (
          <Box
            style={{
              minHeight: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text c="dimmed" size="sm">
              Nenhum pedido aceito ou concluído no período.
            </Text>
          </Box>
        )}

        {report && !isEmpty && (
          <>
            <BarChart
              h={{ base: 240, sm: 280 }}
              data={report.byInvoiceStatus.map((item) => ({
                label: STATUS_LABELS[item.status],
                received: item.received,
                pending: item.pending,
              }))}
              dataKey="label"
              type="stacked"
              series={[
                { name: 'received', label: 'Recebido', color: 'accepted.6' },
                { name: 'pending', label: 'A receber', color: 'pending.6' },
              ]}
              valueFormatter={(value) => formatCurrency(value)}
              yAxisProps={{ width: 84 }}
              gridAxis="y"
              tickLine="y"
              withLegend
            />

            <Divider color="caramel.2" />

            <Stack gap="xs">
              {report.byInvoiceStatus.map((item) => (
                <Group key={item.status} justify="space-between" wrap="nowrap" gap="sm">
                  <Text size="sm" c={item.ordersCount === 0 ? 'dimmed' : undefined}>
                    {STATUS_LABELS[item.status]}
                  </Text>
                  <Group gap="sm" wrap="nowrap">
                    <Text size="sm" fw={700}>
                      {item.ordersCount} {item.ordersCount === 1 ? 'pedido' : 'pedidos'}
                    </Text>
                    <Text size="xs" c="dimmed" w={92} ta="right">
                      {formatCurrency(item.due)}
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
