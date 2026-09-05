import {
  Affix,
  Button,
  Container,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listFlavors } from '@/features/flavors/api/flavorsApi';
import type { Flavor } from '@/features/flavors/types';
import type { CakeBase } from '@/shared/utils/cakeBase';
import { CakeForm } from './CakeForm';
import { CakeSummary } from './CakeSummary';
import { ImportantOrderInfo } from './ImportantOrderInfo';
import { EMPTY_CAKE_FORM, type CakeFormValues } from '../types/cake';

interface OrderCakeBuilderProps {
  mode: 'customer' | 'admin' | 'edit';
  initialValues?: CakeFormValues;
  onAddToCart?: (values: CakeFormValues, flavor: Flavor) => void;
}

function getCakeBase(value: string): CakeBase {
  return value === 'dark' ? 'dark' : 'white';
}

export function OrderCakeBuilder({
  mode,
  initialValues = EMPTY_CAKE_FORM,
  onAddToCart,
}: OrderCakeBuilderProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState<CakeFormValues>(initialValues);
  const { data: flavors = [], isLoading } = useQuery({
    queryKey: ['flavors', 'active'],
    queryFn: listFlavors,
  });

  const defaultFlavor = flavors[0];
  const formValues =
    !values.flavorId && defaultFlavor
      ? {
          ...values,
          flavorId: String(defaultFlavor.id),
          cakeBase: getCakeBase(defaultFlavor.defaultCakeBase),
          topping: getCakeBase(defaultFlavor.defaultTopping),
        }
      : values;
  const selectedFlavor = flavors.find(
    (flavor) => String(flavor.id) === formValues.flavorId,
  );
  const cancelPath = mode === 'admin' || mode === 'edit' ? '/admin' : '/';
  const cartPath =
    mode === 'admin' ? '/admin/pedidos/novo/carrinho' : '/pedidos/novo/carrinho';

  const handleChange = (nextValues: CakeFormValues) => {
    const flavorChanged = nextValues.flavorId !== formValues.flavorId;
    const nextFlavor = flavors.find(
      (flavor) => String(flavor.id) === nextValues.flavorId,
    );
    setValues(
      flavorChanged && nextFlavor
        ? {
            ...nextValues,
            cakeBase: getCakeBase(nextFlavor.defaultCakeBase),
            topping: getCakeBase(nextFlavor.defaultTopping),
          }
        : nextValues,
    );
  };

  const handleAdd = () => {
    if (!selectedFlavor) return;
    onAddToCart?.(formValues, selectedFlavor);
    navigate(cartPath, { state: { cake: formValues, flavor: selectedFlavor } });
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={600} radius="md" />
      </Container>
    );
  }

  if (!flavors.length) {
    return (
      <Container size="xl" py="xl">
        <Text c="rejected">Não há recheios disponíveis para montar um pedido.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py={{ base: 'md', sm: 'xl' }} pb={{ base: 104, sm: 'xl' }}>
      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 6 }}>
          <Stack>
            <CakeForm
              values={formValues}
              flavors={flavors}
              loadingFlavors={isLoading}
              onChange={handleChange}
              onCancel={() => navigate(cancelPath)}
              onAddToCart={handleAdd}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 10, lg: 4 }}>
          <Stack gap="xl">
            <CakeSummary values={formValues} flavor={selectedFlavor} />
            <ImportantOrderInfo />
          </Stack>
        </Grid.Col>
      </Grid>

      <Affix position={{ bottom: 0, left: 0, right: 0 }} hiddenFrom="sm">
        <Group
          w="100%"
          p="sm"
          bg="#FEFEFE"
          gap="xs"
          wrap="nowrap"
          style={{ borderTop: '1px solid var(--mantine-color-caramel-2)' }}
        >
          <Button
            variant="subtle"
            fz="xs"
            style={{ flex: '0 0 30%' }}
            onClick={() => navigate(cancelPath)}
          >
            Cancelar
          </Button>
          <Button
            color="plum.6"
            fz="xs"
            style={{ flex: 1, whiteSpace: 'nowrap' }}
            onClick={handleAdd}
            disabled={!formValues.flavorId}
          >
            Adicionar ao carrinho
          </Button>
        </Group>
      </Affix>
    </Container>
  );
}
