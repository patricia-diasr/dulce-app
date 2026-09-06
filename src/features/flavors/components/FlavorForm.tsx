import {
  Button,
  Divider,
  NumberInput,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { CAKE_BASE_LABEL, type CakeBase } from '@/shared/utils/cakeBase';
import { textColor } from '@/theme/colors';
import { flavorFormSchema, type FlavorFormValues } from '../types/form';

const CAKE_BASE_OPTIONS: { value: CakeBase; label: string }[] = [
  { value: 'white', label: CAKE_BASE_LABEL.white },
  { value: 'dark', label: CAKE_BASE_LABEL.dark },
];

interface FlavorFormProps {
  initialValues: FlavorFormValues;
  onSubmit: (values: FlavorFormValues) => void;
  onCancel: () => void;
  title: string;
  description: string;
  submitting?: boolean;
  submitLabel?: string;
}

export function FlavorForm({
  initialValues,
  onSubmit,
  onCancel,
  title,
  description,
  submitting,
  submitLabel = 'Salvar',
}: FlavorFormProps) {
  const form = useForm<FlavorFormValues>({
    initialValues,
    validate: schemaResolver(flavorFormSchema),
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
              label="Nome do recheio"
              placeholder="Ex.: Ninho"
              maxLength={100}
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <div>
              <Text size="sm" fw={800} mb={6}>
                Massa padrão
              </Text>
              <SegmentedControl
                fullWidth
                color="plum.6"
                data={CAKE_BASE_OPTIONS}
                key={form.key('defaultCakeBase')}
                {...form.getInputProps('defaultCakeBase')}
              />
            </div>

            <div>
              <Text size="sm" fw={800} mb={6}>
                Raspa padrão
              </Text>
              <SegmentedControl
                fullWidth
                color="plum.6"
                data={CAKE_BASE_OPTIONS}
                key={form.key('defaultTopping')}
                {...form.getInputProps('defaultTopping')}
              />
            </div>
          </Stack>

          <Divider color="caramel.2" />

          <Stack gap="lg">
            <Text fw={800}>Preços por tamanho</Text>

            {form.values.prices.map((price, index) => (
              <Stack key={price.sizeId}>
                <Text fw={800} c="plum.6">
                  Bolo {price.sizeName}
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <NumberInput
                    label="Custo"
                    hideControls
                    decimalScale={2}
                    fixedDecimalScale
                    min={0}
                    step={0.5}
                    prefix="R$ "
                    key={form.key(`prices.${index}.costPrice`)}
                    {...form.getInputProps(`prices.${index}.costPrice`)}
                  />
                  <NumberInput
                    label="Preço de venda"
                    hideControls
                    decimalScale={2}
                    fixedDecimalScale
                    min={0}
                    step={0.5}
                    prefix="R$ "
                    key={form.key(`prices.${index}.salePrice`)}
                    {...form.getInputProps(`prices.${index}.salePrice`)}
                  />
                </SimpleGrid>
                {index < form.values.prices.length - 1 && (
                  <Divider color="caramel.2" my="md" />
                )}
              </Stack>
            ))}
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
