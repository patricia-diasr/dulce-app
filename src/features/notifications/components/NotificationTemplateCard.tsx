import { useState } from 'react';
import { Card, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NotificationTemplate } from '../types/notificationTemplate';

interface NotificationTemplateCardProps {
  template: NotificationTemplate;
}

export function NotificationTemplateCard({ template }: NotificationTemplateCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 399px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 349px)');

  return (
    <Card
      padding="lg"
      onClick={() => navigate(`/admin/notificacoes/${template.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.10)' : undefined,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isVerySmallScreen
            ? '1fr'
            : isSmallScreen
              ? '48px minmax(0, 1fr)'
              : '60px minmax(0, 1fr)',
          gap: isSmallScreen ? '8px' : '12px',
          alignItems: 'start',
        }}
      >
        {!isVerySmallScreen && (
          <ThemeIcon
            variant="light"
            color="lilac"
            radius="md"
            size={isSmallScreen ? 48 : 60}
            style={{ color: 'var(--mantine-color-plum-6)' }}
          >
            <Mail size={isSmallScreen ? 22 : 28} />
          </ThemeIcon>
        )}

        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text fw={900} size="xl" style={{ overflowWrap: 'break-word' }}>
            {template.description}
          </Text>
          <Text size="sm" c="dimmed" style={{ overflowWrap: 'break-word' }}>
            {template.subject}
          </Text>
        </Stack>
      </div>
    </Card>
  );
}
