import { Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { CalendarClock, Check, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { textColor } from '@/theme/colors';
import { listOrders } from '../api/ordersApi';
import { DashboardOrderColumn } from '../components/DashboardOrderColumn';
import { StatCard } from '@/shared/components/StatCard/StatCard';

const ITEMS_PER_SECTION = 5;

export function AdminDashboardPage() {
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const dayAfterTomorrow = dayjs().add(2, 'day').format('YYYY-MM-DD');

  const pendingQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'pending', ITEMS_PER_SECTION],
    queryFn: () => listOrders({ status: 'PENDING', size: ITEMS_PER_SECTION }),
  });

  const todayQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'today', ITEMS_PER_SECTION],
    queryFn: () =>
      listOrders({ status: 'ACCEPTED', from: today, to: today, size: ITEMS_PER_SECTION }),
  });

  const upcomingQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'upcoming', ITEMS_PER_SECTION],
    queryFn: () =>
      listOrders({
        status: 'ACCEPTED',
        from: tomorrow,
        to: dayAfterTomorrow,
        size: ITEMS_PER_SECTION,
      }),
  });

  return (
    <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
      <Stack gap="xl">
        <div>
          <Title order={1} fz={28} fw={700} c={textColor}>
            Dashboard
          </Title>
          <Text c={textColor} opacity={0.75} size="sm" mt={4}>
            Veja pedidos aguardando aprovação e agendados para os próximos dias.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <StatCard
            icon={Clock}
            label="Pedidos pendentes de aprovação"
            value={pendingQuery.data?.totalElements ?? 0}
            color="pending"
          />
          <StatCard
            icon={Check}
            label="Pedidos para retirada hoje"
            value={todayQuery.data?.totalElements ?? 0}
            color="accepted"
          />
          <StatCard
            icon={CalendarClock}
            label="Pedidos para os próximos 2 dias"
            value={upcomingQuery.data?.totalElements ?? 0}
            color="plum"
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
          <DashboardOrderColumn
            title="Pedidos pendentes de aprovação"
            totalCount={pendingQuery.data?.totalElements ?? 0}
            orders={pendingQuery.data?.content ?? []}
            isLoading={pendingQuery.isLoading}
            viewAllLabel="Ver todos os pendentes"
            viewAllTo="/admin/pedidos?status=PENDING"
          />
          <DashboardOrderColumn
            title="Pedidos de hoje"
            totalCount={todayQuery.data?.totalElements ?? 0}
            orders={todayQuery.data?.content ?? []}
            isLoading={todayQuery.isLoading}
            viewAllLabel="Ver todos de hoje"
            viewAllTo={`/admin/pedidos?status=ACCEPTED&from=${today}&to=${today}`}
          />
          <DashboardOrderColumn
            title="Pedidos dos próximos 2 dias"
            totalCount={upcomingQuery.data?.totalElements ?? 0}
            orders={upcomingQuery.data?.content ?? []}
            isLoading={upcomingQuery.isLoading}
            viewAllLabel="Ver todos dos próximos dias"
            viewAllTo={`/admin/pedidos?status=ACCEPTED&from=${tomorrow}&to=${dayAfterTomorrow}`}
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
