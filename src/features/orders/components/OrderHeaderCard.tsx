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
import { formatPhoneNumber } from '@/shared/utils/phone';
import { textColor } from '@/theme/colors';
import { CREATION_CHANNEL_LABELS } from '../constants/orderStatus';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { OrderResponse } from '../types/order';

interface OrderHeaderCardProps {
  order: OrderResponse;
}

const TERMINAL_STATUSES = ['CANCELED', 'REJECTED', 'COMPLETED'];

export function OrderHeaderCard({ order }: OrderHeaderCardProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isTerminal = TERMINAL_STATUSES.includes(order.status);

  const createdDate = new Date(order.createdAt).toLocaleDateString('pt-BR');
  const pickupDate = new Date(order.pickupAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const completedDate = order.completedAt
    ? new Date(order.completedAt).toLocaleDateString('pt-BR')
    : null;

  const editButton = isTerminal ? (
    <Tooltip
      label="Pedidos cancelados, recusados ou concluídos não podem mais ser editados."
      withArrow
    >
      <Box style={{ display: 'inline-block' }}>
        <Button variant="subtle" color="plum" leftSection={<Pencil size={16} />} disabled>
          Editar pedido
        </Button>
      </Box>
    </Tooltip>
  ) : (
    <Button
      component={Link}
      to={`/admin/pedidos/${order.id}/editar`}
      state={{ order }}
      variant="subtle"
      color="plum"
      leftSection={<Pencil size={16} />}
    >
      Editar pedido
    </Button>
  );

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="start" wrap="wrap" gap="sm">
          <Stack gap={6}>
            <Group gap="xs">
              <Title order={2} fz={22} fw={800} c={textColor}>
                Pedido #{order.id}
              </Title>
              <OrderStatusBadge status={order.status} />
            </Group>
            <Text size="sm" c="dimmed">
              {order.customerName} · {formatPhoneNumber(order.customerPhone)}
            </Text>
          </Stack>

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
              Criado em:
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
