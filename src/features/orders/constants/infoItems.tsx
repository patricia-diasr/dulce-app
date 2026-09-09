import { CalendarClock, CircleHelp, ShieldCheck } from 'lucide-react';
import type { InfoItem } from '../components/ImportantOrderInfo';

export const CAKE_FORM_INFO_ITEMS: InfoItem[] = [
  {
    icon: CalendarClock,
    text: 'O prazo mínimo para pedidos pelo portal é de 72 horas antes da retirada.',
  },
  {
    icon: ShieldCheck,
    text: 'Verificaremos a disponibilidade da data no próximo passo.',
  },
  {
    icon: CircleHelp,
    text: 'Em caso de dúvidas ou pedidos com prazo menor, entre em contato diretamente.',
  },
];

export const CART_INFO_ITEMS: InfoItem[] = [
  {
    icon: CalendarClock,
    text: 'O prazo mínimo para pedidos pelo portal é de 72 horas antes da retirada.',
  },
  {
    icon: CircleHelp,
    text: 'Em caso de dúvidas ou pedidos com prazo menor, entre em contato diretamente.',
  },
];
