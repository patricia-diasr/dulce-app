import { Box, Container, SimpleGrid, Skeleton, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fab } from '@/shared/components/Fab/Fab';
import { deleteFlavor, listFlavors } from '../api/flavorsApi';
import { FlavorCard } from '../components/FlavorCard';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import type { Flavor } from '../types';
import { useState } from 'react';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal/ConfirmDeleteModal';

export function FlavorsListPage() {
  const queryClient = useQueryClient();
  const [flavorToDelete, setFlavorToDelete] = useState<Flavor | null>(null);

  const {
    data: flavors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'flavors'],
    queryFn: listFlavors,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFlavor(id),
    onSuccess: () => {
      notifications.show({
        color: 'accepted.7',
        title: 'Recheio excluído',
        message: `${flavorToDelete?.name} foi removido do cardápio.`,
      });
      setFlavorToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'flavors'] });
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível excluir',
        message: getApiErrorMessage(error, 'Tente novamente em instantes.'),
      }),
  });

  const showEmptyState = !isLoading && !isError && flavors?.length === 0;

  return (
    <Box
      style={{
        minHeight: '100%',
        position: 'relative',
      }}
    >
      <Container size={MAX_CONTENT_WIDTH}>
        {isLoading && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <Skeleton height={190} radius="md" />
            <Skeleton height={190} radius="md" />
            <Skeleton height={190} radius="md" />
          </SimpleGrid>
        )}

        {isError && (
          <Box
            style={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="rejected">
              Não foi possível carregar os recheios. Tente novamente em instantes.
            </Text>
          </Box>
        )}

        {showEmptyState && (
          <Box
            style={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="dimmed">Nenhum recheio ativo cadastrado.</Text>
          </Box>
        )}

        {flavors && flavors.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {flavors.map((flavor) => (
              <FlavorCard key={flavor.id} flavor={flavor} onDelete={setFlavorToDelete} />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <Fab component={Link} to="/admin/recheios/novo" leftSection={<Plus size={18} />}>
        Novo recheio
      </Fab>

      <ConfirmDeleteModal
        opened={flavorToDelete !== null}
        onClose={() => setFlavorToDelete(null)}
        onConfirm={() => flavorToDelete && deleteMutation.mutate(flavorToDelete.id)}
        title="Excluir recheio"
        itemName={flavorToDelete?.name}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
