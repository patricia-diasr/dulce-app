import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { textColor } from '@/theme/colors';
import { CustomerOrderCard } from './CustomerOrderCard';
import type { Customer, Order } from '../types';

interface CustomerOrdersSectionProps {
  customer: Customer;
  orders: Order[];
}

export function CustomerOrdersSection({ customer, orders }: CustomerOrdersSectionProps) {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 399px)');

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Title order={2} fz={22} fw={800} c={textColor}>
          Pedidos
        </Title>
        <Button
          color="plum.6"
          radius="sm"
          size={isSmallScreen ? 'xs' : 'sm'}
          leftSection={<Plus size={isSmallScreen ? 14 : 18} />}
          onClick={() =>
            navigate('/admin/pedidos/novo', {
              state: {
                customerId: customer.id,
                customerName: customer.name,
                customerPhone: customer.phone,
              },
            })
          }
        >
          Adicionar pedido
        </Button>
      </Group>

      {orders.length === 0 ? (
        <Box
          style={{
            minHeight: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="dimmed">Esse cliente ainda não fez nenhum pedido.</Text>
        </Box>
      ) : (
        <Stack gap="md">
          {orders.map((order) => (
            <CustomerOrderCard key={order.id} order={order} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
