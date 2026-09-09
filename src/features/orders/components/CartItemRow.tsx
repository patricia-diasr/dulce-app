import { ActionIcon, Box, Group, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { Cake, Pencil, Trash2 } from 'lucide-react';
import { CAKE_BASE_LABEL } from '@/shared/utils/cakeBase';
import { CAKE_SIZES } from '../types/cake';
import type { CartItem } from '../hooks/useOrderCart';

interface CartItemRowProps {
  item: CartItem;
  index: number;
  onEdit: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
}

export function CartItemRow({ item, index, onEdit, onDelete }: CartItemRowProps) {
  const size = CAKE_SIZES.find((s) => s.value === item.cake.sizeId)?.label ?? '—';
  const price =
    item.flavor.prices.find((p) => String(p.sizeId) === item.cake.sizeId)?.salePrice ?? 0;

  return (
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
        <Text fw={800} style={{ overflowWrap: 'break-word' }}>
          {item.flavor.name} — {size}
        </Text>

        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            Massa {CAKE_BASE_LABEL[item.cake.cakeBase]}
          </Text>
          <Text size="sm" c="dimmed">
            Raspa {CAKE_BASE_LABEL[item.cake.topping]}
          </Text>
        </Stack>

        <Text
          size="sm"
          c={item.cake.message ? undefined : 'dimmed'}
          fs={item.cake.message ? undefined : 'italic'}
          style={{ overflowWrap: 'break-word' }}
        >
          Texto: {item.cake.message || 'Sem texto no bolo'}
        </Text>

        <Text
          size="sm"
          c={item.cake.notes ? undefined : 'dimmed'}
          fs={item.cake.notes ? undefined : 'italic'}
          style={{ overflowWrap: 'break-word' }}
        >
          Obs: {item.cake.notes || 'Sem observações'}
        </Text>
      </Stack>

      <Stack gap={4} align="end" style={{ flexShrink: 0 }}>
        <Text fw={800} c="plum.7" style={{ whiteSpace: 'nowrap' }}>
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
        <Group gap={4}>
          <Tooltip label="Editar bolo" withArrow>
            <ActionIcon
              variant="subtle"
              color="plum"
              onClick={() => onEdit(item)}
              aria-label="Editar bolo"
            >
              <Pencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remover bolo" withArrow>
            <ActionIcon
              variant="subtle"
              color="rejected"
              onClick={() => onDelete(item)}
              aria-label="Remover bolo"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Group>
  );
}
