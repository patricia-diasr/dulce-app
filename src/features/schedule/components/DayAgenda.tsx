import 'dayjs/locale/pt-br';
import { Alert, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CalendarOff, Lock } from 'lucide-react';
import { listAllOrdersInRange } from '@/features/orders/api/ordersApi';
import type { OrderListItem } from '@/features/orders/types/order';
import { toBusinessTime } from '@/shared/utils/businessDate';
import { textColor } from '@/theme/colors';
import { getFullyBlockedDays, listScheduleBlocks } from '../api/scheduleApi';
import { filterCalendarOrders } from '../utils/calendarEvents';
import {
  getBlockOccurrencesForDay,
  type BlockOccurrence,
} from '../utils/blockOccurrences';
import { DayAgendaBlockCard } from './DayAgendaBlockCard';
import { DayAgendaOrderCard } from './DayAgendaOrderCard';

interface DayAgendaProps {
  date: string;
}

type AgendaEntry =
  | { kind: 'order'; time: string; order: OrderListItem }
  | { kind: 'block'; time: string; occurrence: BlockOccurrence };

function formatDayLabel(date: string) {
  const label = dayjs(date).locale('pt-br').format('dddd, D [de] MMMM');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function DayAgenda({ date }: DayAgendaProps) {
  const ordersQuery = useQuery({
    queryKey: ['admin', 'calendar', 'day', 'orders', date],
    queryFn: () => listAllOrdersInRange(date, date),
  });

  const blocksQuery = useQuery({
    queryKey: ['schedule', 'blocks'],
    queryFn: () => listScheduleBlocks(true),
  });

  const fullyBlockedQuery = useQuery({
    queryKey: ['admin', 'calendar', 'day', 'fully-blocked', date],
    queryFn: () => getFullyBlockedDays(date, date),
  });

  const isLoading =
    ordersQuery.isLoading || blocksQuery.isLoading || fullyBlockedQuery.isLoading;
  const isError = ordersQuery.isError || blocksQuery.isError;
  const isFullyBlocked = (fullyBlockedQuery.data ?? []).length > 0;

  const orders = filterCalendarOrders(ordersQuery.data ?? []);
  const occurrences = getBlockOccurrencesForDay(blocksQuery.data ?? [], date);

  const entries: AgendaEntry[] = [
    ...orders.map((order) => ({
      kind: 'order' as const,
      time: toBusinessTime(order.pickupAt).format('HH:mm'),
      order,
    })),
    ...occurrences.map((occurrence) => ({
      kind: 'block' as const,
      time: occurrence.startTime,
      occurrence,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Stack gap="lg">
      <div>
        <Title order={3} fz={20} fw={800} c={textColor}>
          {formatDayLabel(date)}
        </Title>
        {!isLoading && !isError && (
          <Text size="sm" c="dimmed" mt={2}>
            {orders.length === 0
              ? 'Nenhum pedido'
              : orders.length === 1
                ? '1 pedido'
                : `${orders.length} pedidos`}
            {' · '}
            {occurrences.length === 0
              ? 'nenhum bloqueio'
              : occurrences.length === 1
                ? '1 bloqueio'
                : `${occurrences.length} bloqueios`}
          </Text>
        )}
      </div>

      {isFullyBlocked && (
        <Alert icon={<Lock size={18} />} color="rejected" variant="light" radius="md">
          Dia totalmente bloqueado
        </Alert>
      )}

      {isLoading && (
        <Stack gap="sm">
          <Skeleton height={64} radius="md" />
          <Skeleton height={64} radius="md" />
        </Stack>
      )}

      {isError && (
        <Text size="sm" c="rejected">
          Não foi possível carregar os dados desse dia.
        </Text>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="xl"
            size={48}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <CalendarOff size={24} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            Nenhum pedido ou bloqueio nesse dia.
          </Text>
        </Stack>
      )}

      {!isLoading && !isError && entries.length > 0 && (
        <Stack gap="sm">
          {entries.map((entry) =>
            entry.kind === 'order' ? (
              <DayAgendaOrderCard key={`order-${entry.order.id}`} order={entry.order} />
            ) : (
              <DayAgendaBlockCard
                key={`block-${entry.occurrence.block.id}-${entry.occurrence.startsToday}`}
                occurrence={entry.occurrence}
              />
            ),
          )}
        </Stack>
      )}
    </Stack>
  );
}
