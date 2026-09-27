import { useState } from 'react';
import { Badge, Card, Divider, Group, Skeleton, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { textColor } from '@/theme/colors';
import { DashboardOrderRow } from './DashboardOrderRow';
import type { OrderListItem } from '../types/order';

interface DashboardOrderColumnProps {
  title: string;
  totalCount: number;
  orders: OrderListItem[];
  isLoading: boolean;
  viewAllLabel: string;
  viewAllTo: string;
}

export function DashboardOrderColumn({
  title,
  totalCount,
  orders,
  isLoading,
  viewAllLabel,
  viewAllTo,
}: DashboardOrderColumnProps) {
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group gap="xs">
          <Text fw={800} size="md" c={textColor}>
            {title}
          </Text>
          <Badge size="sm" variant="light" color="lilac">
            {totalCount}
          </Badge>
        </Group>

        {isLoading ? (
          <Stack gap="sm">
            <Skeleton height={50} radius="sm" />
            <Skeleton height={50} radius="sm" />
            <Skeleton height={50} radius="sm" />
          </Stack>
        ) : orders.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic">
            Nenhum pedido aqui no momento.
          </Text>
        ) : (
          <Stack gap="sm">
            {orders.map((order, index) => (
              <div key={order.id}>
                <DashboardOrderRow order={order} />
                {index < orders.length - 1 && <Divider color="caramel.2" mt="sm" />}
              </div>
            ))}
          </Stack>
        )}

        {totalCount > orders.length && (
          <Text
            component={Link}
            to={viewAllTo}
            size="sm"
            fw={700}
            c="plum.6"
            ta="center"
            onMouseEnter={() => setIsViewAllHovered(true)}
            onMouseLeave={() => setIsViewAllHovered(false)}
            style={{ textDecoration: isViewAllHovered ? 'underline' : 'none' }}
          >
            {viewAllLabel}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
