import { SimpleGrid } from '@mantine/core';
import { Cake, Clock, Wallet } from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard/StatCard';
import { formatCurrency } from '@/shared/utils/currency';
import type { Order } from '../types';

interface CustomerStatsGridProps {
  orders: Order[];
}

export function CustomerStatsGrid({ orders }: CustomerStatsGridProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;
  const totalPaid = orders.reduce(
    (sum, order) =>
      sum + (order.invoice?.payments.reduce((s, p) => s + p.amount, 0) ?? 0),
    0,
  );

  return (
    <SimpleGrid cols={1} spacing="md">
      <StatCard
        icon={Cake}
        label="Pedidos realizados"
        value={totalOrders}
        color="lilac"
      />
      <StatCard
        icon={Clock}
        label="Pedidos pendentes"
        value={pendingOrders}
        color="pending"
      />
      <StatCard
        icon={Wallet}
        label="Total pago"
        value={formatCurrency(totalPaid)}
        color="accepted"
      />
    </SimpleGrid>
  );
}
