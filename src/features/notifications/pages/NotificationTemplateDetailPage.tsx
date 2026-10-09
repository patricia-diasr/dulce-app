import { Container, Grid, Skeleton, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { getNotificationTemplate } from '../api/notificationsApi';
import { TemplateEditForm } from '../components/TemplateEditForm';
import { TemplateVariablesInfo } from '../components/TemplateVariablesInfo';

export function NotificationTemplateDetailPage() {
  const { typeId } = useParams<{ typeId: string }>();

  const templateIdNumber = Number(typeId);
  const hasValidId = Number.isInteger(templateIdNumber) && templateIdNumber > 0;

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'notifications', 'templates', templateIdNumber],
    queryFn: () => getNotificationTemplate(templateIdNumber),
    enabled: hasValidId,
  });

  if (isLoading) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Grid columns={10} gap="xl">
          <Grid.Col span={{ base: 10, lg: 7 }}>
            <Skeleton height={500} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 10, lg: 3 }}>
            <Skeleton height={300} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError || !template) {
    return (
      <Container size={MAX_CONTENT_WIDTH} py="xl">
        <Text c="rejected">Template não encontrado.</Text>
      </Container>
    );
  }

  return (
    <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }} pb={96}>
      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 7 }}>
          <TemplateEditForm template={template} />
        </Grid.Col>

        <Grid.Col span={{ base: 10, lg: 3 }}>
          <TemplateVariablesInfo />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
