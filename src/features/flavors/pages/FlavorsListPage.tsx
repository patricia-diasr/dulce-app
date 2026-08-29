import { Box, Container, SimpleGrid, Skeleton, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fab } from '@/shared/components/Fab/Fab';
import { listFlavors } from '../api/flavorsApi';
import { FlavorCard } from '../components/FlavorCard';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';

export function FlavorsListPage() {
  const {
    data: flavors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'flavors'],
    queryFn: listFlavors,
  });

  const activeFlavors = flavors?.filter((flavor) => flavor.active);

  const showEmptyState = !isLoading && !isError && activeFlavors?.length === 0;

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

        {activeFlavors && activeFlavors.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {activeFlavors.map((flavor) => (
              <FlavorCard key={flavor.id} flavor={flavor} />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <Fab component={Link} to="/admin/recheios/novo" leftSection={<Plus size={18} />}>
        Novo recheio
      </Fab>
    </Box>
  );
}
