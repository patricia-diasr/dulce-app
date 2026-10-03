import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Group,
  Loader,
  Menu,
  SimpleGrid,
  Skeleton,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useInViewport } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Calendar, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { listOrders } from '../api/ordersApi';
import { ORDER_STATUS_LABELS } from '../constants/orderStatus';
import { OrderListCard } from '../components/OrderListCard';
import type { OrderStatus } from '../types/order';
import { FIRST_DAY_OF_WEEK } from '@/features/schedule/constants/calendar';

const STATUS_OPTIONS = (Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map(
  (status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  }),
);

const FILTER_ITEM_WIDTH = 150;

const LILAC_INPUT_STYLES = {
  input: {
    backgroundColor: 'var(--mantine-color-lilac-0)',
    borderColor: 'var(--mantine-color-lilac-4)',
    color: 'var(--mantine-color-plum-7)',
    fontWeight: 600,
  },
};

export function AdminOrdersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<OrderStatus | null>(
    (searchParams.get('status') as OrderStatus | null) ?? null,
  );
  const [fromDate, setFromDate] = useState<string | null>(searchParams.get('from'));
  const [toDate, setToDate] = useState<string | null>(searchParams.get('to'));

  useEffect(() => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fromDate, toDate]);

  const hasIncompleteRange = Boolean(fromDate) !== Boolean(toDate);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['admin', 'orders', 'list', status, fromDate, toDate],
      queryFn: ({ pageParam }) =>
        listOrders({
          status: status ?? undefined,
          from: fromDate ?? undefined,
          to: toDate ?? undefined,
          page: pageParam,
          size: 20,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        return nextPage < lastPage.totalPages ? nextPage : undefined;
      },
      enabled: !hasIncompleteRange,
    });

  const orders = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  const { ref: sentinelRef, inViewport } = useInViewport();

  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showEmptyState =
    !hasIncompleteRange && !isLoading && !isError && orders.length === 0;
  const statusLabel = status ? ORDER_STATUS_LABELS[status] : 'Status';

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
        <Group mb="lg" gap="xs" wrap="wrap">
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
                  {statusLabel}
                </Text>
                <ChevronDown size={16} color="var(--mantine-color-plum-6)" />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => setStatus(null)}
                color={!status ? 'plum' : undefined}
                fw={!status ? 700 : 400}
              >
                Todos
              </Menu.Item>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <Menu.Item
                  key={value}
                  onClick={() => setStatus(value)}
                  color={status === value ? 'plum' : undefined}
                  fw={status === value ? 700 : 400}
                >
                  {label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <DateInput
            placeholder="De"
            valueFormat="DD/MM/YYYY"
            value={fromDate ? new Date(`${fromDate}T00:00:00`) : null}
            onChange={(date) =>
              setFromDate(date ? dayjs(date).format('YYYY-MM-DD') : null)
            }
            leftSection={<Calendar size={16} color="var(--mantine-color-plum-6)" />}
            clearable
            styles={LILAC_INPUT_STYLES}
            w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
            firstDayOfWeek={FIRST_DAY_OF_WEEK}
          />
          <DateInput
            placeholder="Até"
            valueFormat="DD/MM/YYYY"
            value={toDate ? new Date(`${toDate}T00:00:00`) : null}
            onChange={(date) => setToDate(date ? dayjs(date).format('YYYY-MM-DD') : null)}
            leftSection={<Calendar size={16} color="var(--mantine-color-plum-6)" />}
            clearable
            styles={LILAC_INPUT_STYLES}
            w={{ base: '100%', sm: FILTER_ITEM_WIDTH }}
            firstDayOfWeek={FIRST_DAY_OF_WEEK}
          />
        </Group>

        {hasIncompleteRange && (
          <Text size="sm" c="rejected" mb="md">
            Informe as duas datas do período, ou limpe ambas.
          </Text>
        )}

        {!hasIncompleteRange && !isLoading && !isError && totalElements > 0 && (
          <Text size="sm" c="dimmed" mb="md">
            {totalElements}{' '}
            {totalElements === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </Text>
        )}

        {!hasIncompleteRange && isLoading && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <Skeleton height={140} radius="md" />
            <Skeleton height={140} radius="md" />
            <Skeleton height={140} radius="md" />
          </SimpleGrid>
        )}

        {isError && (
          <Box
            style={{
              minHeight: '40vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="rejected">
              Não foi possível carregar os pedidos. Tente novamente em instantes.
            </Text>
          </Box>
        )}

        {showEmptyState && (
          <Box
            style={{
              minHeight: '40vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="dimmed">Nenhum pedido encontrado com esses filtros.</Text>
          </Box>
        )}

        {orders.length > 0 && (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {orders.map((order) => (
                <OrderListCard key={order.id} order={order} />
              ))}
            </SimpleGrid>

            <Box ref={sentinelRef} style={{ height: 1 }} />

            {isFetchingNextPage && (
              <Group justify="center" mt="md">
                <Loader size="sm" color="plum" />
              </Group>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
