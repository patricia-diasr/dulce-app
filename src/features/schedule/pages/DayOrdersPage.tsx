import { Box, Container } from '@mantine/core';
import { Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Fab } from '@/shared/components/Fab/Fab';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { DayAgenda } from '../components/DayAgenda';

export function DayOrdersPage() {
  const { date } = useParams<{ date: string }>();

  if (!date) return null;

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Container size={MAX_CONTENT_WIDTH} py={{ base: 'sm', sm: 'md' }}>
        <DayAgenda date={date} />
      </Container>

      <Fab
        component={Link}
        to={`/admin/calendario/bloqueios/novo?date=${date}`}
        leftSection={<Plus size={18} />}
      >
        Novo bloqueio
      </Fab>
    </Box>
  );
}
