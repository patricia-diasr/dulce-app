import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAllOrdersInRange } from '@/features/orders/api/ordersApi';
import { getFullyBlockedDays, listScheduleBlocks } from '../api/scheduleApi';
import { filterCalendarOrders } from '../utils/calendarEvents';
import type { ScheduleBlock } from '../types/scheduleBlock';

const NO_DAYS: string[] = [];
const NO_BLOCKS: ScheduleBlock[] = [];

export function useCalendarData(from: string, to: string) {
  const ordersQuery = useQuery({
    queryKey: ['admin', 'calendar', 'orders', from, to],
    queryFn: () => listAllOrdersInRange(from, to),
  });

  const blockedDaysQuery = useQuery({
    queryKey: ['admin', 'calendar', 'blocked-days', from, to],
    queryFn: () => getFullyBlockedDays(from, to),
  });

  const blocksQuery = useQuery({
    queryKey: ['schedule', 'blocks'],
    queryFn: () => listScheduleBlocks(true),
  });

  const orders = useMemo(
    () => filterCalendarOrders(ordersQuery.data ?? []),
    [ordersQuery.data],
  );

  return {
    orders,
    blockedDays: blockedDaysQuery.data ?? NO_DAYS,
    blocks: blocksQuery.data ?? NO_BLOCKS,
    isLoading:
      ordersQuery.isLoading || blockedDaysQuery.isLoading || blocksQuery.isLoading,
    isError: ordersQuery.isError,
  };
}
