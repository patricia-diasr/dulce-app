import { Box, Button, Container, Skeleton, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/ordersApi';
import { OrderEditBuilder } from '../components/OrderEditBuilder';
import { canCustomerEditOrder } from '../utils/orderValidation';

export function OrderEditPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const orderIdNumber = Number(orderId);
  const hasValidOrderId = Number.isInteger(orderIdNumber) && orderIdNumber > 0;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders', orderIdNumber],
    queryFn: () => getOrder(orderIdNumber),
    enabled: hasValidOrderId,
  });

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={600} radius="md" />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container size="xl" py="xl">
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

  if (!canCustomerEditOrder(order)) {
    return (
      <Container size="xl" py="xl">
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
            {order.status === 'ACCEPTED'
              ? 'Esse pedido não pode mais ser editado — faltam menos de 72h para a retirada. Entre em contato com a confeitaria.'
              : 'Esse pedido não pode mais ser editado.'}
          </Text>
          <Button component={Link} to={`/pedidos/${order.id}`} color="plum.6" radius="sm">
            Voltar para o pedido
          </Button>
        </Box>
      </Container>
    );
  }

  return <OrderEditBuilder mode="customer" order={order} />;
}
