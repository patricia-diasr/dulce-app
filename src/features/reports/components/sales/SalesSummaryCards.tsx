import { SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { Cake, ClipboardList, Receipt, Scale, Wallet } from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard/StatCard';
import { formatCurrency } from '@/shared/utils/currency';
import type { SalesMetrics } from '../../types/reports';
import { formatKg } from '../../utils/formatters';
import { REPORT_STAT_COLOR } from '../../constants/statCard';

interface SalesSummaryCardsProps {
  summary?: SalesMetrics;
  isLoading: boolean;
}

export function SalesSummaryCards({ summary, isLoading }: SalesSummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={90} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Stack gap="xs">
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }}>
        <StatCard
          icon={Wallet}
          label="Receita líquida"
          value={formatCurrency(summary.netAmount)}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={ClipboardList}
          label="Pedidos"
          value={summary.ordersCount}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={Cake}
          label="Bolos"
          value={summary.itemsCount}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={Scale}
          label="Quilos de bolo"
          value={formatKg(summary.totalKg)}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={Receipt}
          label="Ticket médio"
          value={formatCurrency(summary.averageTicket)}
          color={REPORT_STAT_COLOR}
        />
      </SimpleGrid>
      <Text size="xs" c="dimmed">
        Receita bruta de {formatCurrency(summary.grossAmount)} menos{' '}
        {formatCurrency(summary.discountAmount)} em descontos.
      </Text>
    </Stack>
  );
}
