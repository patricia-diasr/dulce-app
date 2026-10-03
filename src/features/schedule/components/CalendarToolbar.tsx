import { ActionIcon, Button, Group, SegmentedControl, Text } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { textColor } from '@/theme/colors';
import type { CalendarView } from '../utils/calendarRange';

interface CalendarToolbarProps {
  label: string;
  view: CalendarView;
  showViewSwitcher: boolean;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  label,
  view,
  showViewSwitcher,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <Group justify="space-between" gap="sm" mb="lg" wrap="wrap">
      <Group gap="xs" wrap="nowrap">
        <ActionIcon
          variant="light"
          color="plum"
          onClick={onPrevious}
          aria-label="Período anterior"
        >
          <ChevronLeft size={18} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          color="plum"
          onClick={onNext}
          aria-label="Próximo período"
        >
          <ChevronRight size={18} />
        </ActionIcon>
        <Text fw={800} size="lg" c={textColor} ml="xs">
          {label}
        </Text>
      </Group>

      <Group gap="xs">
        <Button variant="light" color="plum" size="xs" onClick={onToday}>
          Hoje
        </Button>
        {showViewSwitcher && (
          <SegmentedControl
            size="xs"
            color="plum.6"
            value={view}
            onChange={(value) => onViewChange(value as CalendarView)}
            data={[
              { value: 'month', label: 'Mês' },
              { value: 'week', label: 'Semana' },
            ]}
          />
        )}
      </Group>
    </Group>
  );
}
