import { Box, Button, Container, Skeleton, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { getOrder } from '../api/ordersApi';
import { OrderEditBuilder } from '../components/OrderEditBuilder';

const TERMINAL_STATUSES = ['CANCELED', 'REJECTED', 'COMPLETED'];

export function AdminOrderEditPage() {
  const { orderId } = useParams<{ orderId: string }>();
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

  if (isLoading) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Skeleton height={600} radius="md" />
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

  if (TERMINAL_STATUSES.includes(order.status)) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="rejected">
            Pedidos cancelados, recusados ou concluídos não podem mais ser editados.
          </Text>
          <Button
            component={Link}
            to={`/admin/pedidos/${order.id}`}
            color="plum.6"
            radius="sm"
          >
            Voltar para o pedido
          </Button>
        </Box>
      </Container>
    );
  }

  return <OrderEditBuilder mode="admin" order={order} />;
}
