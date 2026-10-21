import {
  Box,
  Group,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { textColor } from '@/theme/colors';
import type { TopCustomersReport, TopCustomersSortBy } from '../../types/reports';
import { TopCustomerCard } from './TopCustomerCard';

const SORT_LABELS: Record<TopCustomersSortBy, string> = {
  revenue: 'Receita',
  orders: 'Pedidos',
  kg: 'Kg',
};

interface TopCustomersSectionProps {
  report?: TopCustomersReport;
  isLoading: boolean;
  isError: boolean;
  sortBy: TopCustomersSortBy;
  onSortByChange: (value: TopCustomersSortBy) => void;
}

export function TopCustomersSection({
  report,
  isLoading,
  isError,
  sortBy,
  onSortByChange,
}: TopCustomersSectionProps) {
  const items = report?.items ?? [];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Title order={2} fz={22} fw={800} c={textColor}>
          Melhores clientes
        </Title>
        <SegmentedControl
          size="xs"
          color="plum.6"
          value={sortBy}
          onChange={(value) => onSortByChange(value as TopCustomersSortBy)}
          data={(Object.keys(SORT_LABELS) as TopCustomersSortBy[]).map((value) => ({
            value,
            label: SORT_LABELS[value],
          }))}
        />
      </Group>

      {isLoading && (
        <Stack gap="md">
          <Skeleton height={70} radius="md" />
          <Skeleton height={70} radius="md" />
          <Skeleton height={70} radius="md" />
        </Stack>
      )}

      {isError && (
        <Text c="rejected" size="sm">
          Não foi possível carregar o ranking de clientes.
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
            Nenhum cliente com pedido aceito ou concluído no período.
          </Text>
        </Box>
      )}

      {report && !isError && items.length > 0 && (
        <Stack gap="md">
          {items.map((customer, index) => (
            <TopCustomerCard
              key={customer.customerId}
              customer={customer}
              position={index + 1}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
