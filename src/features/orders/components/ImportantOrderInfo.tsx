import { Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type { LucideIcon } from 'lucide-react';
import { textColor } from '@/theme/colors';

export interface InfoItem {
  icon: LucideIcon;
  text: string;
}

interface ImportantOrderInfoProps {
  title?: string;
  items: InfoItem[];
}

export function ImportantOrderInfo({
  title = 'Informações importantes',
  items,
}: ImportantOrderInfoProps) {
  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder bg="#FEFEFE">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          {title}
        </Title>
        <Stack gap="md">
          {items.map(({ icon: Icon, text }) => (
            <Group key={text} align="flex-start" gap="sm" wrap="nowrap">
              <ThemeIcon radius="xl" size={34} color="plum.1" c="plum.7">
                <Icon size={19} />
              </ThemeIcon>
              <Text size="sm" lh={1.5}>
                {text}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
