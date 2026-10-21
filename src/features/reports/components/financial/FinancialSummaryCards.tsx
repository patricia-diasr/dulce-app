import { SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { ClipboardList, Clock, Receipt, Wallet } from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard/StatCard';
import { formatCurrency } from '@/shared/utils/currency';
import type { FinancialReport } from '../../types/reports';
import { REPORT_STAT_COLOR } from '../../constants/statCard';

interface FinancialSummaryCardsProps {
  summary?: FinancialReport['summary'];
  isLoading: boolean;
}

export function FinancialSummaryCards({
  summary,
  isLoading,
}: FinancialSummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={90} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Stack gap="xs">
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        <StatCard
          icon={Receipt}
          label="Total devido"
          value={formatCurrency(summary.totalDue)}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={Wallet}
          label="Recebido"
          value={formatCurrency(summary.totalReceived)}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={Clock}
          label="A receber"
          value={formatCurrency(summary.totalPending)}
          color={REPORT_STAT_COLOR}
        />
        <StatCard
          icon={ClipboardList}
          label="Pedidos"
          value={summary.ordersCount}
          color={REPORT_STAT_COLOR}
        />
      </SimpleGrid>
      <Text size="xs" c="dimmed">
        Considera pedidos aceitos e concluídos, já com os descontos aplicados.
      </Text>
    </Stack>
  );
}
