import { Badge, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { CakeBaseBadge } from '@/shared/components/CakeBaseBadge/CakeBaseBadge';
import { textColor } from '@/theme/colors';
import type { ProductionLine } from '../../types/reports';
import { formatKg } from '../../utils/formatters';

interface ProductionLinesCardProps {
  title: string;
  lines: ProductionLine[];
  finishPrefix?: 'Massa' | 'Raspa';
}

export function ProductionLinesCard({
  title,
  lines,
  finishPrefix,
}: ProductionLinesCardProps) {
  return (
    <Card padding="lg">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          {title}
        </Title>

        {lines.map((line, index) => (
          <Stack key={line.flavorId ?? line.finish ?? line.label} gap="sm">
            {index > 0 && <Divider color="caramel.2" />}

            <Group justify="space-between" wrap="nowrap" gap="sm">
              {finishPrefix && line.finish ? (
                <CakeBaseBadge prefix={finishPrefix} value={line.finish} />
              ) : (
                <Text fw={800} style={{ overflowWrap: 'break-word', minWidth: 0 }}>
                  {line.label}
                </Text>
              )}
              <Text fw={900} c="plum.7" style={{ whiteSpace: 'nowrap' }}>
                {formatKg(line.totalKg)}
              </Text>
            </Group>

            <Group gap={6} wrap="wrap">
              <Text size="xs" c="dimmed">
                {line.cakesCount} {line.cakesCount === 1 ? 'bolo' : 'bolos'}
              </Text>
              {line.bySize.map((size) => (
                <Badge
                  key={size.sizeId}
                  variant="light"
                  color="lilac"
                  size="sm"
                  radius="sm"
                >
                  {size.quantity} × {size.sizeName}
                </Badge>
              ))}
            </Group>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
