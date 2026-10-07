import dayjs from 'dayjs';
import type { ScheduleEventData } from '@mantine/schedule';
import type { OrderListItem, OrderStatus } from '@/features/orders/types/order';
import { toBusinessTime } from '@/shared/utils/businessDate';
import { orderStatusColor } from '@/theme/colors';
import type { ScheduleBlock } from '../types/scheduleBlock';
import { getMergedBlockIntervalsForDay } from './blockOccurrences';

type CountableStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED';

const COUNTABLE_STATUSES: CountableStatus[] = ['PENDING', 'ACCEPTED', 'COMPLETED'];
const HIDDEN_STATUSES: OrderStatus[] = ['REJECTED', 'CANCELED'];
const ORDER_EVENT_DURATION_MINUTES = 30;
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function allDayRange(day: string) {
  return {
    start: `${day} 00:00:00`,
    end: `${dayjs(day).add(1, 'day').format('YYYY-MM-DD')} 00:00:00`,
  };
}

function formatCountLabel(status: CountableStatus, count: number): string {
  if (status === 'PENDING')
    return count === 1 ? '1 pedido pendente' : `${count} pedidos pendentes`;

  if (status === 'ACCEPTED')
    return count === 1 ? '1 pedido agendado' : `${count} pedidos agendados`;

  return count === 1 ? '1 pedido concluído' : `${count} pedidos concluídos`;
}

export function filterCalendarOrders(orders: OrderListItem[]): OrderListItem[] {
  return orders.filter((order) => !HIDDEN_STATUSES.includes(order.status));
}

export function buildBlockedDayEvents(days: string[]): ScheduleEventData[] {
  return days.map((day) => ({
    id: `blocked-${day}`,
    title: 'Dia bloqueado',
    ...allDayRange(day),
    color: 'canceled',
  }));
}

export function buildMonthOrderEvents(orders: OrderListItem[]): ScheduleEventData[] {
  const byDay = new Map<string, Record<CountableStatus, number>>();

  for (const order of orders) {
    if (!COUNTABLE_STATUSES.includes(order.status as CountableStatus)) continue;
    const day = toBusinessTime(order.pickupAt).format('YYYY-MM-DD');
    const entry = byDay.get(day) ?? { PENDING: 0, ACCEPTED: 0, COMPLETED: 0 };
    entry[order.status as CountableStatus] += 1;
    byDay.set(day, entry);
  }

  return [...byDay.entries()].flatMap(([day, counts]) =>
    COUNTABLE_STATUSES.filter((status) => counts[status] > 0).map((status) => ({
      id: `orders-${day}-${status}`,
      title: formatCountLabel(status, counts[status]),
      ...allDayRange(day),
      color: orderStatusColor[status],
    })),
  );
}

export function buildWeekOrderEvents(orders: OrderListItem[]): ScheduleEventData[] {
  return orders.map((order) => {
    const start = toBusinessTime(order.pickupAt);
    return {
      id: order.id,
      title: order.customerName,
      start: start.format(DATE_TIME_FORMAT),
      end: start.add(ORDER_EVENT_DURATION_MINUTES, 'minute').format(DATE_TIME_FORMAT),
      color: orderStatusColor[order.status],
    };
  });
}

export function buildWeekBlockEvents(
  blocks: ScheduleBlock[],
  from: string,
  to: string,
): ScheduleEventData[] {
  const days: string[] = [];
  let cursor = dayjs(from);
  const end = dayjs(to);
  while (!cursor.isAfter(end, 'day')) {
    days.push(cursor.format('YYYY-MM-DD'));
    cursor = cursor.add(1, 'day');
  }

  const events: ScheduleEventData[] = [];

  for (const day of days) {
    const intervals = getMergedBlockIntervalsForDay(blocks, day);
    intervals.forEach((interval, index) => {
      events.push({
        id: `block-${day}-${index}`,
        title: 'Bloqueado',
        start: `${day} ${interval.start}:00`,
        end: `${day} ${interval.end}:00`,
        color: 'cocoa',
        display: 'background',
      });
    });
  }

  return events;
}
