import { useState } from 'react';
import { Collapse, Group, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { ChevronDown } from 'lucide-react';
import { textColor } from '@/theme/colors';
import { ClientOrderCard } from './ClientOrderCard';
import type { NestedOrder } from '../types/order';

interface OrderStatusSectionProps {
  title: string;
  orders: NestedOrder[];
  collapsible?: boolean;
}

export function OrderStatusSection({
  title,
  orders,
  collapsible = false,
}: OrderStatusSectionProps) {
  const [opened, setOpened] = useState(!collapsible);

  if (orders.length === 0) return null;

  const header = collapsible ? (
    <UnstyledButton
      onClick={() => setOpened((o) => !o)}
      style={{ display: 'block', width: '100%' }}
    >
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Title order={3} fz={18} fw={800} c={textColor}>
            {title}
          </Title>
          <Text size="sm" c="dimmed">
            ({orders.length})
          </Text>
        </Group>
        <ChevronDown
          size={18}
          style={{
            transform: opened ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms ease',
          }}
        />
      </Group>
    </UnstyledButton>
  ) : (
    <Group gap="xs">
      <Title order={3} fz={18} fw={800} c={textColor}>
        {title}
      </Title>
      <Text size="sm" c="dimmed">
        ({orders.length})
      </Text>
    </Group>
  );

  const content = (
    <Stack gap="md" mt="md">
      {orders.map((order) => (
        <ClientOrderCard key={order.id} order={order} />
      ))}
    </Stack>
  );

  if (!collapsible) {
    return (
      <Stack gap={0}>
        {header}
        {content}
      </Stack>
    );
  }

  return (
    <Stack gap={0}>
      {header}
      <Collapse expanded={opened}>{content}</Collapse>{' '}
    </Stack>
  );
}
