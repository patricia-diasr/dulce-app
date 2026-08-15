import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Container size="sm" py={100}>
      <Stack align="center" gap="xs">
        <Title order={1}>404</Title>
        <Text c="dimmed">Página não encontrada.</Text>
        <Button component={Link} to="/" mt="md">
          Voltar para o início
        </Button>
      </Stack>
    </Container>
  );
}
