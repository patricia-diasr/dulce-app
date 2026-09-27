import { useState } from 'react';
import { Affix, Box, Button, Container, Grid, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import type { Flavor } from '@/features/flavors/types';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { updateOrder } from '../api/ordersApi';
import { CART_INFO_ITEMS } from '../constants/infoItems';
import { CartItemsCard } from './CartItemsCard';
import { ImportantOrderInfo } from './ImportantOrderInfo';
import { OrderSummaryCard } from './OrderSummaryCard';
import { useOrderCart, type CartItem, type CartState } from '../hooks/useOrderCart';
import { CAKE_SIZES } from '../types/cake';
import {
  isDiscountValid,
  isPickupTooSoon,
  MIN_HOURS_BEFORE_PICKUP,
} from '../utils/orderValidation';
import type {
  CreateOrderPayload,
  OrderItemResponse,
  OrderResponse,
} from '../types/order';

interface OrderEditBuilderProps {
  mode: 'customer' | 'admin';
  order: OrderResponse;
}

function freezeFlavor(item: OrderItemResponse): Flavor {
  return {
    id: item.flavorId,
    name: item.flavorName,
    active: false,
    defaultCakeBase: item.cakeBase,
    defaultTopping: item.topping,
    prices: [
      {
        sizeId: item.sizeId,
        sizeName: item.sizeName,
        costPrice: item.unitPrice,
        salePrice: item.unitPrice,
      },
    ],
  } as Flavor;
}

function buildStateFromOrder(order: OrderResponse): CartState {
  const pickup = dayjs(order.pickupAt);
  return {
    items: order.items.map((item) => ({
      id: crypto.randomUUID(),
      cake: {
        sizeId: String(item.sizeId),
        flavorId: String(item.flavorId),
        cakeBase: item.cakeBase,
        topping: item.topping,
        message: item.message ?? '',
        notes: item.notes ?? '',
      },
      flavor: freezeFlavor(item),
    })),
    pickupDate: pickup.format('YYYY-MM-DD'),
    pickupTime: pickup.format('HH:mm'),
    discount: order.invoice?.discount || null,
    notes: order.notes ?? '',
    customer: null,
  };
}

export function OrderEditBuilder({ mode, order }: OrderEditBuilderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cartId = `${mode}-order-edit-${order.id}`;
  const cakeFormPath =
    mode === 'admin'
      ? `/admin/pedidos/${order.id}/editar/bolo`
      : `/pedidos/${order.id}/editar/bolo`;
  const detailPath =
    mode === 'admin' ? `/admin/pedidos/${order.id}` : `/pedidos/${order.id}`;

  const {
    items,
    pickupDate,
    pickupTime,
    discount,
    notes,
    removeItem,
    setPickup,
    setDiscount,
    setNotes,
    clear,
  } = useOrderCart(cartId, () => buildStateFromOrder(order));

  const [itemPendingDeletion, setItemPendingDeletion] = useState<CartItem | null>(null);

  const discountExceedsTotal = discount != null && !isDiscountValid(discount, items);
  const pickupTooSoon = mode === 'customer' && isPickupTooSoon(pickupDate, pickupTime);
  const canFinish =
    items.length > 0 &&
    !!pickupDate &&
    !!pickupTime &&
    !discountExceedsTotal &&
    !pickupTooSoon;

  const cleanupAndLeave = (to: string) => {
    clear();
    navigate(to);
  };

  const updateMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => updateOrder(order.id, payload),
    onSuccess: (data) => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido atualizado!',
        message: 'As alterações foram salvas.',
      });
      queryClient.setQueryData(['orders', order.id], data);
      cleanupAndLeave(detailPath);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível salvar',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const handleFinish = () => {
    if (!canFinish) return;

    if (discount != null && !isDiscountValid(discount, items)) {
      notifications.show({
        color: 'rejected.7',
        title: 'Desconto inválido',
        message: 'O desconto não pode ser maior que o valor total do pedido.',
      });
      return;
    }

    if (mode === 'customer' && isPickupTooSoon(pickupDate, pickupTime)) {
      notifications.show({
        color: 'rejected.7',
        title: 'Data de retirada inválida',
        message: `Pedidos pelo portal precisam ser feitos com pelo menos ${MIN_HOURS_BEFORE_PICKUP} horas de antecedência.`,
      });
      return;
    }

    const payload: CreateOrderPayload = {
      pickupAt: new Date(`${pickupDate}T${pickupTime}:00`).toISOString(),
      notes: notes || undefined,
      discount: mode === 'admin' ? (discount ?? 0) : undefined,
      items: items.map((item) => ({
        flavorId: item.flavor.id,
        sizeId: Number(item.cake.sizeId),
        cakeBase: item.cake.cakeBase,
        topping: item.cake.topping,
        message: item.cake.message || undefined,
        notes: item.cake.notes || undefined,
      })),
    };

    updateMutation.mutate(payload);
  };

  if (items.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="dimmed">
            Nenhum bolo no pedido. Adicione pelo menos um bolo para salvar.
          </Text>
          <Button color="plum.6" radius="sm" onClick={() => navigate(cakeFormPath)}>
            Adicionar bolo
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="xl" py={{ base: 'md', sm: 'xl' }} pb={{ base: 104, sm: 'xl' }}>
      <Grid columns={10} gap="xl">
        <Grid.Col span={{ base: 10, lg: 6 }}>
          <CartItemsCard
            items={items}
            pickupDate={pickupDate ?? ''}
            pickupTime={pickupTime ?? ''}
            onPickupDateChange={(date) => setPickup(date, pickupTime)}
            onPickupTimeChange={(time) => setPickup(pickupDate, time)}
            isAdmin={mode === 'admin'}
            discount={discount}
            onDiscountChange={setDiscount}
            notes={notes ?? ''}
            onNotesChange={setNotes}
            onEditItem={(item) =>
              navigate(cakeFormPath, {
                state: { editingItemId: item.id, cake: item.cake },
              })
            }
            onDeleteItem={setItemPendingDeletion}
            onAddAnother={() => navigate(cakeFormPath)}
            onCancel={() => cleanupAndLeave(detailPath)}
            onFinish={handleFinish}
            finishing={updateMutation.isPending}
            submitLabel="Salvar alterações"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 10, lg: 4 }}>
          <Stack gap="xl">
            <OrderSummaryCard
              items={items}
              pickupDate={pickupDate ?? ''}
              pickupTime={pickupTime ?? ''}
              discount={discount}
              customer={
                mode === 'admin'
                  ? { name: order.customerName, phone: order.customerPhone }
                  : null
              }
            />
            {mode === 'customer' && <ImportantOrderInfo items={CART_INFO_ITEMS} />}
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
            onClick={() => cleanupAndLeave(detailPath)}
          >
            Cancelar
          </Button>
          <Button
            color="plum.6"
            fz="xs"
            style={{ flex: 1, whiteSpace: 'nowrap' }}
            onClick={handleFinish}
            loading={updateMutation.isPending}
            disabled={!canFinish}
          >
            Salvar alterações
          </Button>
        </Group>
      </Affix>

      <ConfirmDeleteModal
        opened={itemPendingDeletion !== null}
        onClose={() => setItemPendingDeletion(null)}
        onConfirm={() => {
          if (itemPendingDeletion) removeItem(itemPendingDeletion.id);
          setItemPendingDeletion(null);
        }}
        title="Remover bolo"
        itemName={
          itemPendingDeletion
            ? `${CAKE_SIZES.find((s) => s.value === itemPendingDeletion.cake.sizeId)?.label ?? ''} ${itemPendingDeletion.flavor.name}`
            : undefined
        }
      />
    </Container>
  );
}
