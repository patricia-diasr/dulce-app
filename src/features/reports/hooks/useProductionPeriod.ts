import { useCallback } from 'react';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { businessToday } from '@/shared/utils/businessDate';
import type { ReportPeriod } from '../types/reports';

export type ProductionMode = 'day' | 'range';

const FORMAT = 'YYYY-MM-DD';

export function useProductionPeriod() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rangeFrom = searchParams.get('pfrom');
  const rangeTo = searchParams.get('pto');
  const mode: ProductionMode = rangeFrom && rangeTo ? 'range' : 'day';
  const date = searchParams.get('pdate') ?? businessToday();
  const range: ReportPeriod = { from: rangeFrom ?? date, to: rangeTo ?? date };

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null) params.delete(key);
            else params.set(key, value);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setDate = (value: string) => update({ pdate: value, pfrom: null, pto: null });
  const setRange = (value: ReportPeriod) =>
    update({ pfrom: value.from, pto: value.to, pdate: null });

  const setMode = (next: ProductionMode) => {
    if (next === 'range') {
      setRange({ from: date, to: dayjs(date).add(6, 'day').format(FORMAT) });
    } else {
      setDate(range.from);
    }
  };

  return { mode, date, range, setMode, setDate, setRange };
}
