import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CakeBaseBadge } from '@/shared/components/CakeBaseBadge/CakeBaseBadge';
import { textColor } from '@/theme/colors';
import type { ProductionCombination } from '../../types/reports';
import { formatKg } from '../../utils/formatters';

function CombinationCard({ combination }: { combination: ProductionCombination }) {
  return (
    <Card padding="lg">
      <Group align="start" wrap="nowrap" gap="md">
        <ThemeIcon
          variant="light"
          color="lilac"
          radius="md"
          size={60}
          style={{ flexShrink: 0 }}
        >
          <Text fw={900} fz={20} c="plum.7">
            {combination.quantity}×
          </Text>
        </ThemeIcon>

        <Stack gap={6} style={{ minWidth: 0, flex: 1 }}>
          <Text fw={900} size="lg" style={{ overflowWrap: 'break-word' }}>
            {combination.flavorName} — {combination.sizeName}
          </Text>
          <Group gap={6} wrap="wrap">
            <CakeBaseBadge prefix="Massa" value={combination.cakeBase} />
            <CakeBaseBadge prefix="Raspa" value={combination.topping} />
          </Group>
          <Text size="sm" c="dimmed">
            {formatKg(combination.totalKg)} no total
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

interface ProductionCombinationsSectionProps {
  combinations: ProductionCombination[];
}

export function ProductionCombinationsSection({
  combinations,
}: ProductionCombinationsSectionProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={2} fz={22} fw={800} c={textColor}>
          O que montar
        </Title>
        <Text size="sm" c="dimmed" mt={2}>
          Cada combinação de recheio, tamanho, massa e raspa, com a quantidade.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {combinations.map((combination) => (
          <CombinationCard
            key={`${combination.flavorName}-${combination.sizeName}-${combination.cakeBase}-${combination.topping}`}
            combination={combination}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
