import { Container, Skeleton, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { listFlavor, updateFlavor } from '../api/flavorsApi';
import { FlavorForm } from '../components/FlavorForm';
import type { FlavorFormValues } from '../types/form';

export function EditFlavorPage() {
  const { flavorId } = useParams<{ flavorId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const flavorIdNumber = Number(flavorId);
  const hasValidFlavorId = Number.isInteger(flavorIdNumber) && flavorIdNumber > 0;

  const { data: flavor, isLoading } = useQuery({
    queryKey: ['admin', 'flavors', flavorIdNumber],
    queryFn: () => listFlavor(flavorIdNumber),
    enabled: hasValidFlavorId,
  });

  const updateMutation = useMutation({
    mutationFn: (values: FlavorFormValues) => updateFlavor(flavorIdNumber, values),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Recheio atualizado!',
        message: 'As alterações foram salvas.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'flavors'] });
      navigate('/admin/recheios');
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

  if (!flavor) {
    return (
      <Container size="md" py="xl">
        <Text c="rejected">Recheio não encontrado.</Text>
      </Container>
    );
  }

  const initialValues: FlavorFormValues = {
    name: flavor.name,
    defaultCakeBase: flavor.defaultCakeBase === 'dark' ? 'dark' : 'white',
    defaultTopping: flavor.defaultTopping === 'dark' ? 'dark' : 'white',
    prices: flavor.prices.map(({ sizeId, sizeName, costPrice, salePrice }) => ({
      sizeId,
      sizeName,
      costPrice,
      salePrice,
    })),
  };

  return (
    <Container size="md" py="xl">
      <FlavorForm
        initialValues={initialValues}
        onSubmit={(values) => updateMutation.mutate(values)}
        onCancel={() => navigate('/admin/recheios')}
        title="Editar recheio"
        description="Atualize os dados e os valores deste recheio."
        submitting={updateMutation.isPending}
        submitLabel="Salvar alterações"
      />
    </Container>
  );
}
