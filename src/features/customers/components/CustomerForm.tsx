import {
  Button,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { PhoneInput } from '@/shared/components/PhoneInput/PhoneInput';
import { textColor } from '@/theme/colors';
import { customerFormSchema, type CustomerFormValues } from '../types/form';

interface CustomerFormProps {
  initialValues: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  title: string;
  description: string;
  submitting?: boolean;
  submitLabel?: string;
}

export function CustomerForm({
  initialValues,
  onSubmit,
  onCancel,
  title,
  description,
  submitting,
  submitLabel = 'Salvar',
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    initialValues,
    validate: schemaResolver(customerFormSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Paper
        radius="md"
        shadow="md"
        p={{ base: 'md', sm: 'xl' }}
        mx="auto"
        maw={680}
        w="100%"
        style={{ backgroundColor: '#FEFEFE' }}
      >
        <Stack gap="xl">
          <div>
            <Title mt={2} order={2} fz={28} fw={700} c={textColor}>
              {title}
            </Title>
            <Text c={textColor} opacity={0.75} size="sm" mt={4}>
              {description}
            </Text>
          </div>

          <Stack gap="lg">
            <TextInput
              label="Nome do cliente"
              placeholder="Ex.: Maria Silva"
              maxLength={150}
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <PhoneInput
              label="Telefone"
              placeholder="(99) 99999-9999"
              key={form.key('phone')}
              {...form.getInputProps('phone')}
            />

            <TextInput
              label="E-mail (opcional)"
              placeholder="email@email.com"
              maxLength={255}
              key={form.key('email')}
              {...form.getInputProps('email')}
            />

            <Textarea
              label="Observações (opcional)"
              placeholder="Ex.: Prefere retirar de manhã"
              maxLength={500}
              minRows={3}
              autosize
              key={form.key('notes')}
              {...form.getInputProps('notes')}
            />
          </Stack>

          <SimpleGrid cols={2} spacing="sm" mt="xs">
            <Button variant="subtle" fullWidth onClick={onCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              fullWidth
              color="plum.6"
              loading={submitting}
              radius="sm"
            >
              {submitLabel}
            </Button>
          </SimpleGrid>
        </Stack>
      </Paper>
    </form>
  );
}
