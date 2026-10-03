import { useMemo } from 'react';
import {
  Button,
  Divider,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { listScheduleBlocks } from '@/features/schedule/api/scheduleApi';
import {
  getAvailableTimeSlots,
  isDayFullyBlocked,
} from '@/features/schedule/utils/blockOccurrences';
import { textColor } from '@/theme/colors';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from '../hooks/useOrderCart';
import { calculateGrossAmount } from '../utils/pricing';
import {
  isDiscountValid,
  isPickupTooSoon,
  MIN_HOURS_BEFORE_PICKUP,
} from '../utils/orderValidation';
import { PickupTimeSelect } from '@/features/schedule/components/PickupTimeSelect';
import { FIRST_DAY_OF_WEEK } from '@/features/schedule/constants/calendar';

interface CartItemsCardProps {
  items: CartItem[];
  pickupDate: string;
  pickupTime: string;
  onPickupDateChange: (value: string) => void;
  onPickupTimeChange: (value: string) => void;
  isAdmin: boolean;
  discount: number | null;
  onDiscountChange: (value: number | null) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onEditItem: (item: CartItem) => void;
  onDeleteItem: (item: CartItem) => void;
  onAddAnother: () => void;
  onCancel: () => void;
  onFinish: () => void;
  finishing?: boolean;
  submitLabel?: string;
}

export function CartItemsCard({
  items,
  pickupDate,
  pickupTime,
  onPickupDateChange,
  onPickupTimeChange,
  isAdmin,
  discount,
  onDiscountChange,
  notes,
  onNotesChange,
  onEditItem,
  onDeleteItem,
  onAddAnother,
  onCancel,
  onFinish,
  finishing,
  submitLabel = 'Finalizar pedido',
}: CartItemsCardProps) {
  const grossAmount = calculateGrossAmount(items);
  const discountExceedsTotal = discount != null && !isDiscountValid(discount, items);
  const pickupTooSoon =
    !isAdmin && isPickupTooSoon(pickupDate || null, pickupTime || null);
  const canFinish =
    items.length > 0 &&
    !!pickupDate &&
    !!pickupTime &&
    !discountExceedsTotal &&
    !pickupTooSoon;

  const { data: blocks = [] } = useQuery({
    queryKey: ['schedule', 'blocks'],
    queryFn: () => listScheduleBlocks(true),
    enabled: !isAdmin,
  });

  const availableTimes = useMemo(() => {
    if (!pickupDate) return [];

    const slots = getAvailableTimeSlots(isAdmin ? [] : blocks, pickupDate);
    if (isAdmin) return slots;

    const cutoff = dayjs().add(MIN_HOURS_BEFORE_PICKUP, 'hour');
    return slots.filter((time) => !dayjs(`${pickupDate}T${time}`).isBefore(cutoff));
  }, [pickupDate, blocks, isAdmin]);

  return (
    <Paper p={{ base: 'md', sm: 'xl' }} radius="md" shadow="md" withBorder bg="#FEFEFE">
      <Stack gap="xl">
        <div>
          <Title mt={2} order={2} fz={28} fw={700} c={textColor}>
            Bolos adicionados ({items.length})
          </Title>
          <Text c={textColor} opacity={0.75} size="sm" mt={4}>
            Revise os bolos adicionados e selecione a data e hora de retirada do pedido.
          </Text>
        </div>

        <Stack gap="lg">
          {items.map((item, index) => (
            <div key={item.id}>
              <CartItemRow
                item={item}
                index={index}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                canDelete={items.length > 1}
              />
              {index < items.length - 1 && <Divider color="caramel.2" mt="lg" />}
            </div>
          ))}
        </Stack>

        <Button variant="light" color="plum" onClick={onAddAnother}>
          Adicionar outro bolo
        </Button>

        <Divider color="caramel.2" />

        <Stack gap="md">
          <Text fw={800} c={textColor}>
            Data e hora de retirada do pedido
          </Text>
          <SimpleGrid cols={2} spacing="md">
            <DateInput
              label="Data"
              placeholder="Selecione a data"
              valueFormat="DD/MM/YYYY"
              value={pickupDate ? new Date(`${pickupDate}T00:00:00`) : null}
              onChange={(date) =>
                onPickupDateChange(date ? dayjs(date).format('YYYY-MM-DD') : '')
              }
              minDate={
                !isAdmin
                  ? dayjs().add(MIN_HOURS_BEFORE_PICKUP, 'hour').toDate()
                  : undefined
              }
              excludeDate={
                !isAdmin
                  ? (date) => isDayFullyBlocked(blocks, dayjs(date).format('YYYY-MM-DD'))
                  : undefined
              }
              firstDayOfWeek={FIRST_DAY_OF_WEEK}
            />
            <PickupTimeSelect
              value={pickupTime}
              onChange={onPickupTimeChange}
              availableTimes={availableTimes}
              disabled={!pickupDate}
            />
          </SimpleGrid>
          {pickupTooSoon && (
            <Text size="sm" c="rejected">
              Pedidos pelo portal precisam ser feitos com pelo menos{' '}
              {MIN_HOURS_BEFORE_PICKUP} horas de antecedência.
            </Text>
          )}
        </Stack>

        <Textarea
          label="Observações do pedido (opcional)"
          placeholder="Alguma informação geral sobre o pedido?"
          value={notes}
          onChange={(event) => onNotesChange(event.currentTarget.value)}
          maxLength={500}
          autosize
          minRows={2}
        />

        {isAdmin && (
          <>
            <Divider color="caramel.2" />
            <NumberInput
              label="Desconto (opcional)"
              hideControls
              decimalScale={2}
              fixedDecimalScale
              min={0}
              max={grossAmount}
              step={0.5}
              prefix="R$ "
              value={discount ?? undefined}
              onChange={(value) =>
                onDiscountChange(typeof value === 'number' ? value : null)
              }
              error={
                discountExceedsTotal
                  ? 'Desconto não pode ser maior que o valor do pedido.'
                  : undefined
              }
            />
          </>
        )}

        <SimpleGrid cols={2} spacing="sm" mt="xs" visibleFrom="sm">
          <Button variant="subtle" fullWidth onClick={onCancel} disabled={finishing}>
            Cancelar
          </Button>
          <Button
            color="plum.6"
            fullWidth
            radius="sm"
            onClick={onFinish}
            loading={finishing}
            disabled={!canFinish}
          >
            {submitLabel}
          </Button>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
