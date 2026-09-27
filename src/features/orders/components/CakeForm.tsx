import {
  Button,
  Paper,
  Select,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import type { Flavor } from '@/features/flavors/types';
import { CAKE_BASE_LABEL, type CakeBase } from '@/shared/utils/cakeBase';
import { textColor } from '@/theme/colors';
import { CAKE_SIZES, type CakeFormValues } from '../types/cake';

const CAKE_BASE_VALUES: CakeBase[] = ['white', 'dark'];

interface CakeFormProps {
  values: CakeFormValues;
  flavors: Flavor[];
  loadingFlavors?: boolean;
  onChange: (values: CakeFormValues) => void;
  onCancel: () => void;
  onAddToCart: () => void;
  submitLabel?: string;
}

export function CakeForm({
  values,
  flavors,
  loadingFlavors,
  onChange,
  onCancel,
  onAddToCart,
  submitLabel = 'Adicionar ao carrinho',
}: CakeFormProps) {
  const selectedSize =
    CAKE_SIZES.find((size) => size.value === values.sizeId) ?? CAKE_SIZES[0];
  const selectedFlavor = flavors.find((flavor) => String(flavor.id) === values.flavorId);
  const cakeBaseOptions: { value: CakeBase; label: string }[] = CAKE_BASE_VALUES.map(
    (value) => ({
      value,
      label: `${CAKE_BASE_LABEL[value]}${selectedFlavor?.defaultCakeBase === value ? ' (padrão)' : ''}`,
    }),
  );
  const toppingOptions: { value: CakeBase; label: string }[] = CAKE_BASE_VALUES.map(
    (value) => ({
      value,
      label: `${CAKE_BASE_LABEL[value]}${selectedFlavor?.defaultTopping === value ? ' (padrão)' : ''}`,
    }),
  );

  const update = (field: keyof CakeFormValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <Paper p={{ base: 'md', sm: 'xl' }} radius="md" shadow="md" withBorder bg="#FEFEFE">
      <Stack gap="xl">
        <div>
          <Title mt={2} order={2} fz={28} fw={700} c={textColor}>
            Formulário do bolo
          </Title>
          <Text c={textColor} opacity={0.75} size="sm" mt={4}>
            Escolha os detalhes do bolo que deseja adicionar ao pedido.
          </Text>
        </div>

        <Stack gap="lg">
          <Select
            label="Tamanho"
            data={CAKE_SIZES.map(({ value, label }) => ({ value, label }))}
            value={values.sizeId}
            onChange={(value) => update('sizeId', value ?? CAKE_SIZES[0].value)}
            allowDeselect={false}
          />

          <Select
            label="Recheio"
            placeholder={
              loadingFlavors ? 'Carregando recheios...' : 'Selecione o recheio'
            }
            data={flavors.map((flavor) => ({
              value: String(flavor.id),
              label: flavor.name,
            }))}
            value={values.flavorId || null}
            onChange={(value) => update('flavorId', value ?? '')}
            disabled={loadingFlavors}
            searchable
            nothingFoundMessage="Nenhum recheio disponível"
          />

          <div>
            <Text size="sm" fw={800} mb={6} c={textColor}>
              Massa
            </Text>
            <SegmentedControl
              fullWidth
              color="plum.6"
              data={cakeBaseOptions}
              value={values.cakeBase}
              onChange={(value) => update('cakeBase', value)}
            />
          </div>

          <div>
            <Text size="sm" fw={800} mb={6} c={textColor}>
              Raspa
            </Text>
            <SegmentedControl
              fullWidth
              color="plum.6"
              data={toppingOptions}
              value={values.topping}
              onChange={(value) => update('topping', value)}
            />
          </div>

          <Textarea
            label="Texto no bolo"
            placeholder="Ex.: Parabéns, Ana!"
            value={values.message}
            onChange={(event) => update('message', event.currentTarget.value)}
            maxLength={selectedSize.messageLimit}
            autosize
            minRows={2}
          />

          <Textarea
            label="Observações"
            placeholder="Alguma informação que devemos saber?"
            value={values.notes}
            onChange={(event) => update('notes', event.currentTarget.value)}
            maxLength={300}
            autosize
            minRows={3}
          />
        </Stack>

        <SimpleGrid cols={2} spacing="sm" mt="xs" visibleFrom="sm">
          <Button variant="subtle" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            color="plum.6"
            fullWidth
            radius="sm"
            onClick={onAddToCart}
            disabled={!values.flavorId}
          >
            {submitLabel}
          </Button>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
