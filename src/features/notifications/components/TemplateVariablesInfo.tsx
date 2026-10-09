import { Divider, Paper, Stack, Text, Title } from '@mantine/core';
import { textColor } from '@/theme/colors';
import { TEMPLATE_VARIABLES } from '../constants/templateVariables';
import { VariableBadge } from './VariableBadge';

export function TemplateVariablesInfo() {
  const orderVariables = TEMPLATE_VARIABLES.filter(
    (variable) => variable.group === 'order',
  );
  const conditionalVariables = TEMPLATE_VARIABLES.filter(
    (variable) => variable.group === 'conditional',
  );

  return (
    <Paper p="lg" radius="md" shadow="sm" withBorder bg="#FEFEFE">
      <Stack gap="md">
        <div>
          <Title order={2} fz={18} fw={800} ff="Nunito Sans, sans-serif" c={textColor}>
            Variáveis disponíveis
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            No e-mail enviado, cada uma é trocada pelo dado real do pedido.
          </Text>
        </div>

        <Stack gap="sm">
          <Text size="sm" fw={800} c="plum.7">
            Dados do pedido
          </Text>
          {orderVariables.map((variable) => (
            <Stack key={variable.name} gap={4} align="flex-start">
              <VariableBadge name={variable.name} />
              <Text size="xs" c="dimmed">
                {variable.description}
              </Text>
            </Stack>
          ))}
        </Stack>

        <Divider color="caramel.2" />

        <Stack gap="sm">
          <Text size="sm" fw={800} c="plum.7">
            Avisos condicionais
          </Text>
          <Text size="xs" c="dimmed" fs="italic">
            Só aparecem no e-mail quando fizer sentido para o pedido.
          </Text>
          {conditionalVariables.map((variable) => (
            <Stack key={variable.name} gap={4} align="flex-start" mt={4}>
              <VariableBadge name={variable.name} />
              <Text size="xs" c="dimmed">
                {variable.description}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
