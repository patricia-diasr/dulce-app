import { Card, Group, Stack, Text } from '@mantine/core';
import type { LucideIcon } from 'lucide-react';
import { textColor } from '@/theme/colors';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <Card
      padding="lg"
      radius="md"
      style={{
        backgroundColor: `var(--mantine-color-${color}-0)`,
        border: `1px solid var(--mantine-color-${color}-3)`,
      }}
    >
      <Group gap="md" wrap="nowrap" align="center">
        <Icon
          size={32}
          color={`var(--mantine-color-${color}-6)`}
          style={{ flexShrink: 0 }}
        />
        <Stack gap={0}>
          <Text size="xl" fw={900} c={textColor}>
            {value}
          </Text>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
