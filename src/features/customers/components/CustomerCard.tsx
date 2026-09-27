import { useState } from 'react';
import { Card, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Customer } from '../types';
import { formatPhoneNumber } from '@/shared/utils/phone';

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      component={Link}
      to={`/admin/clientes/${customer.id}`}
      padding="lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
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
              ? '48px minmax(0, 1fr)'
              : '60px minmax(0, 1fr)',
          gap: isSmallScreen ? '8px' : '12px',
          alignItems: 'start',
        }}
      >
        {!isVerySmallScreen && (
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="md"
            size={isSmallScreen ? 48 : 60}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <User size={isSmallScreen ? 22 : 28} />
          </ThemeIcon>
        )}

        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text fw={900} size="xl" style={{ overflowWrap: 'break-word' }}>
            {customer.name}
          </Text>

          <Text size="sm" c="dimmed">
            {formatPhoneNumber(customer.phone)}
          </Text>

          <Text size="sm" c="dimmed" style={{ overflowWrap: 'break-word' }}>
            {customer.email || 'Sem e-mail'}
          </Text>

          <Text
            size="sm"
            c={customer.notes ? 'plum.6' : 'dimmed'}
            fs={customer.notes ? 'italic' : undefined}
            style={{ overflowWrap: 'break-word' }}
          >
            {customer.notes || 'Sem observações'}
          </Text>
        </Stack>
      </div>
    </Card>
  );
}
