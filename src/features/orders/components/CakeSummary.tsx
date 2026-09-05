import { Alert, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Info } from 'lucide-react';
import type { Flavor } from '@/features/flavors/types';
import { CAKE_BASE_LABEL } from '@/shared/utils/cakeBase';
import { textColor } from '@/theme/colors';
import { CAKE_SIZES, type CakeFormValues } from '../types/cake';

interface CakeSummaryProps {
  values: CakeFormValues;
  flavor?: Flavor;
}

function shorten(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit).trimEnd()}...` : value;
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

export function CakeSummary({ values, flavor }: CakeSummaryProps) {
  const isSmallScreen = useMediaQuery('(max-width: 48em)');
  const contentLimit = isSmallScreen ? 17 : 30;
  const size = CAKE_SIZES.find((item) => item.value === values.sizeId)?.label ?? '—';
  const price = flavor?.prices.find(
    (item) => String(item.sizeId) === values.sizeId,
  )?.salePrice;
  const value =
    typeof price === 'number'
      ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '—';

  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder bg="#FEFEFE">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          Resumo do bolo
        </Title>
        <Divider color="caramel.2" />
        <Stack gap="sm">
          <SummaryRow label="Tamanho" value={size} />
          <SummaryRow label="Recheio" value={flavor?.name ?? 'Não selecionado'} />
          <SummaryRow
            label="Massa"
            value={`${CAKE_BASE_LABEL[values.cakeBase]}${flavor?.defaultCakeBase === values.cakeBase ? ' (padrão)' : ''}`}
          />
          <SummaryRow
            label="Raspa"
            value={`${CAKE_BASE_LABEL[values.topping]}${flavor?.defaultTopping === values.topping ? ' (padrão)' : ''}`}
          />
          <SummaryRow
            label="Texto no bolo"
            value={values.message ? shorten(values.message, contentLimit) : '—'}
          />
          <SummaryRow
            label="Observações"
            value={values.notes ? shorten(values.notes, contentLimit) : '—'}
          />
        </Stack>
        <Divider color="caramel.2" />
        <Group justify="space-between">
          <Text fw={800}>Valor do bolo</Text>
          <Text fz={24} fw={900} c="plum.7">
            {value}
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
            O valor é calculado com base na combinação de tamanhos e recheios, conforme
            nossa tabela de preços.
          </Text>
        </Alert>
      </Stack>
    </Paper>
  );
}
