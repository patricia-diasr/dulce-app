import dayjs from 'dayjs';
import type { ScheduleBlock } from '../types/scheduleBlock';

interface OpenWindow {
  startMinutes: number;
  endMinutes: number;
}

const WEEKDAY_NAMES: Record<number, string> = {
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sábado',
  7: 'domingo',
};

const MASCULINE_WEEKDAYS = new Set([6, 7]);

function formatTimeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  return `${h}h${m}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getMergedBlockedIntervals(
  blocks: ScheduleBlock[],
  day: string,
): [number, number][] {
  const occurrences = getBlockOccurrencesForDay(blocks, day);
  const merged: [number, number][] = [];

  for (const occurrence of occurrences) {
    const start = toMinutes(occurrence.startTime);
    const end = occurrence.endTime === '23:59' ? 1440 : toMinutes(occurrence.endTime);
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}

function getOpenWindowsForDay(blocks: ScheduleBlock[], day: string): OpenWindow[] {
  const merged = getMergedBlockedIntervals(blocks, day);
  const openWindows: OpenWindow[] = [];
  let cursor = 0;

  for (const [start, end] of merged) {
    if (start > cursor) openWindows.push({ startMinutes: cursor, endMinutes: start });
    cursor = Math.max(cursor, end);
  }
  if (cursor < 1440) openWindows.push({ startMinutes: cursor, endMinutes: 1440 });

  return openWindows;
}

export interface BlockOccurrence {
  block: ScheduleBlock;
  startsToday: boolean;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
}

export function isBlockRuleActiveOnDate(
  block: ScheduleBlock,
  date: dayjs.Dayjs,
): boolean {
  if (!block.active) return false;
  if (date.isBefore(dayjs(block.validFrom), 'day')) return false;
  if (block.validUntil && date.isAfter(dayjs(block.validUntil), 'day')) return false;

  if (block.type === 'EVENTUAL') {
    return block.blockDate === date.format('YYYY-MM-DD');
  }

  switch (block.recurrence) {
    case 'DAILY':
      return true;
    case 'WEEKLY': {
      const isoWeekday = date.day() === 0 ? 7 : date.day();
      return block.weekday === isoWeekday;
    }
    case 'MONTHLY':
      return block.monthDay === date.date();
    default:
      return false;
  }
}

export function getBlockOccurrencesForDay(
  blocks: ScheduleBlock[],
  day: string,
): BlockOccurrence[] {
  const date = dayjs(day);
  const yesterday = date.subtract(1, 'day');
  const occurrences: BlockOccurrence[] = [];

  for (const block of blocks) {
    const crossesMidnight = block.startTime > block.endTime;

    if (isBlockRuleActiveOnDate(block, date)) {
      occurrences.push({
        block,
        startsToday: true,
        startTime: block.startTime.slice(0, 5),
        endTime: crossesMidnight ? '23:59' : block.endTime.slice(0, 5),
        crossesMidnight,
      });
    }

    if (crossesMidnight && isBlockRuleActiveOnDate(block, yesterday)) {
      occurrences.push({
        block,
        startsToday: false,
        startTime: '00:00',
        endTime: block.endTime.slice(0, 5),
        crossesMidnight: true,
      });
    }
  }

  return occurrences.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function formatBlockRuleLabel(block: ScheduleBlock): string {
  if (block.type === 'EVENTUAL') {
    return 'Bloqueio pontual';
  }
  if (block.recurrence === 'DAILY') return 'Todo dia';
  if (block.recurrence === 'WEEKLY') {
    const weekday = block.weekday ?? 1;
    const name = WEEKDAY_NAMES[weekday];
    return MASCULINE_WEEKDAYS.has(weekday) ? `Todo ${name}` : `Toda ${name}`;
  }
  if (block.recurrence === 'MONTHLY') return `Todo dia ${block.monthDay} do mês`;
  return 'Bloqueio recorrente';
}

export function formatBlockDescription(block: ScheduleBlock): string {
  const isAllDay =
    block.startTime.startsWith('00:00') && block.endTime.startsWith('23:59');
  const ruleLabel =
    block.type === 'EVENTUAL'
      ? dayjs(block.blockDate).format('DD/MM/YYYY')
      : formatBlockRuleLabel(block).toLowerCase();

  if (isAllDay) {
    return `o bloqueio de ${ruleLabel} (dia inteiro)`;
  }

  const start = formatTimeLabel(block.startTime.slice(0, 5));
  const end = formatTimeLabel(block.endTime.slice(0, 5));
  return `o bloqueio de ${ruleLabel} das ${start} às ${end}`;
}

export function isDayFullyBlocked(blocks: ScheduleBlock[], day: string): boolean {
  return getOpenWindowsForDay(blocks, day).length === 0;
}

export function getAvailableTimeSlots(
  blocks: ScheduleBlock[],
  day: string,
  stepMinutes = 30,
): string[] {
  const windows = getOpenWindowsForDay(blocks, day);
  const slots: string[] = [];

  for (const window of windows) {
    let start = Math.ceil(window.startMinutes / stepMinutes) * stepMinutes;
    while (start < window.endMinutes) {
      slots.push(minutesToTime(start));
      start += stepMinutes;
    }
  }

  return slots;
}

export function getMergedBlockIntervalsForDay(
  blocks: ScheduleBlock[],
  day: string,
): { start: string; end: string }[] {
  return getMergedBlockedIntervals(blocks, day).map(([start, end]) => ({
    start: minutesToTime(start),
    end: end >= 1440 ? '23:59' : minutesToTime(end),
  }));
}
