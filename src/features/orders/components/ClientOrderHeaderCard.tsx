import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { textColor } from '@/theme/colors';
import { CREATION_CHANNEL_LABELS } from '../constants/orderStatus';
import { canCustomerEditOrder } from '../utils/orderValidation';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { OrderResponse } from '../types/order';

interface ClientOrderHeaderCardProps {
  order: OrderResponse;
}

export function ClientOrderHeaderCard({ order }: ClientOrderHeaderCardProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const canEdit = canCustomerEditOrder(order);

  const createdDate = new Date(order.createdAt).toLocaleDateString('pt-BR');
  const pickupDate = new Date(order.pickupAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const completedDate = order.completedAt
    ? new Date(order.completedAt).toLocaleDateString('pt-BR')
    : null;

  const editButton = canEdit ? (
    <Button
      component={Link}
      to={`/pedidos/${order.id}/editar`}
      variant="subtle"
      color="plum"
      leftSection={<Pencil size={16} />}
    >
      Editar pedido
    </Button>
  ) : (
    <Tooltip
      label={
        order.status === 'ACCEPTED'
          ? 'Faltam menos de 72h para a retirada, entre em contato com a confeitaria para alterar.'
          : 'Esse pedido não pode mais ser editado.'
      }
      withArrow
    >
      <Box style={{ display: 'inline-block' }}>
        <Button variant="subtle" color="plum" leftSection={<Pencil size={16} />} disabled>
          Editar pedido
        </Button>
      </Box>
    </Tooltip>
  );

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="start" wrap="wrap" gap="sm">
          <Group gap="xs">
            <Title order={2} fz={22} fw={800} c={textColor}>
              Pedido #{order.id}
            </Title>
            <OrderStatusBadge status={order.status} />
          </Group>

          {!isSmallScreen && editButton}
        </Group>

        <Divider color="caramel.2" />

        <Stack gap={4}>
          <Text size="sm">
            <Text span fw={700}>
              Canal:
            </Text>{' '}
            {CREATION_CHANNEL_LABELS[order.creationChannel]}
          </Text>
          <Text size="sm">
            <Text span fw={700}>
              Feito em:
            </Text>{' '}
            {createdDate}
          </Text>
          <Text size="sm">
            <Text span fw={700}>
              Retirada:
            </Text>{' '}
            {pickupDate}
          </Text>
          {completedDate && (
            <Text size="sm">
              <Text span fw={700}>
                Concluído em:
              </Text>{' '}
              {completedDate}
            </Text>
          )}
        </Stack>

        <Divider color="caramel.2" />

        <Text
          size="sm"
          c={order.notes ? undefined : 'dimmed'}
          fs={order.notes ? undefined : 'italic'}
          style={{ overflowWrap: 'break-word' }}
        >
          {order.notes || 'Sem observações'}
        </Text>

        {isSmallScreen && <Group justify="flex-start">{editButton}</Group>}
      </Stack>
    </Card>
  );
}
