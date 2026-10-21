import { Box, Divider, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { textColor } from '@/theme/colors';
import { getProductionReport } from '../../api/reportsApi';
import type { ProductionParams } from '../../types/reports';
import { formatLongDay } from '../../utils/formatters';
import { MAX_PRODUCTION_DAYS, validatePeriod } from '../../utils/period';
import { ProductionBlockView } from './ProductionBlockView';
import { ProductionDateControls } from './ProductionDateControls';
import { ProductionDaySection } from './ProductionDaySection';
import { useProductionPeriod } from '../../hooks/useProductionPeriod';

export function ProductionTab() {
  const { mode, date, range, setMode, setDate, setRange } = useProductionPeriod();

  const rangeError = mode === 'range' ? validatePeriod(range, MAX_PRODUCTION_DAYS) : null;
  const params: ProductionParams = mode === 'day' ? { date } : range;

  const query = useQuery({
    queryKey: ['admin', 'reports', 'production', params.date, params.from, params.to],
    queryFn: () => getProductionReport(params),
    enabled: !rangeError,
  });

  const report = query.data;
  const isEmpty = report !== undefined && report.totals.ordersCount === 0;

  return (
    <Box>
      <ProductionDateControls
        mode={mode}
        date={date}
        range={range}
        error={rangeError}
        onModeChange={setMode}
        onDateChange={setDate}
        onRangeChange={setRange}
      />

      {query.isLoading && (
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, xs: 3 }}>
            <Skeleton height={90} radius="md" />
            <Skeleton height={90} radius="md" />
            <Skeleton height={90} radius="md" />
          </SimpleGrid>
          <Skeleton height={320} radius="md" />
        </Stack>
      )}

      {query.isError && (
        <Box
          style={{
            minHeight: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="rejected">
            Não foi possível carregar o relatório de produção. Tente novamente em
            instantes.
          </Text>
        </Box>
      )}

      {isEmpty && (
        <Box
          style={{
            minHeight: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Stack gap={4} align="center">
            <Text c="dimmed">
              {mode === 'day'
                ? 'Nenhum pedido aceito para esse dia.'
                : 'Nenhum pedido aceito nesse período.'}
            </Text>
            <Text size="xs" c="dimmed">
              Pedidos pendentes só entram na produção depois de aceitos.
            </Text>
          </Stack>
        </Box>
      )}

      {report && !isEmpty && (
        <Stack gap="xl">
          <div>
            <Title order={2} fz={22} fw={800} c={textColor}>
              {mode === 'day' ? `Produção de ${formatLongDay(date)}` : 'Total do período'}
            </Title>
            {mode === 'range' && (
              <Text size="sm" c="dimmed" mt={2}>
                {dayjs(range.from).format('DD/MM/YYYY')} a{' '}
                {dayjs(range.to).format('DD/MM/YYYY')}. Use para planejar a compra de
                matéria-prima.
              </Text>
            )}
          </div>

          <ProductionBlockView block={report.totals} showSummary />

          {mode === 'range' && (
            <>
              <Divider color="caramel.2" />

              <Stack gap="lg">
                <div>
                  <Title order={2} fz={22} fw={800} c={textColor}>
                    Dia a dia
                  </Title>
                  <Text size="sm" c="dimmed" mt={2}>
                    O que assar em cada dia. Dias sem pedidos aceitos não aparecem.
                  </Text>
                </div>

                {report.days.map((day, index) => (
                  <ProductionDaySection
                    key={day.date}
                    day={day}
                    defaultOpened={index === 0}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}
