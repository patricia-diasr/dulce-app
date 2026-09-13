import { Box, Container, Grid, Skeleton, Stack, Text } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { getOrder } from '../api/ordersApi';
import { OrderHeaderCard } from '../components/OrderHeaderCard';
import { OrderInvoiceCard } from '../components/OrderInvoiceCard';
import { OrderItemsList } from '../components/OrderItemsList';
import { OrderStatusActions } from '../components/OrderStatusActions';
import type { OrderResponse } from '../types/order';

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const orderIdNumber = Number(orderId);
  const hasValidOrderId = Number.isInteger(orderIdNumber) && orderIdNumber > 0;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'orders', orderIdNumber],
    queryFn: () => getOrder(orderIdNumber),
    enabled: hasValidOrderId,
  });

  const handleUpdate = (patch: Partial<OrderResponse>) => {
    queryClient.setQueryData<OrderResponse>(['admin', 'orders', orderIdNumber], (prev) =>
      prev ? { ...prev, ...patch } : prev,
    );
  };

  if (isLoading) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Grid columns={10} gap="xl">
          <Grid.Col span={{ base: 10, lg: 7 }}>
            <Skeleton height={160} radius="md" mb="md" />
            <Skeleton height={120} radius="md" mb="md" />
            <Skeleton height={120} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 10, lg: 3 }}>
            <Skeleton height={140} radius="md" mb="md" />
            <Skeleton height={220} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError || !order) {
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
          <Text c="rejected">Pedido não encontrado.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 7 }}>
          <Stack gap="xl">
            <OrderHeaderCard order={order} />
            <OrderItemsList items={order.items} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 10, lg: 3 }}>
          <Stack gap="xl">
            <OrderStatusActions order={order} onUpdate={handleUpdate} />
            <OrderInvoiceCard order={order} onUpdate={handleUpdate} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
