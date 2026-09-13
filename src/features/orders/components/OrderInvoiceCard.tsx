import { useState } from 'react';
import {
  ActionIcon,
  Badge,
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
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import { createPayment, deletePayment, updatePayment } from '../api/ordersApi';
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from '../constants/orderStatus';
import { PaymentFormModal } from './PaymentFormModal';
import type {
  InvoiceResponse,
  OrderResponse,
  Payment,
  PaymentPayload,
} from '../types/order';

interface OrderInvoiceCardProps {
  order: OrderResponse;
  onUpdate: (patch: Partial<OrderResponse>) => void;
}

export function OrderInvoiceCard({ order, onUpdate }: OrderInvoiceCardProps) {
  const { invoice } = order;
  const [formOpen, setFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [paymentPendingDeletion, setPaymentPendingDeletion] = useState<Payment | null>(
    null,
  );

  const applyInvoiceUpdate = (updatedInvoice: InvoiceResponse) => {
    onUpdate({ invoice: updatedInvoice });
  };

  const createMutation = useMutation({
    mutationFn: (payload: PaymentPayload) => createPayment(order.id, payload),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pagamento registrado!',
        message: 'O pagamento foi adicionado ao pedido.',
      });
      applyInvoiceUpdate(data);
      setFormOpen(false);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível registrar',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: number;
      payload: Partial<PaymentPayload>;
    }) => updatePayment(order.id, paymentId, payload),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pagamento atualizado!',
        message: 'As alterações foram salvas.',
      });
      applyInvoiceUpdate(data);
      setEditingPayment(null);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível salvar',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (paymentId: number) => deletePayment(order.id, paymentId),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Pagamento excluído',
        message: 'O pagamento foi removido do pedido.',
      });
      if (invoice && paymentPendingDeletion) {
        applyInvoiceUpdate({
          ...invoice,
          payments: invoice.payments.filter((p) => p.id !== paymentPendingDeletion.id),
        });
      }
      setPaymentPendingDeletion(null);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível excluir',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  const canCreatePayment = order.status === 'ACCEPTED' || order.status === 'COMPLETED';
  const isFullyPaid = invoice?.status === 'PAID';
  const createDisabled = !invoice || !canCreatePayment || isFullyPaid;
  const createDisabledReason = !invoice
    ? 'Esse pedido não tem fatura associada.'
    : !canCreatePayment
      ? 'Só é possível registrar pagamento em pedidos aceitos ou concluídos.'
      : isFullyPaid
        ? 'Este pedido já está totalmente pago.'
        : undefined;

  const total = invoice ? invoice.grossAmount - invoice.discount : 0;

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Pagamento
          </Title>
          {invoice && (
            <Badge color={INVOICE_STATUS_COLORS[invoice.status]} variant="light">
              {INVOICE_STATUS_LABELS[invoice.status]}
            </Badge>
          )}
        </Group>

        <Divider color="caramel.2" />

        {!invoice ? (
          <Text size="sm" c="dimmed">
            Esse pedido não tem fatura associada.
          </Text>
        ) : (
          <>
            <Stack gap={6}>
              <Group justify="space-between">
                <Text size="sm">Valor bruto</Text>
                <Text size="sm" fw={700}>
                  {formatCurrency(invoice.grossAmount)}
                </Text>
              </Group>
              {invoice.discount > 0 && (
                <Group justify="space-between">
                  <Text size="sm">Desconto</Text>
                  <Text size="sm" fw={700}>
                    - {formatCurrency(invoice.discount)}
                  </Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text fw={800}>Total</Text>
                <Text fw={900} c="plum.7">
                  {formatCurrency(total)}
                </Text>
              </Group>
              {!!invoice.refundDue && invoice.refundDue > 0 && (
                <Group justify="space-between">
                  <Text size="sm" c="rejected">
                    A devolver
                  </Text>
                  <Text size="sm" fw={700} c="rejected">
                    {formatCurrency(invoice.refundDue)}
                  </Text>
                </Group>
              )}
            </Stack>

            <Divider color="caramel.2" />

            <Stack gap="sm">
              <Text fw={800} size="sm">
                Pagamentos
              </Text>
              {invoice.payments.length === 0 ? (
                <Text size="sm" c="dimmed" fs="italic">
                  Nenhum pagamento registrado ainda.
                </Text>
              ) : (
                invoice.payments.map((payment) => (
                  <Group key={payment.id} justify="space-between" wrap="nowrap">
                    <Stack gap={0} style={{ minWidth: 0 }}>
                      <Text size="sm" fw={700}>
                        {formatCurrency(payment.amount)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {payment.paymentMethod} ·{' '}
                        {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </Stack>
                    <Group gap={4}>
                      <Tooltip label="Editar pagamento" withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="plum"
                          onClick={() => setEditingPayment(payment)}
                          aria-label="Editar pagamento"
                        >
                          <Pencil size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Excluir pagamento" withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="rejected"
                          onClick={() => setPaymentPendingDeletion(payment)}
                          aria-label="Excluir pagamento"
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                ))
              )}
            </Stack>

            <Tooltip
              label={createDisabledReason}
              disabled={!createDisabledReason}
              withArrow
            >
              <Box style={{ display: 'inline-block' }}>
                <Button
                  variant="light"
                  color="plum"
                  leftSection={<Plus size={16} />}
                  onClick={() => setFormOpen(true)}
                  disabled={createDisabled}
                >
                  Registrar pagamento
                </Button>
              </Box>
            </Tooltip>
          </>
        )}
      </Stack>

      <PaymentFormModal
        opened={formOpen || editingPayment !== null}
        onClose={() => {
          setFormOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={(values) => {
          if (editingPayment) {
            updateMutation.mutate({ paymentId: editingPayment.id, payload: values });
          } else {
            createMutation.mutate(values);
          }
        }}
        initialValues={
          editingPayment
            ? {
                amount: editingPayment.amount,
                paymentMethod: editingPayment.paymentMethod,
              }
            : undefined
        }
        submitting={createMutation.isPending || updateMutation.isPending}
        maxAmount={
          invoice
            ? invoice.grossAmount -
              invoice.discount -
              invoice.payments.reduce(
                (s, p) => s + (p.id === editingPayment?.id ? 0 : p.amount),
                0,
              )
            : undefined
        }
      />

      <ConfirmDeleteModal
        opened={paymentPendingDeletion !== null}
        onClose={() => setPaymentPendingDeletion(null)}
        onConfirm={() =>
          paymentPendingDeletion && deleteMutation.mutate(paymentPendingDeletion.id)
        }
        title="Excluir pagamento"
        itemName={
          paymentPendingDeletion
            ? formatCurrency(paymentPendingDeletion.amount)
            : undefined
        }
        loading={deleteMutation.isPending}
      />
    </Card>
  );
}
