import { Badge } from '@mantine/core';
import { CAKE_BASE_COLOR, CAKE_BASE_LABEL, type CakeBase } from '@/shared/utils/cakeBase';

interface CakeBaseBadgeProps {
  prefix: string;
  value: string;
}

export function CakeBaseBadge({ prefix, value }: CakeBaseBadgeProps) {
  const base = value as CakeBase;
  const label = CAKE_BASE_LABEL[base] ?? value;
  const color = CAKE_BASE_COLOR[base] ?? 'cocoa';

  return (
    <Badge variant="filled" color={color} radius="sm" size="md" tt="">
      {prefix} {label}
    </Badge>
  );
}
