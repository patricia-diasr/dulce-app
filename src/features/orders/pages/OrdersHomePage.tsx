import {
  Box,
  Button,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCustomer } from '@/features/customers/api/customersApi';
import { getCustomerId } from '@/shared/utils/tokenStorage';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { textColor } from '@/theme/colors';
import { NextPickupCard } from '../components/NextPickupCard';
import { OrderStatusSection } from '../components/OrderStatusSection';
import type { NestedOrder } from '../types/order';

const HISTORY_STATUSES = ['COMPLETED', 'CANCELED', 'REJECTED'];

function sortByPickupAsc(orders: NestedOrder[]) {
  return [...orders].sort(
    (a, b) => new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime(),
  );
}

function sortByCreatedDesc(orders: NestedOrder[]) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function OrdersHomePage() {
  const customerId = getCustomerId();

  const {
    data: customer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['customer', 'me', customerId],
    queryFn: () => getCustomer(customerId!),
    enabled: customerId != null,
  });

  if (isLoading) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Skeleton height={40} width={240} radius="md" mb="xl" />
        <Skeleton height={110} radius="md" mb="xl" />
        <Skeleton height={90} radius="md" mb="md" />
        <Skeleton height={90} radius="md" />
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
          <Text c="rejected">
            Não foi possível carregar seus pedidos. Tente novamente em instantes.
          </Text>
        </Box>
      </Container>
    );
  }

  const firstName = customer.name.split(' ')[0];
  const pendingOrders = sortByPickupAsc(
    customer.orders.filter((o) => o.status === 'PENDING'),
  );
  const acceptedOrders = sortByPickupAsc(
    customer.orders.filter((o) => o.status === 'ACCEPTED'),
  );
  const historyOrders = sortByCreatedDesc(
    customer.orders.filter((o) => HISTORY_STATUSES.includes(o.status)),
  );
  const nextOrder = [...pendingOrders, ...acceptedOrders].sort(
    (a, b) => new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime(),
  )[0];

  return (
    <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
      <Stack gap="xl">
        <Group justify="space-between" align="start" wrap="wrap" gap="sm">
          <div>
            <Title order={1} fz={28} fw={700} c={textColor}>
              Olá, {firstName}!
            </Title>
            <Text c={textColor} opacity={0.75} size="sm" mt={4}>
              Aqui está um resumo dos seus pedidos.
            </Text>
          </div>
          <Button
            component={Link}
            to="/pedidos/novo"
            color="plum.6"
            radius="sm"
            leftSection={<Plus size={18} />}
          >
            Novo pedido
          </Button>
        </Group>

        {customer.orders.length === 0 ? (
          <Box
            style={{
              minHeight: '40vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="dimmed">Você ainda não fez nenhum pedido.</Text>
          </Box>
        ) : (
          <>
            {nextOrder && <NextPickupCard order={nextOrder} />}

            <OrderStatusSection title="Aguardando aprovação" orders={pendingOrders} />
            <OrderStatusSection title="Confirmados" orders={acceptedOrders} />
            <OrderStatusSection title="Histórico" orders={historyOrders} collapsible />
          </>
        )}
      </Stack>
    </Container>
  );
}
