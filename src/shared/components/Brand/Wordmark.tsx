import { Text, type TextProps } from '@mantine/core';
import { Link } from 'react-router-dom';

interface WordmarkProps extends TextProps {
  homePath: string;
}

export function Wordmark({ homePath, ...props }: WordmarkProps) {
  return (
    <Text
      component={Link}
      to={homePath}
      aria-label="Dulce — página inicial"
      ff="Fraunces, serif"
      fw={600}
      fs="italic"
      size="xl"
      c="plum.6"
      {...props}
    >
      Dulce
    </Text>
  );
}
