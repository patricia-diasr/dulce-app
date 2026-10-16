import dayjs from 'dayjs';
import { businessToday } from '@/shared/utils/businessDate';
import type { ReportPeriod } from '../types/reports';

export type PeriodPreset = 'last7' | 'last30' | 'thisMonth' | 'lastMonth';

export const PERIOD_PRESETS: PeriodPreset[] = [
  'last7',
  'last30',
  'thisMonth',
  'lastMonth',
];

export const PERIOD_PRESET_LABELS: Record<PeriodPreset, string> = {
  last7: 'Últimos 7 dias',
  last30: 'Últimos 30 dias',
  thisMonth: 'Este mês',
  lastMonth: 'Mês passado',
};

export const MAX_ANALYTIC_DAYS = 1830;
export const MAX_PRODUCTION_DAYS = 31;

const FORMAT = 'YYYY-MM-DD';

export function getPresetPeriod(preset: PeriodPreset): ReportPeriod {
  const today = dayjs(businessToday());

  switch (preset) {
    case 'last7':
      return { from: today.subtract(6, 'day').format(FORMAT), to: today.format(FORMAT) };
    case 'last30':
      return { from: today.subtract(29, 'day').format(FORMAT), to: today.format(FORMAT) };
    case 'thisMonth':
      return {
        from: today.startOf('month').format(FORMAT),
        to: today.endOf('month').format(FORMAT),
      };
    case 'lastMonth': {
      const lastMonth = today.subtract(1, 'month');
      return {
        from: lastMonth.startOf('month').format(FORMAT),
        to: lastMonth.endOf('month').format(FORMAT),
      };
    }
  }
}

export function detectPreset(period: ReportPeriod): PeriodPreset | null {
  return (
    PERIOD_PRESETS.find((preset) => {
      const candidate = getPresetPeriod(preset);
      return candidate.from === period.from && candidate.to === period.to;
    }) ?? null
  );
}

export function validatePeriod(period: ReportPeriod, maxDays: number): string | null {
  const from = dayjs(period.from);
  const to = dayjs(period.to);

  if (!from.isValid() || !to.isValid()) return 'Parâmetro inválido.';
  if (to.isBefore(from, 'day')) return 'Data final não pode ser anterior à data inicial.';
  if (to.diff(from, 'day') + 1 > maxDays)
    return `Intervalo máximo de consulta é de ${maxDays} dias.`;

  return null;
}
