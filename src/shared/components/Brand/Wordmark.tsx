import { Text, type TextProps } from '@mantine/core';

export function Wordmark(props: TextProps) {
  return (
    <Text
      component="span"
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
