import { useState } from 'react';
import { Box, Collapse, Group, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { ChevronDown } from 'lucide-react';
import { textColor } from '@/theme/colors';
import type { ProductionDay } from '../../types/reports';
import { formatKg, formatShortDay } from '../../utils/formatters';
import { ProductionBlockView } from './ProductionBlockView';

interface ProductionDaySectionProps {
  day: ProductionDay;
  defaultOpened?: boolean;
}

export function ProductionDaySection({
  day,
  defaultOpened = false,
}: ProductionDaySectionProps) {
  const [opened, setOpened] = useState(defaultOpened);

  return (
    <Stack gap={0}>
      <UnstyledButton
        onClick={() => setOpened((current) => !current)}
        style={{ display: 'block', width: '100%' }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
          <Group gap="sm" align="baseline" wrap="wrap">
            <Title order={3} fz={18} fw={800} c={textColor}>
              {formatShortDay(day.date)}
            </Title>
            <Text size="sm" c="dimmed">
              {day.cakesCount} {day.cakesCount === 1 ? 'bolo' : 'bolos'} ·{' '}
              {formatKg(day.totalKg)}
            </Text>
          </Group>
          <ChevronDown
            size={18}
            style={{
              transform: opened ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms ease',
              flexShrink: 0,
            }}
          />
        </Group>
      </UnstyledButton>

      <Collapse expanded={opened}>
        <Box mt="md">
          <ProductionBlockView block={day} />
        </Box>
      </Collapse>
    </Stack>
  );
}
