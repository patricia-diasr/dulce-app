import { useState } from 'react';
import { Group, SegmentedControl, Stack, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { businessToday } from '@/shared/utils/businessDate';
import type { ProductionMode } from '../../hooks/useProductionPeriod';
import type { ReportPeriod } from '../../types/reports';
import { FIRST_DAY_OF_WEEK } from '@/features/schedule/constants/calendar';
import { FILTER_ITEM_WIDTH, LILAC_INPUT_STYLES } from '../../utils/filterStyles';

const FORMAT = 'YYYY-MM-DD';
const toDate = (value: string) => new Date(`${value}T00:00:00`);

type DayChoice = 'today' | 'tomorrow' | 'custom';

interface ProductionDateControlsProps {
  mode: ProductionMode;
  date: string;
  range: ReportPeriod;
  error: string | null;
  onModeChange: (mode: ProductionMode) => void;
  onDateChange: (date: string) => void;
  onRangeChange: (range: ReportPeriod) => void;
}

export function ProductionDateControls({
  mode,
  date,
  range,
  error,
  onModeChange,
  onDateChange,
  onRangeChange,
}: ProductionDateControlsProps) {
  const today = businessToday();
  const tomorrow = dayjs(today).add(1, 'day').format(FORMAT);
  const calendarIcon = <Calendar size={16} color="var(--mantine-color-plum-6)" />;

  const [customSelected, setCustomSelected] = useState(false);
  const isCustom = customSelected || (date !== today && date !== tomorrow);
  const dayChoice: DayChoice = isCustom
    ? 'custom'
    : date === today
      ? 'today'
      : 'tomorrow';

  const handleDayChoiceChange = (value: string) => {
    if (value === 'today') {
      setCustomSelected(false);
      onDateChange(today);
    } else if (value === 'tomorrow') {
      setCustomSelected(false);
      onDateChange(tomorrow);
    } else {
      setCustomSelected(true);
    }
  };

  return (
    <Stack gap={6} mb="lg">
      <Group gap="xs" wrap="wrap">
        <SegmentedControl
          size="sm"
          color="plum.6"
          value={mode}
          onChange={(value) => onModeChange(value as ProductionMode)}
          data={[
            { value: 'day', label: 'Dia' },
            { value: 'range', label: 'Período' },
          ]}
        />

        {mode === 'day' ? (
          <>
            <SegmentedControl
              size="sm"
              color="plum.6"
              value={dayChoice}
              onChange={handleDayChoiceChange}
              data={[
                { value: 'today', label: 'Hoje' },
                { value: 'tomorrow', label: 'Amanhã' },
                { value: 'custom', label: 'Outra data' },
              ]}
            />

            {isCustom && (
              <DateInput
                placeholder="Data"
                valueFormat="DD/MM/YYYY"
                firstDayOfWeek={FIRST_DAY_OF_WEEK}
                value={toDate(date)}
                onChange={(value) => {
                  if (value) onDateChange(dayjs(value).format(FORMAT));
                }}
                leftSection={calendarIcon}
                styles={LILAC_INPUT_STYLES}
                w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
              />
            )}
          </>
        ) : (
          <>
            <DateInput
              placeholder="De"
              valueFormat="DD/MM/YYYY"
              firstDayOfWeek={FIRST_DAY_OF_WEEK}
              value={toDate(range.from)}
              onChange={(value) => {
                if (value) onRangeChange({ ...range, from: dayjs(value).format(FORMAT) });
              }}
              leftSection={calendarIcon}
              styles={LILAC_INPUT_STYLES}
              w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
            />
            <DateInput
              placeholder="Até"
              valueFormat="DD/MM/YYYY"
              firstDayOfWeek={FIRST_DAY_OF_WEEK}
              value={toDate(range.to)}
              onChange={(value) => {
                if (value) onRangeChange({ ...range, to: dayjs(value).format(FORMAT) });
              }}
              leftSection={calendarIcon}
              styles={LILAC_INPUT_STYLES}
              w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
            />
          </>
        )}
      </Group>

      {error && (
        <Text size="sm" c="rejected">
          {error}
        </Text>
      )}

      <Text size="xs" c="dimmed">
        A produção considera apenas pedidos aceitos, pela data de retirada.
      </Text>
    </Stack>
  );
}
