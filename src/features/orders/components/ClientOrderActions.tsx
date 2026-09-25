import { useState } from 'react';
import { Box, Button, Card, Stack, Title, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmActionModal } from '@/shared/components/ConfirmActionModal/ConfirmActionModal';
import { textColor } from '@/theme/colors';
import { cancelOrder } from '../api/ordersApi';
import { canCustomerCancelOrder } from '../utils/orderValidation';
import type { OrderResponse } from '../types/order';

interface ClientOrderActionsProps {
  order: OrderResponse;
}

export function ClientOrderActions({ order }: ClientOrderActionsProps) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const eligibleStatus = order.status === 'PENDING' || order.status === 'ACCEPTED';
  const canCancel = canCustomerCancelOrder(order);

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(order.id),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido cancelado',
        message: `O pedido #${order.id} foi cancelado.`,
      });
      queryClient.setQueryData(['orders', order.id], data);
      setConfirming(false);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível cancelar',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  if (!eligibleStatus) return null;

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          Ações
        </Title>

        <Tooltip
          label={
            canCancel
              ? undefined
              : 'Prazo para cancelamento expirado, entre em contato com a confeitaria.'
          }
          disabled={canCancel}
          withArrow
        >
          <Box style={{ display: 'inline-block', width: '100%' }}>
            <Button
              variant="outline"
              color="rejected"
              leftSection={<Ban size={18} />}
              fullWidth
              disabled={!canCancel}
              onClick={() => setConfirming(true)}
            >
              Cancelar pedido
            </Button>
          </Box>
        </Tooltip>
      </Stack>

      <ConfirmActionModal
        opened={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancelar pedido"
        description={
          <>
            Tem certeza que deseja cancelar o pedido #{order.id}?
            <br />
            Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Cancelar pedido"
        confirmColor="rejected"
        icon={Ban}
        loading={cancelMutation.isPending}
      />
    </Card>
  );
}
