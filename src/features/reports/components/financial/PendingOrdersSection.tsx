import { Badge, Group, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Check } from 'lucide-react';
import { textColor } from '@/theme/colors';
import type { FinancialReport } from '../../types/reports';
import { PendingOrderCard } from './PendingOrderCard';

interface PendingOrdersSectionProps {
  report?: FinancialReport;
  isLoading: boolean;
}

export function PendingOrdersSection({ report, isLoading }: PendingOrdersSectionProps) {
  const total = report?.pendingCompletedOrdersCount ?? 0;
  const shown = report?.pendingCompletedOrders.length ?? 0;

  return (
    <Stack gap="md">
      <div>
        <Group gap="xs">
          <Title order={2} fz={22} fw={800} c={textColor}>
            Concluídos com pagamento pendente
          </Title>
          {report && (
            <Badge variant="light" color="lilac" size="lg">
              {total}
            </Badge>
          )}
        </Group>
        <Text size="sm" c="dimmed" mt={2}>
          Já retiraram o pedido e ainda não pagaram tudo, do mais antigo para o mais
          recente.
        </Text>
      </div>

      {isLoading && (
        <Stack gap="md">
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
        </Stack>
      )}

      {report && total === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <ThemeIcon variant="light" color="accepted" radius="xl" size={48}>
            <Check size={24} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            Nenhum pedido concluído com pagamento pendente no período.
          </Text>
        </Stack>
      )}

      {report && total > 0 && (
        <>
          <Stack gap="md">
            {report.pendingCompletedOrders.map((order) => (
              <PendingOrderCard key={order.orderId} order={order} />
            ))}
          </Stack>

          {total > shown && (
            <Text size="sm" c="dimmed" ta="center">
              Exibindo {shown} de {total} pedidos.
            </Text>
          )}
        </>
      )}
    </Stack>
  );
}
