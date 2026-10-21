import { Box, Container, SimpleGrid, Skeleton, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { listNotificationTemplates } from '../api/notificationsApi';
import { NotificationTemplateCard } from '../components/NotificationTemplateCard';
import { sortTemplatesByLifecycle } from '../utils/sortTemplates';

export function NotificationSettingsPage() {
  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'notifications', 'templates'],
    queryFn: listNotificationTemplates,
  });

  const sortedTemplates = templates ? sortTemplatesByLifecycle(templates) : [];

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
        {isLoading && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <Skeleton height={140} radius="md" />
            <Skeleton height={140} radius="md" />
            <Skeleton height={140} radius="md" />
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
              Não foi possível carregar os templates de notificação. Tente novamente em
              instantes.
            </Text>
          </Box>
        )}

        {!isLoading && !isError && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {sortedTemplates.map((template) => (
              <NotificationTemplateCard key={template.id} template={template} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
