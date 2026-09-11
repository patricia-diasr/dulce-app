import type { CreationChannel, OrderStatus } from '../types/order';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  REJECTED: 'Recusado',
  CANCELED: 'Cancelado',
  COMPLETED: 'Concluído',
};

export const CREATION_CHANNEL_LABELS: Record<CreationChannel, string> = {
  CUSTOMER: 'Cliente',
  ADMIN: 'Administrador',
};

export const INVOICE_STATUS_LABELS: Record<'PENDING' | 'PARTIAL' | 'PAID', string> = {
  PENDING: 'Sem pagamento',
  PARTIAL: 'Pagamento parcial',
  PAID: 'Pago',
};

export const INVOICE_STATUS_COLORS: Record<'PENDING' | 'PARTIAL' | 'PAID', string> = {
  PENDING: 'pending',
  PARTIAL: 'caramel',
  PAID: 'accepted',
};
