import { Box, Container, ScrollArea, Tabs } from '@mantine/core';
import { ChefHat, Trophy, TrendingUp, Wallet } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { creamBackground, textColor } from '@/theme/colors';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { FinancialTab } from '../components/financial/FinancialTab';
import { ProductionTab } from '../components/production/ProductionTab';
import { RankingsTab } from '../components/rankings/RankingsTab';
import { ReportPeriodFilter } from '../components/ReportPeriodFilter';
import { SalesTab } from '../components/sales/SalesTab';
import { useReportPeriod } from '../hooks/useReportPeriod';
import { MAX_ANALYTIC_DAYS, validatePeriod } from '../utils/period';

const TABS_BAR_TOP_OFFSET = 0;

const TABS = [
  { value: 'vendas', label: 'Vendas', icon: TrendingUp },
  { value: 'producao', label: 'Produção', icon: ChefHat },
  { value: 'financeiro', label: 'Financeiro', icon: Wallet },
  { value: 'rankings', label: 'Rankings', icon: Trophy },
] as const;

type ReportTab = (typeof TABS)[number]['value'];

function isReportTab(value: string | null): value is ReportTab {
  return TABS.some((item) => item.value === value);
}

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { period, setPeriod } = useReportPeriod();

  const tabParam = searchParams.get('tab');
  const tab: ReportTab = isReportTab(tabParam) ? tabParam : 'vendas';

  const periodError = validatePeriod(period, MAX_ANALYTIC_DAYS);
  const showPeriodFilter = tab !== 'producao';

  const handleTabChange = (value: string | null) => {
    if (!isReportTab(value)) return;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('tab', value);
        return params;
      },
      { replace: true },
    );
  };

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Tabs value={tab} onChange={handleTabChange} variant="unstyled" keepMounted={false}>
        <Box
          mt={TABS_BAR_TOP_OFFSET}
          style={{
            backgroundColor: creamBackground,
            borderBottom: '1px solid var(--mantine-color-caramel-2)',
          }}
        >
          <ScrollArea type="never">
            <Tabs.List style={{ flexWrap: 'nowrap', gap: 8, padding: '0 16px' }}>
              {TABS.map(({ value, label, icon: Icon }) => {
                const isActive = tab === value;

                return (
                  <Tabs.Tab
                    key={value}
                    value={value}
                    leftSection={<Icon size={16} />}
                    style={{
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      padding: '17px 14px 14px',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--mantine-color-plum-6)' : textColor,
                      borderBottom: `3px solid ${isActive ? 'var(--mantine-color-plum-6)' : 'transparent'}`,
                    }}
                  >
                    {label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </ScrollArea>
        </Box>

        <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
          {showPeriodFilter && (
            <ReportPeriodFilter
              period={period}
              onChange={setPeriod}
              error={periodError}
            />
          )}

          <Tabs.Panel value="vendas">
            <SalesTab period={period} periodError={periodError} />
          </Tabs.Panel>
          <Tabs.Panel value="producao">
            <ProductionTab />
          </Tabs.Panel>
          <Tabs.Panel value="financeiro">
            <FinancialTab period={period} periodError={periodError} />
          </Tabs.Panel>
          <Tabs.Panel value="rankings">
            <RankingsTab period={period} periodError={periodError} />
          </Tabs.Panel>
        </Container>
      </Tabs>
    </Box>
  );
}
