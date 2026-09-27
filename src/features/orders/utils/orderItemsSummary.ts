import type { OrderListItemSummary } from '../types/order';

export function formatOrderItemsSummary(items: OrderListItemSummary[]): string {
  if (items.length === 0) return 'Sem itens';
  if (items.length === 1) return `1 bolo de ${items[0].sizeName}`;

  const sizes = items.map((item) => item.sizeName);
  const allButLast = sizes.slice(0, -1).join(', ');
  const last = sizes[sizes.length - 1];
  return `${items.length} bolos (${allButLast} e ${last})`;
}
