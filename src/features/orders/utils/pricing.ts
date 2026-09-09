import type { CartItem } from '../hooks/useOrderCart';

export function calculateGrossAmount(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price =
      item.flavor.prices.find((p) => String(p.sizeId) === item.cake.sizeId)?.salePrice ??
      0;
    return sum + price;
  }, 0);
}
