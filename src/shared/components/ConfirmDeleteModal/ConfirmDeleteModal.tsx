import { Button, Group, Modal, Stack, Text, ThemeIcon } from '@mantine/core';
import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: ReactNode;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  title,
  itemName,
  loading,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="rejected" size={36} radius="xl">
            <TriangleAlert size={20} />
          </ThemeIcon>

          <Text fw={700} size="lg">
            {title}
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="md"
      padding="lg"
    >
      <Stack gap="md">
        <Text size="md">
          Tem certeza que deseja excluir{' '}
          <Text component="span" fw={700}>
            {itemName ?? 'este item'}
          </Text>
          ?
          <br />
          Essa ação não pode ser desfeita.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button color="rejected.7" onClick={onConfirm} loading={loading}>
            Excluir
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
