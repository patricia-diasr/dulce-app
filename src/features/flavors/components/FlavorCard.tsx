import {
  ActionIcon,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Cake, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CakeBaseBadge } from '@/shared/components/CakeBaseBadge/CakeBaseBadge';
import { formatCurrency } from '@/shared/utils/currency';
import { textColor } from '@/theme/colors';
import type { Flavor } from '../types';

interface FlavorCardProps {
  flavor: Flavor;
  onDelete: (flavor: Flavor) => void;
}

export function FlavorCard({ flavor, onDelete }: FlavorCardProps) {
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');

  return (
    <Card padding="lg">
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
            style={{
              color: 'var(--mantine-color-plum-6)',
            }}
          >
            <Cake size={isSmallScreen ? 22 : 28} />
          </ThemeIcon>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gridTemplateRows: 'auto auto',
            columnGap: isSmallScreen ? '8px' : '16px',
            rowGap: '6px',
            alignItems: 'start',
            minWidth: 0,
          }}
        >
          <Text
            fw={900}
            size="xl"
            style={{
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            {flavor.name}
          </Text>

          <Group gap={4} wrap="nowrap">
            <Tooltip label="Editar recheio" withArrow>
              <ActionIcon
                component={Link}
                to={`/admin/recheios/${flavor.id}`}
                variant="subtle"
                color="plum"
                aria-label={`Editar ${flavor.name}`}
              >
                <Pencil size={18} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Excluir recheio" withArrow>
              <ActionIcon
                variant="subtle"
                color="rejected"
                aria-label={`Excluir ${flavor.name}`}
                onClick={() => onDelete(flavor)}
              >
                <Trash2 size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group
            gap={6}
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <CakeBaseBadge prefix="Massa" value={flavor.defaultCakeBase} />

            <CakeBaseBadge prefix="Raspa" value={flavor.defaultTopping} />
          </Group>
        </div>
      </div>

      <Divider my="md" color="caramel.2" />

      <SimpleGrid cols={3} spacing="xs">
        {flavor.prices.map((price) => (
          <Stack
            key={price.sizeId}
            gap={1}
            align="center"
            ta="center"
            style={{
              minWidth: 0,
            }}
          >
            <Text size="md" fw={900} c="plum.6" tt="uppercase">
              {price.sizeName}
            </Text>

            <Text
              fw={800}
              c={textColor}
              style={{
                fontSize: 'clamp(1rem, 5vw, 1.25rem)',
                whiteSpace: 'nowrap',
              }}
            >
              {formatCurrency(price.salePrice)}
            </Text>

            <Text
              size="sm"
              c="dimmed"
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {formatCurrency(price.costPrice)}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
}
