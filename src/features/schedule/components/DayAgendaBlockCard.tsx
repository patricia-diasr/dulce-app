import { useState } from 'react';
import { ActionIcon, Card, Group, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { deleteScheduleBlock } from '../api/scheduleApi';
import {
  formatBlockDescription,
  formatBlockRuleLabel,
  type BlockOccurrence,
} from '../utils/blockOccurrences';
import { invalidateScheduleQueries } from '../utils/invalidateScheduleQueries';

interface DayAgendaBlockCardProps {
  occurrence: BlockOccurrence;
}

export function DayAgendaBlockCard({ occurrence }: DayAgendaBlockCardProps) {
  const { block, startTime, endTime } = occurrence;
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteScheduleBlock(block.id),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Bloqueio excluído',
        message: 'O bloqueio foi removido.',
      });
      invalidateScheduleQueries(queryClient);
      setConfirming(false);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível excluir',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  return (
    <Card
      padding="md"
      style={{
        backgroundColor: 'var(--mantine-color-cocoa-1)',
        border: '1px solid var(--mantine-color-cocoa-3)',
      }}
    >
      <Group align="center" wrap="nowrap" gap="sm">
        <Text fw={900} c="cocoa.7" style={{ width: 44, flexShrink: 0 }}>
          {startTime}
        </Text>
        <ThemeIcon
          variant="light"
          color="cocoa"
          radius="md"
          size={36}
          style={{ flexShrink: 0 }}
        >
          <Lock size={16} />
        </ThemeIcon>
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} size="sm">
            {formatBlockRuleLabel(block)}
          </Text>
          <Text size="xs" c="dimmed">
            {startTime} – {endTime}
          </Text>
        </Stack>
        <Group gap={4} style={{ flexShrink: 0 }}>
          <Tooltip label="Editar bloqueio" withArrow>
            <ActionIcon
              variant="subtle"
              color="plum"
              component={Link}
              to={`/admin/calendario/bloqueios/${block.id}`}
              aria-label="Editar bloqueio"
            >
              <Pencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Excluir bloqueio" withArrow>
            <ActionIcon
              variant="subtle"
              color="rejected"
              onClick={() => setConfirming(true)}
              aria-label="Excluir bloqueio"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <ConfirmDeleteModal
        opened={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Excluir bloqueio"
        itemName={formatBlockDescription(block)}
        loading={deleteMutation.isPending}
      />
    </Card>
  );
}
