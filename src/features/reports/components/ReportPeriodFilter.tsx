import { Group, Menu, Stack, Text, UnstyledButton } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Calendar, ChevronDown } from 'lucide-react';
import type { ReportPeriod } from '../types/reports';
import {
  detectPreset,
  getPresetPeriod,
  PERIOD_PRESET_LABELS,
  PERIOD_PRESETS,
} from '../utils/period';
import { FIRST_DAY_OF_WEEK } from '@/features/schedule/constants/calendar';

const FILTER_ITEM_WIDTH = 160;

const LILAC_INPUT_STYLES = {
  input: {
    backgroundColor: 'var(--mantine-color-lilac-0)',
    borderColor: 'var(--mantine-color-lilac-4)',
    color: 'var(--mantine-color-plum-7)',
    fontWeight: 600,
  },
};

interface ReportPeriodFilterProps {
  period: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
  error: string | null;
}

const toDate = (value: string) => new Date(`${value}T00:00:00`);

export function ReportPeriodFilter({ period, onChange, error }: ReportPeriodFilterProps) {
  const activePreset = detectPreset(period);
  const presetLabel = activePreset ? PERIOD_PRESET_LABELS[activePreset] : 'Personalizado';

  return (
    <Stack gap={6} mb="lg">
      <Group gap="xs" wrap="wrap">
        <Menu withArrow position="bottom-start">
          <Menu.Target>
            <UnstyledButton
              w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 'var(--mantine-radius-md)',
                border: '1px solid var(--mantine-color-lilac-4)',
                backgroundColor: 'var(--mantine-color-lilac-0)',
              }}
            >
              <Text size="sm" fw={600} c="plum.7">
                {presetLabel}
              </Text>
              <ChevronDown size={16} color="var(--mantine-color-plum-6)" />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            {PERIOD_PRESETS.map((preset) => (
              <Menu.Item
                key={preset}
                onClick={() => onChange(getPresetPeriod(preset))}
                color={activePreset === preset ? 'plum' : undefined}
                fw={activePreset === preset ? 700 : 400}
              >
                {PERIOD_PRESET_LABELS[preset]}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <DateInput
          placeholder="De"
          valueFormat="DD/MM/YYYY"
          firstDayOfWeek={FIRST_DAY_OF_WEEK}
          value={toDate(period.from)}
          onChange={(date) => {
            if (date) onChange({ ...period, from: dayjs(date).format('YYYY-MM-DD') });
          }}
          leftSection={<Calendar size={16} color="var(--mantine-color-plum-6)" />}
          styles={LILAC_INPUT_STYLES}
          w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
        />
        <DateInput
          placeholder="Até"
          valueFormat="DD/MM/YYYY"
          firstDayOfWeek={FIRST_DAY_OF_WEEK}
          value={toDate(period.to)}
          onChange={(date) => {
            if (date) onChange({ ...period, to: dayjs(date).format('YYYY-MM-DD') });
          }}
          leftSection={<Calendar size={16} color="var(--mantine-color-plum-6)" />}
          styles={LILAC_INPUT_STYLES}
          w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
        />
      </Group>

      {error && (
        <Text size="sm" c="rejected">
          {error}
        </Text>
      )}

      <Text size="xs" c="dimmed">
        Os valores consideram a data de retirada do pedido. Períodos com datas futuras
        incluem pedidos já agendados, que ainda não foram retirados.
      </Text>
    </Stack>
  );
}
