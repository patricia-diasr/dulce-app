import { BarChart } from '@mantine/charts';
import {
  Box,
  Card,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import type { SalesGroupBy, SalesReport } from '../../types/reports';
import { buildSalesChartData } from '../../utils/salesChart';

const GROUP_BY_LABELS: Record<SalesGroupBy, string> = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mês',
};

interface SalesChartCardProps {
  report?: SalesReport;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  groupBy: SalesGroupBy;
  availableGroupBy: SalesGroupBy[];
  onGroupByChange: (value: SalesGroupBy) => void;
}

export function SalesChartCard({
  report,
  isLoading,
  isFetching,
  isError,
  groupBy,
  availableGroupBy,
  onGroupByChange,
}: SalesChartCardProps) {
  const hasSales = (report?.summary.ordersCount ?? 0) > 0;

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Receita líquida
          </Title>
          <SegmentedControl
            size="xs"
            color="plum.6"
            value={groupBy}
            onChange={(value) => onGroupByChange(value as SalesGroupBy)}
            data={(Object.keys(GROUP_BY_LABELS) as SalesGroupBy[]).map((value) => ({
              value,
              label: GROUP_BY_LABELS[value],
              disabled: !availableGroupBy.includes(value),
            }))}
          />
        </Group>

        {isLoading && <Skeleton height={300} radius="md" />}

        {isError && (
          <Text c="rejected" size="sm">
            Não foi possível carregar o relatório de vendas. Tente novamente em instantes.
          </Text>
        )}

        {report && !isError && !hasSales && (
          <Box
            style={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text c="dimmed" size="sm">
              Nenhuma venda no período selecionado.
            </Text>
          </Box>
        )}

        {report && !isError && hasSales && (
          <Box pos="relative">
            <LoadingOverlay
              visible={isFetching}
              loaderProps={{ color: 'plum' }}
              overlayProps={{ blur: 1 }}
            />
            <BarChart
              h={{ base: 240, sm: 300 }}
              data={buildSalesChartData(report.series, groupBy)}
              dataKey="label"
              series={[{ name: 'netAmount', label: 'Receita líquida', color: 'plum.6' }]}
              valueFormatter={(value) => formatCurrency(value)}
              yAxisProps={{ width: 84 }}
              xAxisProps={{ minTickGap: 12 }}
              gridAxis="y"
              tickLine="y"
              withLegend={false}
            />
          </Box>
        )}

        {report && groupBy !== 'day' && (
          <Text size="xs" c="dimmed">
            {groupBy === 'week'
              ? '"Sem." indica a semana que começa naquela segunda-feira. '
              : ''}
            O primeiro e o último período podem ser parciais: só entram os pedidos dentro
            das datas escolhidas.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
