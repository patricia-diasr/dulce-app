import { Container, Skeleton, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { listScheduleBlocks, updateScheduleBlock } from '../api/scheduleApi';
import { ScheduleBlockForm } from '../components/ScheduleBlockForm';
import { fromBlock, toPayload } from '../utils/scheduleBlockPayload';
import type { ScheduleBlockFormValues } from '../types/form';
import { invalidateScheduleQueries } from '../utils/invalidateScheduleQueries';

export function EditBlockPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const blockIdNumber = Number(blockId);
  const hasValidBlockId = Number.isInteger(blockIdNumber) && blockIdNumber > 0;

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['admin', 'schedule', 'blocks'],
    queryFn: () => listScheduleBlocks(),
    enabled: hasValidBlockId,
  });

  const block = blocks?.find((b) => b.id === blockIdNumber);

  const updateMutation = useMutation({
    mutationFn: (values: ScheduleBlockFormValues) =>
      updateScheduleBlock(blockIdNumber, toPayload(values)),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Bloqueio atualizado!',
        message: 'As alterações foram salvas.',
      });
      invalidateScheduleQueries(queryClient);
      navigate('/admin/calendario');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível salvar',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Skeleton height={420} radius="md" />
      </Container>
    );
  }

  if (!block) {
    return (
      <Container size="md" py="xl">
        <Text c="rejected">Bloqueio não encontrado.</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <ScheduleBlockForm
        initialValues={fromBlock(block)}
        onSubmit={(values) => updateMutation.mutate(values)}
        onCancel={() => navigate('/admin/calendario')}
        title="Editar bloqueio"
        description="Atualize quando a confeitaria não estará disponível para retiradas."
        submitting={updateMutation.isPending}
        submitLabel="Salvar alterações"
      />
    </Container>
  );
}
