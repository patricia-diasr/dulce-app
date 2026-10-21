import { useState } from 'react';
import { Grid } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTopCustomersReport, getTopFlavorsReport } from '../../api/reportsApi';
import type {
  ReportPeriod,
  TopCustomersSortBy,
  TopFlavorsSortBy,
} from '../../types/reports';
import { TopCustomersSection } from './TopCustomersSection';
import { TopFlavorsCard } from './TopFlavorsCard';

const RANKING_LIMIT = 10;

interface RankingsTabProps {
  period: ReportPeriod;
  periodError: string | null;
}

export function RankingsTab({ period, periodError }: RankingsTabProps) {
  const [flavorSortBy, setFlavorSortBy] = useState<TopFlavorsSortBy>('revenue');
  const [customerSortBy, setCustomerSortBy] = useState<TopCustomersSortBy>('revenue');

  const flavorsQuery = useQuery({
    queryKey: [
      'admin',
      'reports',
      'top-flavors',
      period.from,
      period.to,
      flavorSortBy,
      RANKING_LIMIT,
    ],
    queryFn: () =>
      getTopFlavorsReport({ ...period, sortBy: flavorSortBy, limit: RANKING_LIMIT }),
    enabled: !periodError,
    placeholderData: keepPreviousData,
  });

  const customersQuery = useQuery({
    queryKey: [
      'admin',
      'reports',
      'top-customers',
      period.from,
      period.to,
      customerSortBy,
      RANKING_LIMIT,
    ],
    queryFn: () =>
      getTopCustomersReport({ ...period, sortBy: customerSortBy, limit: RANKING_LIMIT }),
    enabled: !periodError,
    placeholderData: keepPreviousData,
  });

  return (
    <Grid columns={10} gap="xl">
      <Grid.Col span={{ base: 10, lg: 6 }}>
        <TopFlavorsCard
          report={flavorsQuery.data}
          isLoading={flavorsQuery.isLoading}
          isError={flavorsQuery.isError}
          sortBy={flavorSortBy}
          onSortByChange={setFlavorSortBy}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 10, lg: 4 }}>
        <TopCustomersSection
          report={customersQuery.data}
          isLoading={customersQuery.isLoading}
          isError={customersQuery.isError}
          sortBy={customerSortBy}
          onSortByChange={setCustomerSortBy}
        />
      </Grid.Col>
    </Grid>
  );
}
