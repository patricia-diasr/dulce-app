export type ScheduleBlockType = 'EVENTUAL' | 'RECURRING';
export type ScheduleBlockRecurrence = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface ScheduleBlock {
  id: number;
  type: ScheduleBlockType;
  blockDate: string | null;
  weekday: number | null;
  monthDay: number | null;
  recurrence: ScheduleBlockRecurrence | null;
  startTime: string;
  endTime: string;
  validFrom: string;
  validUntil: string | null;
  active: boolean;
}
