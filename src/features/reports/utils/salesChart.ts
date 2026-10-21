import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import type { ReportPeriod, SalesGroupBy, SalesSeriesPoint } from '../types/reports';

function getPeriodDays(period: ReportPeriod): number {
  return dayjs(period.to).diff(dayjs(period.from), 'day') + 1;
}

function formatSeriesLabel(periodStart: string, groupBy: SalesGroupBy): string {
  const date = dayjs(periodStart).locale('pt-br');
  if (groupBy === 'day') return date.format('DD/MM');
  if (groupBy === 'week') return `Sem. ${date.format('DD/MM')}`;
  const month = date.format('MMM/YY');
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function getAutoGroupBy(period: ReportPeriod): SalesGroupBy {
  const days = getPeriodDays(period);
  if (days <= 31) return 'day';
  if (days <= 183) return 'week';
  return 'month';
}

export function getAvailableGroupBy(period: ReportPeriod): SalesGroupBy[] {
  const days = getPeriodDays(period);
  const available: SalesGroupBy[] = [];
  if (days <= 92) available.push('day');
  if (days <= 730) available.push('week');
  available.push('month');
  return available;
}

export function buildSalesChartData(series: SalesSeriesPoint[], groupBy: SalesGroupBy) {
  return series.map((point) => ({
    label: formatSeriesLabel(point.periodStart, groupBy),
    netAmount: point.netAmount,
  }));
}
