import type { ScheduleBlockPayload } from '../api/scheduleApi';
import type { ScheduleBlock } from '../types/scheduleBlock';
import type { ScheduleBlockFormValues } from '../types/form';

function withSeconds(time: string): string {
  if (time.length !== 5) return time;
  return time === '23:59' ? '23:59:59' : `${time}:00`;
}

export function toPayload(values: ScheduleBlockFormValues): ScheduleBlockPayload {
  const time = {
    startTime: withSeconds(values.startTime),
    endTime: withSeconds(values.endTime),
  };

  if (values.type === 'EVENTUAL') {
    return { type: 'EVENTUAL', blockDate: values.blockDate, ...time };
  }

  return {
    type: 'RECURRING',
    recurrence: values.recurrence,
    weekday: values.recurrence === 'WEEKLY' ? values.weekday : undefined,
    monthDay: values.recurrence === 'MONTHLY' ? values.monthDay : undefined,
    validFrom: values.validFrom,
    validUntil: values.validUntil || undefined,
    ...time,
  };
}

export function fromBlock(block: ScheduleBlock): ScheduleBlockFormValues {
  const isAllDay =
    block.startTime.startsWith('00:00') && block.endTime.startsWith('23:59');

  return {
    type: block.type,
    allDay: isAllDay,
    blockDate: block.blockDate ?? undefined,
    recurrence: block.recurrence ?? undefined,
    weekday: block.weekday ?? undefined,
    monthDay: block.monthDay ?? undefined,
    startTime: block.startTime.slice(0, 5),
    endTime: block.endTime.slice(0, 5),
    validFrom: block.validFrom ?? undefined,
    validUntil: block.validUntil ?? undefined,
  };
}
