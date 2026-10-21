import { useState } from 'react';
import { Card, Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CustomerAvatar } from '@/shared/components/CustomerAvatar/CustomerAvatar';
import { formatCurrency } from '@/shared/utils/currency';
import { formatPhoneNumber } from '@/shared/utils/phone';
import type { TopCustomerItem } from '../../types/reports';
import { formatKg } from '../../utils/formatters';

interface TopCustomerCardProps {
  customer: TopCustomerItem;
  position: number;
}

export function TopCustomerCard({ customer, position }: TopCustomerCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      padding="md"
      onClick={() => navigate(`/admin/clientes/${customer.customerId}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.10)' : undefined,
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Group gap="sm" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
          <Text fw={900} c="plum.6" w={24}>
            {position}
          </Text>
          <CustomerAvatar name={customer.name} size={40} />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <Text fw={800} size="sm" style={{ overflowWrap: 'break-word' }}>
              {customer.name}
            </Text>
            <Text size="xs" c="dimmed">
              {formatPhoneNumber(customer.phone)}
            </Text>
          </Stack>
        </Group>

        <Stack gap={0} align="end" style={{ flexShrink: 0 }}>
          <Text fw={900} c="plum.7" style={{ whiteSpace: 'nowrap' }}>
            {formatCurrency(customer.netAmount)}
          </Text>
          <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
            {customer.ordersCount} {customer.ordersCount === 1 ? 'pedido' : 'pedidos'} ·{' '}
            {formatKg(customer.totalKg)}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
