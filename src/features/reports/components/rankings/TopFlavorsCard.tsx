import { BarChart } from '@mantine/charts';
import {
  Box,
  Card,
  Divider,
  Group,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import type {
  TopFlavorItem,
  TopFlavorsReport,
  TopFlavorsSortBy,
} from '../../types/reports';
import { formatKg } from '../../utils/formatters';

const SORT_LABELS: Record<TopFlavorsSortBy, string> = {
  revenue: 'Receita',
  cakes: 'Bolos',
  kg: 'Kg',
};

function metricOf(item: TopFlavorItem, sortBy: TopFlavorsSortBy): number {
  if (sortBy === 'revenue') return item.grossRevenue;
  if (sortBy === 'cakes') return item.cakesCount;
  return item.totalKg;
}

function formatMetric(value: number, sortBy: TopFlavorsSortBy): string {
  if (sortBy === 'revenue') return formatCurrency(value);
  if (sortBy === 'cakes') return `${value} ${value === 1 ? 'bolo' : 'bolos'}`;
  return formatKg(value);
}

interface TopFlavorsCardProps {
  report?: TopFlavorsReport;
  isLoading: boolean;
  isError: boolean;
  sortBy: TopFlavorsSortBy;
  onSortByChange: (value: TopFlavorsSortBy) => void;
}

export function TopFlavorsCard({
  report,
  isLoading,
  isError,
  sortBy,
  onSortByChange,
}: TopFlavorsCardProps) {
  const items = report?.items ?? [];

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Recheios mais vendidos
          </Title>
          <SegmentedControl
            size="xs"
            color="plum.6"
            value={sortBy}
            onChange={(value) => onSortByChange(value as TopFlavorsSortBy)}
            data={(Object.keys(SORT_LABELS) as TopFlavorsSortBy[]).map((value) => ({
              value,
              label: SORT_LABELS[value],
            }))}
          />
        </Group>

        {isLoading && <Skeleton height={300} radius="md" />}

        {isError && (
          <Text c="rejected" size="sm">
            Não foi possível carregar o ranking de recheios.
          </Text>
        )}

        {report && !isError && items.length === 0 && (
          <Box
            style={{
              minHeight: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text c="dimmed" size="sm">
              Nenhum bolo vendido no período selecionado.
            </Text>
          </Box>
        )}

        {report && !isError && items.length > 0 && (
          <>
            <BarChart
              h={Math.max(220, items.length * 40 + 40)}
              data={items.map((item) => ({
                name: item.active ? item.name : `${item.name} (inativo)`,
                value: metricOf(item, sortBy),
              }))}
              dataKey="name"
              orientation="vertical"
              series={[{ name: 'value', label: SORT_LABELS[sortBy], color: 'plum.6' }]}
              valueFormatter={(value) => formatMetric(value, sortBy)}
              yAxisProps={{ width: 110 }}
              gridAxis="x"
              tickLine="x"
              withLegend={false}
            />

            <Divider color="caramel.2" />

            <Stack gap="sm">
              {items.map((item, index) => (
                <Group
                  key={item.flavorId}
                  justify="space-between"
                  align="start"
                  wrap="nowrap"
                  gap="sm"
                >
                  <Group gap="sm" align="start" wrap="nowrap" style={{ minWidth: 0 }}>
                    <Text fw={900} c="plum.6" w={24}>
                      {index + 1}
                    </Text>
                    <Stack gap={0} style={{ minWidth: 0 }}>
                      <Text fw={700} size="sm" style={{ overflowWrap: 'break-word' }}>
                        {item.name}
                        {!item.active && (
                          <Text span size="xs" c="dimmed">
                            {' '}
                            (inativo)
                          </Text>
                        )}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.cakesCount} {item.cakesCount === 1 ? 'bolo' : 'bolos'} ·{' '}
                        {formatKg(item.totalKg)}
                      </Text>
                    </Stack>
                  </Group>
                  <Text fw={800} size="sm" c="plum.7" style={{ whiteSpace: 'nowrap' }}>
                    {formatCurrency(item.grossRevenue)}
                  </Text>
                </Group>
              ))}
            </Stack>

            <Text size="xs" c="dimmed">
              A receita dos recheios é a soma dos valores dos bolos, antes dos descontos
              dados ao pedido inteiro.
            </Text>
          </>
        )}
      </Stack>
    </Card>
  );
}
