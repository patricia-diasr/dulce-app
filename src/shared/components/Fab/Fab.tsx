import { Button, type ButtonProps } from '@mantine/core';
import type { MouseEventHandler, ReactNode } from 'react';
import { MAX_HEADER_WIDTH } from '@/theme/layout';

interface FabProps extends ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any;
  to?: string;
  onClick?: MouseEventHandler;
  children?: ReactNode;
}

export function Fab(props: FabProps) {
  return (
    <Button
      radius="xl"
      size="md"
      color="plum.6"
      {...props}
      style={{
        position: 'fixed',
        bottom: 32,
        right: `max(32px, calc((100vw - ${MAX_HEADER_WIDTH}px) / 2 + 32px))`,
        zIndex: 190,
        boxShadow: 'var(--mantine-shadow-lg)',
        ...props.style,
      }}
    />
  );
}
