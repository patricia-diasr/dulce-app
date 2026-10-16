import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatKg(value: number): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kg`;
}

export function formatLongDay(date: string): string {
  return capitalize(dayjs(date).locale('pt-br').format('dddd, D [de] MMMM'));
}

export function formatShortDay(date: string): string {
  return capitalize(dayjs(date).locale('pt-br').format('ddd, DD/MM'));
}
