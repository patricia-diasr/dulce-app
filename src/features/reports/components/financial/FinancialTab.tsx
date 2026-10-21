import { Box, Grid, Stack, Text } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getFinancialReport } from '../../api/reportsApi';
import type { ReportPeriod } from '../../types/reports';
import { FinancialStatusCard } from './FinancialStatusCard';
import { FinancialSummaryCards } from './FinancialSummaryCards';
import { PendingOrdersSection } from './PendingOrdersSection';

interface FinancialTabProps {
  period: ReportPeriod;
  periodError: string | null;
}

export function FinancialTab({ period, periodError }: FinancialTabProps) {
  const query = useQuery({
    queryKey: ['admin', 'reports', 'financial', period.from, period.to],
    queryFn: () => getFinancialReport(period),
    enabled: !periodError,
    placeholderData: keepPreviousData,
  });

  if (query.isError) {
    return (
      <Box
        style={{
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Text c="rejected">
          Não foi possível carregar o relatório financeiro. Tente novamente em instantes.
        </Text>
      </Box>
    );
  }

  const report = query.data;

  return (
    <Stack gap="xl">
      <FinancialSummaryCards summary={report?.summary} isLoading={query.isLoading} />

      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 4 }}>
          <Stack gap="xl">
            <FinancialStatusCard report={report} isLoading={query.isLoading} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 10, lg: 6 }}>
          <PendingOrdersSection report={report} isLoading={query.isLoading} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
