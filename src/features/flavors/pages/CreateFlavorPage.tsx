import { Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { createFlavor } from '../api/flavorsApi';
import { FlavorForm } from '../components/FlavorForm';
import { DEFAULT_FLAVOR_SIZES } from '../types';
import type { FlavorFormValues } from '../types/form';

export function CreateFlavorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createFlavor,
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Recheio cadastrado!',
        message: 'O novo recheio já está disponível no cardápio.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'flavors'] });
      navigate('/admin/recheios');
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível cadastrar',
        message: getApiErrorMessage(
          error,
          'Verifique os dados informados e tente novamente.',
        ),
      }),
  });

  const initialValues: FlavorFormValues = {
    name: '',
    defaultCakeBase: 'white',
    defaultTopping: 'white',
    prices: DEFAULT_FLAVOR_SIZES.map((size) => ({ ...size, costPrice: 0, salePrice: 0 })),
  };

  return (
    <Container size="md" py="xl">
      <FlavorForm
        initialValues={initialValues}
        onSubmit={(values) => createMutation.mutate(values)}
        onCancel={() => navigate('/admin/recheios')}
        title="Cadastrar recheio"
        description="Preencha os dados para adicionar um novo recheio ao cardápio."
        submitting={createMutation.isPending}
        submitLabel="Cadastrar"
      />
    </Container>
  );
}
