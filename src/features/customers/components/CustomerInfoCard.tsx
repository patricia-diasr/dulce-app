import { Button, Card, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Pencil, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPhoneNumber } from '@/shared/utils/phone';
import type { Customer } from '../types';

interface CustomerInfoCardProps {
  customer: Customer;
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');

  const editButton = (
    <Button
      component={Link}
      to={`/admin/clientes/${customer.id}/editar`}
      variant="subtle"
      color="plum"
      leftSection={<Pencil size={16} />}
    >
      Editar
    </Button>
  );

  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group align="start" justify="space-between" wrap="nowrap" gap="md">
          <Group align="start" gap="md" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            {!isVerySmallScreen && (
              <ThemeIcon
                variant="light"
                color="lilac"
                radius="md"
                size={isSmallScreen ? 48 : 60}
                style={{ color: 'var(--mantine-color-plum-6)', flexShrink: 0 }}
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
            </Stack>
          </Group>

          {!isSmallScreen && editButton}
        </Group>

        <Divider color="caramel.2" />

        <Text
          size="sm"
          c={customer.notes ? undefined : 'dimmed'}
          fs={customer.notes ? undefined : 'italic'}
          style={{ overflowWrap: 'break-word' }}
        >
          {customer.notes || 'Sem observações'}
        </Text>

        {isSmallScreen && <Group justify="flex-start">{editButton}</Group>}
      </Stack>
    </Card>
  );
}
