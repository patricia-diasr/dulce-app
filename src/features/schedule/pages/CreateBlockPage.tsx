import { Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { createScheduleBlock } from '../api/scheduleApi';
import { ScheduleBlockForm } from '../components/ScheduleBlockForm';
import { toPayload } from '../utils/scheduleBlockPayload';
import type { ScheduleBlockFormValues } from '../types/form';
import { invalidateScheduleQueries } from '../utils/invalidateScheduleQueries';

export function CreateBlockPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') ?? undefined;

  const createMutation = useMutation({
    mutationFn: (values: ScheduleBlockFormValues) =>
      createScheduleBlock(toPayload(values)),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Bloqueio criado!',
        message: 'A agenda já reflete o novo bloqueio.',
      });
      invalidateScheduleQueries(queryClient);
      navigate('/admin/calendario');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível criar',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  const initialValues: ScheduleBlockFormValues = {
    type: 'EVENTUAL',
    blockDate: dateParam,
    recurrence: undefined,
    weekday: undefined,
    monthDay: undefined,
    startTime: '',
    endTime: '',
    validFrom: undefined,
    validUntil: undefined,
  };

  return (
    <Container size="md" py="xl">
      <ScheduleBlockForm
        initialValues={initialValues}
        onSubmit={(values) => createMutation.mutate(values)}
        onCancel={() => navigate('/admin/calendario')}
        title="Novo bloqueio"
        description="Defina quando a confeitaria não estará disponível para retiradas."
        submitting={createMutation.isPending}
        submitLabel="Criar bloqueio"
      />
    </Container>
  );
}
