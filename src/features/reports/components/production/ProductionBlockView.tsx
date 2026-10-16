import { SimpleGrid, Stack } from '@mantine/core';
import { Cake, ClipboardList, Scale } from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard/StatCard';
import { REPORT_STAT_COLOR } from '../../constants/statCard';
import type { ProductionBlock } from '../../types/reports';
import { formatKg } from '../../utils/formatters';
import { ProductionLinesCard } from './ProductionLinesCard';
import { ProductionCombinationsSection } from './ProductionCombinationsSection';

interface ProductionBlockViewProps {
  block: ProductionBlock;
  showSummary?: boolean;
}

export function ProductionBlockView({
  block,
  showSummary = false,
}: ProductionBlockViewProps) {
  return (
    <Stack gap="xl">
      {showSummary && (
        <SimpleGrid cols={{ base: 1, xs: 3 }}>
          <StatCard
            icon={ClipboardList}
            label="Pedidos aceitos"
            value={block.ordersCount}
            color={REPORT_STAT_COLOR}
          />
          <StatCard
            icon={Cake}
            label="Bolos"
            value={block.cakesCount}
            color={REPORT_STAT_COLOR}
          />
          <StatCard
            icon={Scale}
            label="Quilos de bolo"
            value={formatKg(block.totalKg)}
            color={REPORT_STAT_COLOR}
          />
        </SimpleGrid>
      )}
      <SimpleGrid cols={{ base: 1, md: 3 }} style={{ alignItems: 'start' }}>
        <ProductionLinesCard title="Por recheio" lines={block.byFlavor} />
        <ProductionLinesCard
          title="Por cor da massa"
          lines={block.byCakeBase}
          finishPrefix="Massa"
        />
        <ProductionLinesCard
          title="Por cor da raspa"
          lines={block.byTopping}
          finishPrefix="Raspa"
        />
      </SimpleGrid>
      <ProductionCombinationsSection combinations={block.combinations} />{' '}
    </Stack>
  );
}
