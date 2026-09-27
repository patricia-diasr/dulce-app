import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { Cake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { textColor } from '@/theme/colors';
import { formatPickupCountdown } from '../utils/pickupCountdown';
import type { NestedOrder } from '../types/order';

interface NextPickupCardProps {
  order: NestedOrder;
}

export function NextPickupCard({ order }: NextPickupCardProps) {
  const navigate = useNavigate();
  const pickupDateTime = new Date(order.pickupAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const itemsSummary = order.items
    .map((item) => `${item.sizeName} ${item.flavorName}`)
    .join(', ');

  return (
    <Card
      padding="xl"
      onClick={() => navigate(`/pedidos/${order.id}`)}
      style={{
        cursor: 'pointer',
        backgroundColor: 'var(--mantine-color-lilac-0)',
        border: '1px solid var(--mantine-color-lilac-3)',
      }}
    >
      <Group justify="space-between" align="start" wrap="wrap" gap="md">
        <Group align="start" gap="md" wrap="nowrap">
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="xl"
            size={56}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <Cake size={26} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text size="sm" fw={700} c="plum.7" tt="uppercase">
              Próxima retirada
            </Text>
            <Text fw={900} size="xl" c={textColor}>
              {pickupDateTime}
            </Text>
            <Text size="sm" c="dimmed" style={{ overflowWrap: 'break-word' }}>
              {itemsSummary}
            </Text>
          </Stack>
        </Group>

        <Badge size="lg" color="plum" variant="filled">
          {formatPickupCountdown(order.pickupAt)}
        </Badge>
      </Group>
    </Card>
  );
}
