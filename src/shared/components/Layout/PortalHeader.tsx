import { ActionIcon, Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import { LogOut, Menu } from 'lucide-react';
import { Wordmark } from '@/shared/components/Brand/Wordmark';
import { creamBackground } from '@/theme/colors';
import { MAX_HEADER_WIDTH } from '@/theme/layout';

interface PortalHeaderProps {
  userName: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

const menuIconStyle = {
  width: 'clamp(20px, 2.4vw, 28px)',
  height: 'clamp(20px, 2.4vw, 28px)',
};

const logoutIconStyle = {
  width: 'clamp(16px, 2vw, 22px)',
  height: 'clamp(16px, 2vw, 22px)',
};

const labelFz = 'clamp(0.8rem, 1.4vw, 1rem)';

export function PortalHeader({
  userName,
  showMenuButton = false,
  onMenuClick,
  onLogout,
}: PortalHeaderProps) {
  const initial = userName.trim().charAt(0).toUpperCase();

  return (
    <div style={{ backgroundColor: 'var(--mantine-color-plum-8)', height: '100%' }}>
      <Group
        h="100%"
        px="md"
        justify="space-between"
        wrap="nowrap"
        maw={MAX_HEADER_WIDTH}
        mx="auto"
      >
        <Group gap="clamp(8px, 1.6vw, 20px)" wrap="nowrap" align="center">
          {showMenuButton && (
            <ActionIcon
              variant="subtle"
              size="clamp(32px, 4vw, 44px)"
              onClick={onMenuClick}
              aria-label="Abrir menu"
              vars={() => ({
                root: { '--ai-hover': 'rgba(251, 247, 244, 0.16)' },
              })}
            >
              <Menu style={menuIconStyle} color={creamBackground} />
            </ActionIcon>
          )}
          <Wordmark c={creamBackground} fz="clamp(1.15rem, 2.4vw, 1.75rem)" lh={1} />
        </Group>

        <Group gap="clamp(8px, 1.6vw, 20px)" wrap="nowrap" align="center">
          <Group gap="xs" wrap="nowrap" align="center">
            <Avatar
              color={creamBackground}
              variant="filled"
              autoContrast
              radius="xl"
              size="clamp(28px, 3.2vw, 38px)"
              styles={{
                placeholder: {
                  fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                },
              }}
            >
              {initial}
            </Avatar>
            <Text c={creamBackground} fw={600} fz={labelFz} lh={1}>
              {userName}
            </Text>
          </Group>
          <div
            style={{
              width: 1.5,
              height: 22,
              backgroundColor: creamBackground,
              flexShrink: 0,
            }}
          />
          <UnstyledButton
            onClick={onLogout}
            className="dulce-chrome-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 'var(--mantine-radius-sm)',
            }}
          >
            <LogOut style={logoutIconStyle} color={creamBackground} />
            <Text c={creamBackground} fw={600} fz={labelFz} lh={1}>
              Logout
            </Text>
          </UnstyledButton>{' '}
        </Group>
      </Group>
    </div>
  );
}
