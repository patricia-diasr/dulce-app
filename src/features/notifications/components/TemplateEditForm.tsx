import { useState } from 'react';
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { textColor } from '@/theme/colors';
import {
  previewNotificationTemplate,
  updateNotificationTemplate,
} from '../api/notificationsApi';
import type { NotificationTemplate } from '../types/notificationTemplate';
import { findUnknownVariables } from '../utils/variableTransforms';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { SubjectEditor } from './SubjectEditor';
import { Fab } from '@/shared/components/Fab/Fab';

const SUBJECT_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 5000;

interface TemplateEditFormProps {
  template: NotificationTemplate;
}

export function TemplateEditForm({ template }: TemplateEditFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState(template.subject);
  const [content, setContent] = useState(template.content);
  const [previewOpened, setPreviewOpened] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => updateNotificationTemplate(template.id, { subject, content }),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Template atualizado!',
        message: 'As alterações foram salvas.',
      });
      queryClient.setQueryData(
        ['admin', 'notifications', 'templates', template.id],
        data,
      );
      queryClient.invalidateQueries({
        queryKey: ['admin', 'notifications', 'templates'],
        exact: true,
      });
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível salvar',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const previewMutation = useMutation({
    mutationFn: () => previewNotificationTemplate({ subject, content }),
    onSuccess: () => setPreviewOpened(true),
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível gerar a pré-visualização',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const unknownSubjectVariables = findUnknownVariables(subject);
  const unknownContentVariables = findUnknownVariables(content);

  const subjectEmpty = subject.trim().length === 0;
  const contentEmpty = content.trim().length === 0;
  const subjectTooLong = subject.length > SUBJECT_MAX_LENGTH;
  const contentTooLong = content.length > CONTENT_MAX_LENGTH;

  const subjectError = subjectEmpty
    ? 'Assunto é obrigatório.'
    : subjectTooLong
      ? 'Assunto excede o tamanho máximo.'
      : unknownSubjectVariables.length > 0
        ? `Variável desconhecida: {{${unknownSubjectVariables[0]}}}`
        : undefined;

  const isValid =
    !subjectError &&
    !contentEmpty &&
    !contentTooLong &&
    unknownContentVariables.length === 0;

  return (
    <>
      <Paper
        radius="md"
        shadow="md"
        p={{ base: 'md', sm: 'xl' }}
        style={{ backgroundColor: '#FEFEFE' }}
      >
        <Stack gap="xl">
          <div>
            <Title mt={2} order={2} fz={28} fw={700} c={textColor}>
              {template.description}
            </Title>
            <Text c={textColor} opacity={0.75} size="sm" mt={4}>
              Edite o assunto e o conteúdo deste e-mail. Use o botão de variáveis para
              inserir dados do pedido sem precisar digitar.
            </Text>
          </div>

          <Stack gap="sm">
            <SubjectEditor initialValue={template.subject} onChange={setSubject} />
            <Group justify="space-between">
              <Text size="xs" c={subjectError ? 'rejected' : 'dimmed'}>
                {subjectError ?? ' '}
              </Text>
              <Text size="xs" c={subjectTooLong ? 'rejected' : 'dimmed'}>
                {subject.length}/{SUBJECT_MAX_LENGTH}
              </Text>
            </Group>
          </Stack>

          <Stack gap="sm">
            <Text size="sm" fw={800}>
              Conteúdo
            </Text>
            <TemplateEditor initialContent={template.content} onChange={setContent} />
            <Group justify="space-between">
              <Text
                size="xs"
                c={
                  unknownContentVariables.length > 0 || contentEmpty
                    ? 'rejected'
                    : 'dimmed'
                }
              >
                {unknownContentVariables.length > 0
                  ? `Variável desconhecida: {{${unknownContentVariables[0]}}}`
                  : contentEmpty
                    ? 'Conteúdo é obrigatório.'
                    : ' '}
              </Text>
              <Text size="xs" c={contentTooLong ? 'rejected' : 'dimmed'}>
                {content.length}/{CONTENT_MAX_LENGTH}
              </Text>
            </Group>
          </Stack>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => navigate('/admin/notificacoes')}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              color="plum.6"
              onClick={() => updateMutation.mutate()}
              loading={updateMutation.isPending}
              disabled={!isValid}
            >
              Salvar alterações
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Fab
        onClick={() => previewMutation.mutate()}
        loading={previewMutation.isPending}
        disabled={!isValid}
        leftSection={<Eye size={18} />}
      >
        Pré-visualizar
      </Fab>

      <TemplatePreviewModal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        subject={previewMutation.data?.subject}
        renderedHtml={previewMutation.data?.renderedHtml}
      />
    </>
  );
}
