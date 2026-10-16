import { useState } from 'react';
import { Grid, Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getOrdersByStatusReport, getSalesReport } from '../../api/reportsApi';
import type { ReportPeriod, SalesGroupBy } from '../../types/reports';
import { getAutoGroupBy, getAvailableGroupBy } from '../../utils/salesChart';
import { OrdersByStatusCard } from './OrdersByStatusCard';
import { SalesChartCard } from './SalesChartCard';
import { SalesSummaryCards } from './SalesSummaryCards';

interface SalesTabProps {
  period: ReportPeriod;
  periodError: string | null;
}

export function SalesTab({ period, periodError }: SalesTabProps) {
  const [groupByOverride, setGroupByOverride] = useState<SalesGroupBy | null>(null);

  const availableGroupBy = getAvailableGroupBy(period);
  const groupBy =
    groupByOverride && availableGroupBy.includes(groupByOverride)
      ? groupByOverride
      : getAutoGroupBy(period);

  const salesQuery = useQuery({
    queryKey: ['admin', 'reports', 'sales', period.from, period.to, groupBy],
    queryFn: () => getSalesReport({ ...period, groupBy }),
    enabled: !periodError,
    placeholderData: keepPreviousData,
  });

  const statusQuery = useQuery({
    queryKey: ['admin', 'reports', 'orders-by-status', period.from, period.to],
    queryFn: () => getOrdersByStatusReport(period),
    enabled: !periodError,
    placeholderData: keepPreviousData,
  });

  return (
    <Stack gap="xl">
      <SalesSummaryCards
        summary={salesQuery.data?.summary}
        isLoading={salesQuery.isLoading}
      />

      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 6 }}>
          <SalesChartCard
            report={salesQuery.data}
            isLoading={salesQuery.isLoading}
            isFetching={salesQuery.isFetching}
            isError={salesQuery.isError}
            groupBy={groupBy}
            availableGroupBy={availableGroupBy}
            onGroupByChange={setGroupByOverride}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 10, lg: 4 }}>
          <OrdersByStatusCard
            report={statusQuery.data}
            isLoading={statusQuery.isLoading}
            isError={statusQuery.isError}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
