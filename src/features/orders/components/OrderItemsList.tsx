import { Box, Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Cake } from 'lucide-react';
import { CAKE_BASE_LABEL } from '@/shared/utils/cakeBase';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import type { OrderItemResponse } from '../types/order';

interface OrderItemsListProps {
  items: OrderItemResponse[];
}

function OrderItemRow({ item, index }: { item: OrderItemResponse; index: number }) {
  return (
    <Card padding="lg">
      <Group align="start" wrap="nowrap" gap="md">
        <Box style={{ position: 'relative', flexShrink: 0, width: 48, height: 48 }}>
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="md"
            size={48}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <Cake size={22} />
          </ThemeIcon>
          <Box
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-plum-6)',
              border: '2px solid #FEFEFE',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {index + 1}
          </Box>
        </Box>

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="start" wrap="nowrap" gap="xs">
            <Text fw={800} style={{ overflowWrap: 'break-word' }}>
              {item.flavorName} — {item.sizeName}
            </Text>
            <Text fw={800} c="plum.7" style={{ whiteSpace: 'nowrap' }}>
              {formatCurrency(item.unitPrice)}
            </Text>
          </Group>

          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Massa {CAKE_BASE_LABEL[item.cakeBase]}
            </Text>
            <Text size="sm" c="dimmed">
              Raspa {CAKE_BASE_LABEL[item.topping]}
            </Text>
          </Stack>

          <Text
            size="sm"
            c={item.message ? undefined : 'dimmed'}
            fs={item.message ? undefined : 'italic'}
            style={{ overflowWrap: 'break-word' }}
          >
            Texto: {item.message || 'Sem texto no bolo'}
          </Text>
          <Text
            size="sm"
            c={item.notes ? undefined : 'dimmed'}
            fs={item.notes ? undefined : 'italic'}
            style={{ overflowWrap: 'break-word' }}
          >
            Obs: {item.notes || 'Sem observações'}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <Stack gap="md">
      <Title order={2} fz={22} fw={800} c={textColor}>
        Bolos do pedido
      </Title>
      <Stack gap="md">
        {items.map((item, index) => (
          <OrderItemRow key={item.id} item={item} index={index} />
        ))}
      </Stack>
    </Stack>
  );
}
