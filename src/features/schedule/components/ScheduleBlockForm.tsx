import {
  Button,
  Checkbox,
  NumberInput,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DateInput, TimePicker } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { textColor } from '@/theme/colors';
import { scheduleBlockFormSchema, type ScheduleBlockFormValues } from '../types/form';
import { FIRST_DAY_OF_WEEK } from '../constants/calendar';

interface ScheduleBlockFormProps {
  initialValues: ScheduleBlockFormValues;
  onSubmit: (values: ScheduleBlockFormValues) => void;
  onCancel: () => void;
  title: string;
  description: string;
  submitting?: boolean;
  submitLabel?: string;
}

const TODAY = new Date();

const TYPE_OPTIONS = [
  { value: 'EVENTUAL', label: 'Pontual' },
  { value: 'RECURRING', label: 'Recorrente' },
];

const RECURRENCE_OPTIONS = [
  { value: 'DAILY', label: 'Todo dia' },
  { value: 'WEEKLY', label: 'Toda semana' },
  { value: 'MONTHLY', label: 'Todo mês' },
];

const WEEKDAY_OPTIONS = [
  { value: '1', label: 'Segunda' },
  { value: '2', label: 'Terça' },
  { value: '3', label: 'Quarta' },
  { value: '4', label: 'Quinta' },
  { value: '5', label: 'Sexta' },
  { value: '6', label: 'Sábado' },
  { value: '7', label: 'Domingo' },
];

function dateStringToDate(value?: string): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export function ScheduleBlockForm({
  initialValues,
  onSubmit,
  onCancel,
  title,
  description,
  submitting,
  submitLabel = 'Salvar',
}: ScheduleBlockFormProps) {
  const form = useForm<ScheduleBlockFormValues>({
    initialValues,
    validate: schemaResolver(scheduleBlockFormSchema),
  });

  const isEventual = form.values.type === 'EVENTUAL';
  const isWeekly = form.values.recurrence === 'WEEKLY';
  const isMonthly = form.values.recurrence === 'MONTHLY';
  const isAllDay = form.values.allDay ?? false;

  const handleAllDayChange = (checked: boolean) => {
    form.setFieldValue('allDay', checked);
    if (checked) {
      form.setFieldValue('startTime', '00:00');
      form.setFieldValue('endTime', '23:59');
    }
  };

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
            <div>
              <Text size="sm" fw={800} mb={6}>
                Tipo de bloqueio
              </Text>
              <SegmentedControl
                fullWidth
                color="plum.6"
                data={TYPE_OPTIONS}
                key={form.key('type')}
                {...form.getInputProps('type')}
              />
            </div>

            {isEventual ? (
              <DateInput
                label="Data do bloqueio"
                placeholder="Selecione a data"
                valueFormat="DD/MM/YYYY"
                firstDayOfWeek={FIRST_DAY_OF_WEEK}
                minDate={TODAY}
                value={dateStringToDate(form.values.blockDate)}
                onChange={(date) =>
                  form.setFieldValue(
                    'blockDate',
                    date ? dayjs(date).format('YYYY-MM-DD') : undefined,
                  )
                }
                error={form.errors.blockDate}
              />
            ) : (
              <>
                <Select
                  label="Recorrência"
                  placeholder="Selecione"
                  data={RECURRENCE_OPTIONS}
                  key={form.key('recurrence')}
                  {...form.getInputProps('recurrence')}
                />

                {isWeekly && (
                  <Select
                    label="Dia da semana"
                    placeholder="Selecione"
                    data={WEEKDAY_OPTIONS}
                    value={form.values.weekday ? String(form.values.weekday) : null}
                    onChange={(value) =>
                      form.setFieldValue('weekday', value ? Number(value) : undefined)
                    }
                    error={form.errors.weekday}
                  />
                )}

                {isMonthly && (
                  <NumberInput
                    label="Dia do mês"
                    placeholder="Ex.: 15"
                    min={1}
                    max={31}
                    key={form.key('monthDay')}
                    {...form.getInputProps('monthDay')}
                  />
                )}

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <DateInput
                    label="Início da vigência"
                    placeholder="Selecione a data"
                    valueFormat="DD/MM/YYYY"
                    firstDayOfWeek={FIRST_DAY_OF_WEEK}
                    minDate={TODAY}
                    value={dateStringToDate(form.values.validFrom)}
                    onChange={(date) =>
                      form.setFieldValue(
                        'validFrom',
                        date ? dayjs(date).format('YYYY-MM-DD') : undefined,
                      )
                    }
                    error={form.errors.validFrom}
                  />
                  <DateInput
                    label="Fim da vigência (opcional)"
                    placeholder="Sem data final"
                    valueFormat="DD/MM/YYYY"
                    firstDayOfWeek={FIRST_DAY_OF_WEEK}
                    clearable
                    minDate={
                      form.values.validFrom
                        ? new Date(`${form.values.validFrom}T00:00:00`)
                        : TODAY
                    }
                    value={dateStringToDate(form.values.validUntil)}
                    onChange={(date) =>
                      form.setFieldValue(
                        'validUntil',
                        date ? dayjs(date).format('YYYY-MM-DD') : undefined,
                      )
                    }
                    error={form.errors.validUntil}
                  />
                </SimpleGrid>
              </>
            )}

            <Checkbox
              label="Bloquear o dia inteiro"
              color="plum.6"
              checked={isAllDay}
              onChange={(event) => handleAllDayChange(event.currentTarget.checked)}
            />

            {!isAllDay && (
              <>
                <SimpleGrid cols={2} spacing="md">
                  <TimePicker
                    label="Horário de início"
                    format="24h"
                    withDropdown
                    value={form.values.startTime}
                    onChange={(value) => form.setFieldValue('startTime', value)}
                    error={form.errors.startTime}
                  />
                  <TimePicker
                    label="Horário de término"
                    format="24h"
                    withDropdown
                    value={form.values.endTime}
                    onChange={(value) => form.setFieldValue('endTime', value)}
                    error={form.errors.endTime}
                  />
                </SimpleGrid>

                <Text size="xs" c="dimmed">
                  Se o horário de término for antes do de início, o bloqueio atravessa a
                  meia-noite (ex.: 19:00 às 07:00 bloqueia até as 7h do dia seguinte).
                </Text>
              </>
            )}
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
