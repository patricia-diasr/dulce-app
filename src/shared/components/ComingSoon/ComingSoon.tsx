import { Container, Stack, Text, Title } from '@mantine/core';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Container size="sm" py={80}>
      <Stack align="center" gap="xs">
        <Title order={2}>{title}</Title>
        <Text c="dimmed" ta="center">
          {description ?? 'Esta tela ainda será implementada.'}
        </Text>
      </Stack>
    </Container>
  );
}
