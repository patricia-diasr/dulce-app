import { Box, Modal, Text } from '@mantine/core';
import { textColor } from '@/theme/colors';

interface TemplatePreviewModalProps {
  opened: boolean;
  onClose: () => void;
  subject?: string;
  renderedHtml?: string;
}

export function TemplatePreviewModal({
  opened,
  onClose,
  subject,
  renderedHtml,
}: TemplatePreviewModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Pré-visualização" size="lg" centered>
      {subject && (
        <Text size="sm" fw={700} c={textColor} mb="md">
          Assunto: {subject}
        </Text>
      )}
      {renderedHtml && (
        <Box
          style={{
            border: '1px solid var(--mantine-color-caramel-2)',
            borderRadius: 'var(--mantine-radius-md)',
            overflow: 'hidden',
          }}
        >
          <iframe
            srcDoc={renderedHtml}
            title="Pré-visualização do e-mail"
            style={{ width: '100%', height: '70vh', border: 'none' }}
            sandbox=""
          />
        </Box>
      )}
    </Modal>
  );
}
