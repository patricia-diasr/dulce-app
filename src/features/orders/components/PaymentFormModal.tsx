import { useEffect } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Wallet } from 'lucide-react';
import type { PaymentPayload } from '../types/order';

const PAYMENT_METHODS = [
  'PIX',
  'Dinheiro',
  'Cartão de crédito',
  'Cartão de débito',
  'Transferência bancária',
];

interface PaymentFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: PaymentPayload) => void;
  initialValues?: PaymentPayload;
  submitting?: boolean;
  maxAmount?: number;
}

export function PaymentFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  submitting,
  maxAmount,
}: PaymentFormModalProps) {
  const isEditing = !!initialValues;

  const form = useForm<PaymentPayload>({
    initialValues: initialValues ?? { amount: 0, paymentMethod: PAYMENT_METHODS[0] },
  });

  useEffect(() => {
    if (opened) {
      form.setValues(initialValues ?? { amount: 0, paymentMethod: PAYMENT_METHODS[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="plum" size={36} radius="xl">
            <Wallet size={20} />
          </ThemeIcon>
          <Text fw={700} size="lg">
            {isEditing ? 'Editar pagamento' : 'Registrar pagamento'}
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="md"
      padding="lg"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="lg">
          <NumberInput
            label="Valor"
            hideControls
            decimalScale={2}
            fixedDecimalScale
            min={0.01}
            max={maxAmount}
            step={0.5}
            prefix="R$ "
            key={form.key('amount')}
            {...form.getInputProps('amount')}
          />

          <Select
            label="Método de pagamento"
            data={PAYMENT_METHODS}
            allowDeselect={false}
            key={form.key('paymentMethod')}
            {...form.getInputProps('paymentMethod')}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" color="plum.6" loading={submitting}>
              {isEditing ? 'Salvar alterações' : 'Registrar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
