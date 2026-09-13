import type { ReactNode } from 'react';
import { Button, Group, Modal, Stack, Text, ThemeIcon } from '@mantine/core';
import { TriangleAlert, type LucideIcon } from 'lucide-react';

interface ConfirmActionModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmColor?: string;
  icon?: LucideIcon;
  loading?: boolean;
}

export function ConfirmActionModal({
  opened,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmColor = 'plum',
  icon: Icon = TriangleAlert,
  loading,
}: ConfirmActionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color={confirmColor} size={36} radius="xl">
            <Icon size={20} />
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
        <Text size="md">{description}</Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Voltar
          </Button>
          <Button color={confirmColor} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
