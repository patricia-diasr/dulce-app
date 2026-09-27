import { useState } from 'react';
import { Button, Card, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Ban, Check, PackageCheck, X } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmActionModal } from '@/shared/components/ConfirmActionModal/ConfirmActionModal';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import { acceptOrder, cancelOrder, completeOrder, rejectOrder } from '../api/ordersApi';
import type { OrderResponse } from '../types/order';

interface OrderStatusActionsProps {
  order: OrderResponse;
  onUpdate: (patch: Partial<OrderResponse>) => void;
}

type ConfirmingAction = 'accept' | 'reject' | 'cancel' | 'complete' | null;

export function OrderStatusActions({ order, onUpdate }: OrderStatusActionsProps) {
  const [confirming, setConfirming] = useState<ConfirmingAction>(null);
  const closeModal = () => setConfirming(null);

  const totalPaid = order.invoice?.payments.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  const applyPatch = (data: OrderResponse) => {
    onUpdate({
      status: data.status,
      completedAt: data.completedAt,
      invoice: data.invoice,
    });
    closeModal();
  };

  const acceptMutation = useMutation({
    mutationFn: () => acceptOrder(order.id),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido aceito!',
        message: `O pedido #${order.id} foi aceito.`,
      });
      applyPatch(data);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível aceitar',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectOrder(order.id),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido recusado',
        message: `O pedido #${order.id} foi recusado.`,
      });
      applyPatch(data);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível recusar',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(order.id),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido cancelado',
        message: `O pedido #${order.id} foi cancelado.`,
      });
      applyPatch(data);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível cancelar',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  const completeMutation = useMutation({
    mutationFn: () => completeOrder(order.id),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido concluído!',
        message: `O pedido #${order.id} foi marcado como retirado.`,
      });
      applyPatch(data);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível concluir',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  if (
    order.status === 'REJECTED' ||
    order.status === 'CANCELED' ||
    order.status === 'COMPLETED'
  ) {
    return null;
  }

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          Ações
        </Title>

        {order.status === 'PENDING' && (
          <>
            <Button
              color="accepted"
              leftSection={<Check size={18} />}
              onClick={() => setConfirming('accept')}
            >
              Aceitar pedido
            </Button>
            <Button
              variant="outline"
              color="rejected"
              leftSection={<X size={18} />}
              onClick={() => setConfirming('reject')}
            >
              Recusar pedido
            </Button>
          </>
        )}

        {order.status === 'ACCEPTED' && (
          <>
            <Button
              color="accepted"
              leftSection={<PackageCheck size={18} />}
              onClick={() => setConfirming('complete')}
            >
              Marcar como retirado
            </Button>
            <Button
              variant="outline"
              color="rejected"
              leftSection={<Ban size={18} />}
              onClick={() => setConfirming('cancel')}
            >
              Cancelar pedido
            </Button>
          </>
        )}
      </Stack>

      <ConfirmActionModal
        opened={confirming === 'accept'}
        onClose={closeModal}
        onConfirm={() => acceptMutation.mutate()}
        title="Aceitar pedido"
        description={`Tem certeza que deseja aceitar o pedido #${order.id}?`}
        confirmLabel="Aceitar pedido"
        confirmColor="accepted"
        icon={Check}
        loading={acceptMutation.isPending}
      />

      <ConfirmActionModal
        opened={confirming === 'reject'}
        onClose={closeModal}
        onConfirm={() => rejectMutation.mutate()}
        title="Recusar pedido"
        description={
          <>
            Tem certeza que deseja recusar o pedido #{order.id}?
            <br />
            Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Recusar pedido"
        confirmColor="rejected"
        icon={X}
        loading={rejectMutation.isPending}
      />

      <ConfirmActionModal
        opened={confirming === 'cancel'}
        onClose={closeModal}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancelar pedido"
        description={
          <>
            Tem certeza que deseja cancelar o pedido #{order.id}?
            <br />
            Essa ação não pode ser desfeita.
            {totalPaid > 0 && (
              <>
                <br />
                <br />
                <Text component="span" fw={700} c="rejected">
                  Atenção:
                </Text>
                {formatCurrency(totalPaid)} já{' '}
                {totalPaid === 1 ? 'foi pago' : 'foram pagos'} e deve ser devolvido ao
                cliente.
              </>
            )}
          </>
        }
        confirmLabel="Cancelar pedido"
        confirmColor="rejected"
        icon={Ban}
        loading={cancelMutation.isPending}
      />

      <ConfirmActionModal
        opened={confirming === 'complete'}
        onClose={closeModal}
        onConfirm={() => completeMutation.mutate()}
        title="Marcar como retirado"
        description={`Confirma que o pedido #${order.id} foi retirado pelo cliente?`}
        confirmLabel="Marcar como retirado"
        confirmColor="accepted"
        icon={PackageCheck}
        loading={completeMutation.isPending}
      />
    </Card>
  );
}
