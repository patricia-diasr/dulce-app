import type { CSSProperties } from 'react';
import { Badge } from '@mantine/core';
import { getVariableLabel } from '../constants/templateVariables';

interface VariableBadgeProps {
  name: string;
  style?: CSSProperties;
}

export function VariableBadge({ name, style }: VariableBadgeProps) {
  return (
    <Badge color="plum" variant="light" radius="sm" style={style}>
      {getVariableLabel(name)}
    </Badge>
  );
}
