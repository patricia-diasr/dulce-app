import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ReportPeriod } from '../types/reports';
import { getPresetPeriod } from '../utils/period';

export function useReportPeriod() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaults] = useState(() => getPresetPeriod('last30'));

  const period: ReportPeriod = {
    from: searchParams.get('from') ?? defaults.from,
    to: searchParams.get('to') ?? defaults.to,
  };

  const setPeriod = useCallback(
    (next: ReportPeriod) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set('from', next.from);
          params.set('to', next.to);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { period, setPeriod };
}
