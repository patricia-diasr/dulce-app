import { Box, Container, Grid, Skeleton, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { getCustomer } from '../api/customersApi';
import { CustomerInfoCard } from '../components/CustomerInfoCard';
import { CustomerOrdersSection } from '../components/CustomerOrdersSection';
import { CustomerStatsOverview } from '../components/CustomerStatsOverview';

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const isSmallScreen = useMediaQuery('(max-width: 399px)');

  const customerIdNumber = Number(customerId);
  const hasValidCustomerId = Number.isInteger(customerIdNumber) && customerIdNumber > 0;

  const {
    data: customer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'customers', customerIdNumber],
    queryFn: () => getCustomer(customerIdNumber),
    enabled: hasValidCustomerId,
  });

  if (isLoading) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Grid columns={10} gap="xl">
          <Grid.Col span={{ base: 10, lg: 7 }}>
            <Skeleton height={160} radius="md" mb="md" />
            <Skeleton height={90} radius="md" mb="md" />
            <Skeleton height={90} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 10, lg: 3 }}>
            <Skeleton height={280} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError || !customer) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="rejected">Cliente não encontrado.</Text>
        </Box>
      </Container>
    );
  }

  const hideStats = isSmallScreen && customer.orders.length === 0;

  return (
    <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 7 }}>
          <Stack gap="xl">
            <CustomerInfoCard customer={customer} />
            <CustomerOrdersSection customer={customer} orders={customer.orders} />
          </Stack>
        </Grid.Col>

        {!hideStats && (
          <Grid.Col span={{ base: 10, lg: 3 }}>
            <CustomerStatsOverview orders={customer.orders} />
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
}
