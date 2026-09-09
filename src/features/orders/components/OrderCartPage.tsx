import { useEffect, useState } from 'react';
import { Affix, Box, Button, Container, Grid, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/api/errors';
import { ConfirmDeleteModal } from '@/shared/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { createOrder } from '../api/ordersApi';
import { CART_INFO_ITEMS } from '../constants/infoItems';
import { CartItemsCard } from './CartItemsCard';
import { OrderSummaryCard } from './OrderSummaryCard';
import { ImportantOrderInfo } from './ImportantOrderInfo';
import { useOrderCart, type CartItem } from '../hooks/useOrderCart';
import type { CreateOrderPayload } from '../types/order';
import { getCustomerId } from '@/shared/utils/tokenStorage';
import { CAKE_SIZES } from '../types/cake';
import {
  isDiscountValid,
  isPickupTooSoon,
  MIN_HOURS_BEFORE_PICKUP,
} from '../utils/orderValidation';

interface OrderCartPageProps {
  mode: 'customer' | 'admin';
  cartId: string;
}

export function OrderCartPage({ mode, cartId }: OrderCartPageProps) {
  const navigate = useNavigate();

  const {
    items,
    pickupDate,
    pickupTime,
    discount,
    notes,
    customer,
    removeItem,
    setPickup,
    setDiscount,
    setNotes,
    clear,
  } = useOrderCart(cartId);

  const [itemPendingDeletion, setItemPendingDeletion] = useState<CartItem | null>(null);

  const cakeFormPath = mode === 'admin' ? '/admin/pedidos/novo' : '/pedidos/novo';
  const cancelPath = mode === 'admin' ? '/admin' : '/';
  const customerId = mode === 'admin' ? (customer?.id ?? null) : getCustomerId();
  const noCustomerSelected = mode === 'admin' && !customer;
  const discountExceedsTotal = discount != null && !isDiscountValid(discount, items);
  const pickupTooSoon = mode === 'customer' && isPickupTooSoon(pickupDate, pickupTime);
  const canFinish =
    items.length > 0 &&
    !!pickupDate &&
    !!pickupTime &&
    !discountExceedsTotal &&
    !pickupTooSoon;

  const createMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(customerId!, payload),
    onSuccess: () => {
      notifications.show({
        color: 'accepted',
        title: 'Pedido realizado!',
        message:
          mode === 'customer'
            ? 'Seu pedido foi enviado para análise da confeitaria.'
            : 'O pedido foi registrado com sucesso.',
      });
      clear();
      navigate(cancelPath);
    },
    onError: (error) =>
      notifications.show({
        color: 'rejected.7',
        title: 'Não foi possível concluir o pedido',
        message: getApiErrorMessage(error, 'Verifique os dados e tente novamente.'),
      }),
  });

  const handleFinish = () => {
    if (!items.length || !pickupDate || !pickupTime || !customerId) return;

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
      discount: mode === 'admin' && discount ? discount : undefined,
      items: items.map((item) => ({
        flavorId: item.flavor.id,
        sizeId: Number(item.cake.sizeId),
        cakeBase: item.cake.cakeBase,
        topping: item.cake.topping,
        message: item.cake.message || undefined,
        notes: item.cake.notes || undefined,
      })),
    };

    createMutation.mutate(payload);
  };

  const handleCancel = () => {
    clear();
    navigate(cancelPath);
  };

  useEffect(() => {
    if (noCustomerSelected) {
      const timeout = setTimeout(
        () => navigate('/admin/clientes', { replace: true }),
        1500,
      );
      return () => clearTimeout(timeout);
    }
  }, [noCustomerSelected, navigate]);

  useEffect(() => {
    if (!items.length && !noCustomerSelected) {
      const timeout = setTimeout(() => navigate(cakeFormPath, { replace: true }), 1500);
      return () => clearTimeout(timeout);
    }
  }, [items.length, noCustomerSelected, cakeFormPath, navigate]);

  if (noCustomerSelected) {
    return (
      <Container size="xl" py="xl">
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="rejected">
            Nenhum cliente selecionado. Redirecionando para a listagem de clientes...
          </Text>
        </Box>
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container size="xl" py="xl">
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Text c="dimmed">
            Seu carrinho está vazio. Redirecionando para o formulário de bolo...
          </Text>
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
            onCancel={handleCancel}
            onFinish={handleFinish}
            finishing={createMutation.isPending}
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
                mode === 'admin' && customer
                  ? { name: customer.name, phone: customer.phone }
                  : null
              }
            />
            <ImportantOrderInfo items={CART_INFO_ITEMS} />
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
            onClick={handleFinish}
            loading={createMutation.isPending}
            disabled={!canFinish}
          >
            Finalizar pedido
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
