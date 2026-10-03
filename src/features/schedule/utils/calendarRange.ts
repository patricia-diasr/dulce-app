import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { FIRST_DAY_OF_WEEK } from '../constants/calendar';

export type CalendarView = 'month' | 'week';

function startOfCalendarWeek(date: Dayjs): Dayjs {
  const diff = (date.day() - FIRST_DAY_OF_WEEK + 7) % 7;
  return date.subtract(diff, 'day').startOf('day');
}

export function getVisibleRange(view: CalendarView, anchor: string) {
  const date = dayjs(anchor);

  if (view === 'week') {
    const start = startOfCalendarWeek(date);
    return {
      from: start.format('YYYY-MM-DD'),
      to: start.add(6, 'day').format('YYYY-MM-DD'),
    };
  }

  const gridStart = startOfCalendarWeek(date.startOf('month'));
  return {
    from: gridStart.format('YYYY-MM-DD'),
    to: gridStart.add(41, 'day').format('YYYY-MM-DD'),
  };
}

export function shiftAnchor(
  view: CalendarView,
  anchor: string,
  direction: 1 | -1,
): string {
  const date = dayjs(anchor);
  return view === 'month'
    ? date.add(direction, 'month').startOf('month').format('YYYY-MM-DD')
    : date.add(direction * 7, 'day').format('YYYY-MM-DD');
}

export function formatPeriodLabel(view: CalendarView, anchor: string): string {
  const date = dayjs(anchor).locale('pt-br');

  if (view === 'month') {
    const label = date.format('MMMM [de] YYYY');
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  const start = startOfCalendarWeek(date).locale('pt-br');
  return `${start.format('D MMM')} – ${start.add(6, 'day').format('D MMM YYYY')}`;
}
