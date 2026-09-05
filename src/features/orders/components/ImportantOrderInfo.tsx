import { Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CalendarClock, CircleHelp, ShieldCheck } from 'lucide-react';
import { textColor } from '@/theme/colors';

const INFO_ITEMS = [
  {
    icon: CalendarClock,
    text: 'O prazo mínimo para pedidos pelo portal é de 72 horas antes da retirada.',
  },
  {
    icon: ShieldCheck,
    text: 'Verificaremos a disponibilidade da data no próximo passo.',
  },
  {
    icon: CircleHelp,
    text: 'Em caso de dúvidas ou pedidos com prazo menor, entre em contato diretamente.',
  },
];

export function ImportantOrderInfo() {
  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder bg="#FEFEFE">
      <Stack gap="md">
        <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
          Informações importantes
        </Title>
        <Stack gap="md">
          {INFO_ITEMS.map(({ icon: Icon, text }) => (
            <Group key={text} align="flex-start" gap="sm" wrap="nowrap">
              <ThemeIcon radius="xl" size={34} color="plum.1" c="plum.7">
                <Icon size={19} />
              </ThemeIcon>
              <Text size="sm" lh={1.5}>
                {text}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
