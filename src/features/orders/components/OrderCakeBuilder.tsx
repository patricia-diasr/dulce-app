import { useEffect, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { listFlavors } from '@/features/flavors/api/flavorsApi';
import type { CakeBase } from '@/shared/utils/cakeBase';
import { CakeForm } from './CakeForm';
import { CakeSummary } from './CakeSummary';
import { ImportantOrderInfo } from './ImportantOrderInfo';
import { CAKE_FORM_INFO_ITEMS } from '../constants/infoItems';
import { useOrderCart } from '../hooks/useOrderCart';
import { EMPTY_CAKE_FORM, type CakeFormValues } from '../types/cake';

interface EditingItemState {
  editingItemId: string;
  cake: CakeFormValues;
}

interface AdminCustomerLocationState {
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
}

interface OrderCakeBuilderProps {
  mode: 'customer' | 'admin';
  cartId: string;
  cancelPath?: string;
  cartPath?: string;
}

function getCakeBase(value: string): CakeBase {
  return value === 'dark' ? 'dark' : 'white';
}

export function OrderCakeBuilder({
  mode,
  cartId,
  cancelPath: cancelPathProp,
  cartPath: cartPathProp,
}: OrderCakeBuilderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const rawState = location.state as
    (EditingItemState & AdminCustomerLocationState) | null;
  const editingState = rawState?.editingItemId ? (rawState as EditingItemState) : null;

  const [values, setValues] = useState<CakeFormValues>(
    editingState?.cake ?? EMPTY_CAKE_FORM,
  );
  const { data: flavors = [], isLoading } = useQuery({
    queryKey: ['flavors', 'active'],
    queryFn: listFlavors,
  });
  const { addItem, updateItem, setCustomer, clear } = useOrderCart(cartId);

  useEffect(() => {
    if (mode === 'admin' && rawState?.customerId && rawState?.customerName) {
      setCustomer({
        id: rawState.customerId,
        name: rawState.customerName,
        phone: rawState.customerPhone ?? '',
      });
    }
  }, [
    mode,
    rawState?.customerId,
    rawState?.customerName,
    rawState?.customerPhone,
    setCustomer,
  ]);

  const defaultFlavor = flavors[0];
  const formValues =
    !values.flavorId && !editingState && defaultFlavor
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

  const cancelPath = cancelPathProp ?? (mode === 'admin' ? '/admin' : '/');
  const cartPath =
    cartPathProp ??
    (mode === 'admin' ? '/admin/pedidos/novo/carrinho' : '/pedidos/novo/carrinho');
  const backPath = editingState ? cartPath : cancelPath;

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
    if (editingState) {
      updateItem(editingState.editingItemId, formValues, selectedFlavor);
    } else {
      addItem(formValues, selectedFlavor);
    }
    navigate(cartPath);
  };

  const handleCancel = () => {
    if (!editingState) clear();
    navigate(backPath);
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
              onCancel={handleCancel}
              onAddToCart={handleAdd}
              submitLabel={editingState ? 'Salvar alterações' : 'Adicionar ao carrinho'}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 10, lg: 4 }}>
          <Stack gap="xl">
            <CakeSummary values={formValues} flavor={selectedFlavor} />
            {mode === 'customer' && <ImportantOrderInfo items={CAKE_FORM_INFO_ITEMS} />}
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
            onClick={handleCancel}
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
            {editingState ? 'Salvar alterações' : 'Adicionar ao carrinho'}
          </Button>
        </Group>
      </Affix>
    </Container>
  );
}
