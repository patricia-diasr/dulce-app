import { apiClient } from '@/lib/api/client';
import type {
  ScheduleBlock,
  ScheduleBlockRecurrence,
  ScheduleBlockType,
} from '../types/scheduleBlock';

export interface ScheduleBlockPayload {
  type: ScheduleBlockType;
  blockDate?: string;
  recurrence?: ScheduleBlockRecurrence;
  weekday?: number;
  monthDay?: number;
  startTime: string;
  endTime: string;
  validFrom?: string;
  validUntil?: string;
}

export async function getFullyBlockedDays(from: string, to: string): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/schedule/blocks/fully-blocked-days', {
    params: { from, to },
  });
  return data;
}

export async function listScheduleBlocks(active?: boolean): Promise<ScheduleBlock[]> {
  const { data } = await apiClient.get<ScheduleBlock[]>('/schedule/blocks', {
    params: active !== undefined ? { active } : undefined,
  });
  return data;
}

export async function createScheduleBlock(
  payload: ScheduleBlockPayload,
): Promise<ScheduleBlock> {
  const { data } = await apiClient.post<ScheduleBlock>('/schedule/blocks', payload);
  return data;
}

export async function updateScheduleBlock(
  id: number,
  payload: ScheduleBlockPayload,
): Promise<ScheduleBlock> {
  const { data } = await apiClient.patch<ScheduleBlock>(
    `/schedule/blocks/${id}`,
    payload,
  );
  return data;
}

export async function deleteScheduleBlock(id: number): Promise<void> {
  await apiClient.delete(`/schedule/blocks/${id}`);
}
