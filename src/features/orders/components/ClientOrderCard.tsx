import { useState } from 'react';
import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Cake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderStatusColor } from '@/theme/colors';
import { formatCurrency } from '@/shared/utils/currency';
import {
  CREATION_CHANNEL_LABELS,
  INVOICE_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
  ORDER_STATUS_LABELS,
} from '../constants/orderStatus';
import type { NestedOrder } from '../types/order';

interface ClientOrderCardProps {
  order: NestedOrder;
}

export function ClientOrderCard({ order }: ClientOrderCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');

  const pickupDate = new Date(order.pickupAt).toLocaleDateString('pt-BR');
  const total = order.invoice ? order.invoice.grossAmount - order.invoice.discount : null;
  const itemsSummary = order.items
    .map((item) => `${item.sizeName} ${item.flavorName}`)
    .join(', ');

  const contextBadges = (
    <Group gap={6} wrap="wrap">
      <Badge size="xs" variant="light" color="lilac">
        {CREATION_CHANNEL_LABELS[order.creationChannel]}
      </Badge>
      {order.invoice && (
        <Badge
          size="xs"
          variant="light"
          color={INVOICE_STATUS_COLORS[order.invoice.status]}
        >
          {INVOICE_STATUS_LABELS[order.invoice.status]}
        </Badge>
      )}
    </Group>
  );

  return (
    <Card
      padding="lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/pedidos/${order.id}`)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.10)' : undefined,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isVerySmallScreen
            ? '1fr'
            : isSmallScreen
              ? '44px minmax(0, 1fr)'
              : '48px minmax(0, 1fr)',
          gap: isSmallScreen ? '8px' : '12px',
          alignItems: 'start',
        }}
      >
        {!isVerySmallScreen && (
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="md"
            size={isSmallScreen ? 44 : 48}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <Cake size={isSmallScreen ? 18 : 22} />
          </ThemeIcon>
        )}

        <Stack gap={6} style={{ minWidth: 0 }}>
          {isSmallScreen ? (
            <Stack gap={6}>
              {contextBadges}
              <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
                <Text fw={800} style={{ overflowWrap: 'break-word', minWidth: 0 }}>
                  Pedido #{order.id}
                </Text>
                <Badge
                  color={orderStatusColor[order.status]}
                  variant="light"
                  style={{ flexShrink: 0 }}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </Group>
            </Stack>
          ) : (
            <Group justify="space-between" align="start" gap="xs" wrap="nowrap">
              <Group gap="xs" wrap="wrap" style={{ minWidth: 0 }}>
                <Text fw={800} style={{ overflowWrap: 'break-word' }}>
                  Pedido #{order.id}
                </Text>
                {contextBadges}
              </Group>

              <Badge color={orderStatusColor[order.status]} variant="light">
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </Group>
          )}

          <Text size="sm" c="dimmed" style={{ overflowWrap: 'break-word' }}>
            {itemsSummary}
          </Text>

          <Text size="sm" c="dimmed">
            Retirada em {pickupDate}
          </Text>

          <Text fw={800} c="plum.7" ta="right" style={{ whiteSpace: 'nowrap' }}>
            {total != null ? formatCurrency(total) : '—'}
          </Text>
        </Stack>
      </div>
    </Card>
  );
}
