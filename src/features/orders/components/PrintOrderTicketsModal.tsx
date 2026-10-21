import { Button, Group, Modal, Stack, Text, ThemeIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Printer } from 'lucide-react';
import { getOrderTicketsPdf, getOrderTicketsSummary } from '../api/ordersApi';

interface PrintOrderTicketsModalProps {
  opened: boolean;
  onClose: () => void;
  from: string | null;
  to: string | null;
}

export function PrintOrderTicketsModal({
  opened,
  onClose,
  from,
  to,
}: PrintOrderTicketsModalProps) {
  const summaryQuery = useQuery({
    queryKey: ['admin', 'orders', 'tickets', 'summary', from, to],
    queryFn: () => getOrderTicketsSummary(from!, to!),
    enabled: opened && Boolean(from && to),
    staleTime: 0,
  });
  const printMutation = useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) =>
      getOrderTicketsPdf(from, to),
  });

  const handlePrint = async () => {
    if (!from || !to) return;

    // Open synchronously from the user gesture so browsers don't block the PDF tab.
    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) {
      notifications.show({
        color: 'rejected',
        message: 'Permita pop-ups para abrir o PDF dos tickets.',
      });
      return;
    }

    try {
      const pdf = await printMutation.mutateAsync({ from, to });
      const url = URL.createObjectURL(pdf);
      pdfWindow.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      onClose();
    } catch {
      pdfWindow.close();
      notifications.show({
        color: 'rejected',
        message: 'Não foi possível gerar o PDF. Tente novamente em instantes.',
      });
    }
  };

  const summary = summaryQuery.data;
  const canPrint = Boolean(
    summary && summary.ticketsCount > 0 && summary.ticketsCount <= summary.maxTickets,
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="plum" size={36} radius="xl">
            <Printer size={20} />
          </ThemeIcon>
          <Text fw={700} size="lg">
            Imprimir tickets
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="md"
      padding="lg"
    >
      <Stack gap="md">
        <Text size="md">
          Período de retirada: {from ? dayjs(from).format('DD/MM/YYYY') : '—'} a{' '}
          {to ? dayjs(to).format('DD/MM/YYYY') : '—'}.
        </Text>
        <Text size="sm" c="dimmed">
          Serão incluídos pedidos aceitos e concluídos. Cada bolo gera um ticket.
        </Text>

        {summaryQuery.isLoading && <Text size="sm">Consultando pedidos do período…</Text>}
        {summaryQuery.isError && (
          <Text size="sm" c="rejected">
            Não foi possível consultar o período. Feche e tente novamente.
          </Text>
        )}
        {summary && (
          <Text fw={600}>
            {summary.ordersCount} {summary.ordersCount === 1 ? 'pedido' : 'pedidos'} ·{' '}
            {summary.ticketsCount} {summary.ticketsCount === 1 ? 'ticket' : 'tickets'}
          </Text>
        )}
        {summary && summary.ticketsCount > summary.maxTickets && (
          <Text size="sm" c="rejected">
            O limite é de {summary.maxTickets} tickets. Reduza o período para continuar.
          </Text>
        )}
        {summary && summary.ticketsCount === 0 && (
          <Text size="sm" c="dimmed">
            Nenhum pedido aceito ou concluído neste período.
          </Text>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose} disabled={printMutation.isPending}>
            Voltar
          </Button>
          <Button
            color="plum.6"
            onClick={handlePrint}
            loading={printMutation.isPending}
            disabled={!canPrint || summaryQuery.isFetching}
          >
            Gerar PDF
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
