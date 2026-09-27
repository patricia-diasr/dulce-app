import { Avatar } from '@mantine/core';

interface CustomerAvatarProps {
  name: string;
  size?: number;
}

export function CustomerAvatar({ name, size = 40 }: CustomerAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <Avatar
      radius="xl"
      size={size}
      variant="light"
      color="lilac"
      style={{ color: 'var(--mantine-color-plum-6)', fontWeight: 800, flexShrink: 0 }}
    >
      {initial}
    </Avatar>
  );
}
