import { Alert, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Info } from 'lucide-react';
import { textColor } from '@/theme/colors';
import { CAKE_SIZES } from '../types/cake';
import type { CartItem } from '../hooks/useOrderCart';
import { calculateGrossAmount } from '../utils/pricing';

interface OrderSummaryCardProps {
  items: CartItem[];
  pickupDate: string;
  pickupTime: string;
  discount: number | null;
  customer?: { name: string; phone: string } | null;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" align="start" gap="md" wrap="nowrap">
      <Text size="sm">{label}</Text>
      <Text size="sm" fw={700} ta="right">
        {value}
      </Text>
    </Group>
  );
}

export function OrderSummaryCard({
  items,
  pickupDate,
  pickupTime,
  discount,
  customer,
}: OrderSummaryCardProps) {
  const grossAmount = calculateGrossAmount(items);
  const total = grossAmount - (discount ?? 0);
  const formattedDate = pickupDate
    ? new Date(`${pickupDate}T00:00:00`).toLocaleDateString('pt-BR')
    : '—';

  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder bg="#FEFEFE">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          Resumo do pedido
        </Title>
        <Divider color="caramel.2" />

        {customer && (
          <>
            <Stack gap="sm">
              <SummaryRow label="Cliente" value={customer.name} />
              <SummaryRow label="Telefone" value={customer.phone} />
            </Stack>
            <Divider color="caramel.2" />
          </>
        )}

        <Stack gap="sm">
          {items.map((item) => {
            const size =
              CAKE_SIZES.find((s) => s.value === item.cake.sizeId)?.label ?? '—';
            const price =
              item.flavor.prices.find((p) => String(p.sizeId) === item.cake.sizeId)
                ?.salePrice ?? 0;
            return (
              <SummaryRow
                key={item.id}
                label={`${size} ${item.flavor.name}`}
                value={formatCurrency(price)}
              />
            );
          })}
        </Stack>

        <Divider color="caramel.2" />

        <Stack gap="sm">
          {discount != null && discount > 0 && (
            <SummaryRow label="Desconto" value={`- ${formatCurrency(discount)}`} />
          )}
          <SummaryRow label="Data de retirada" value={formattedDate} />
          <SummaryRow label="Hora de retirada" value={pickupTime || '—'} />
        </Stack>

        <Divider color="caramel.2" />

        <Group justify="space-between">
          <Text fw={800}>Total do pedido</Text>
          <Text fz={24} fw={900} c="plum.7">
            {formatCurrency(total)}
          </Text>
        </Group>

        <Alert
          icon={<Info size={17} />}
          color="caramel"
          variant="light"
          radius="sm"
          p="sm"
        >
          <Text size="sm" lh={1.45}>
            Ao finalizar, seu pedido será enviado para análise da confeitaria. A
            confirmação será enviada assim que possível.
          </Text>
        </Alert>
      </Stack>
    </Paper>
  );
}
