import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const BUSINESS_TIMEZONE = 'America/Sao_Paulo';

export function toBusinessTime(iso: string) {
  return dayjs(iso).tz(BUSINESS_TIMEZONE);
}
