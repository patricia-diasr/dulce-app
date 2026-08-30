export interface FlavorPrice {
  sizeId: number;
  sizeName: string;
  costPrice: number;
  salePrice: number;
}

export interface Flavor {
  id: number;
  name: string;
  defaultCakeBase: string;
  defaultTopping: string;
  active: boolean;
  prices: FlavorPrice[];
}

export const DEFAULT_FLAVOR_SIZES: Pick<FlavorPrice, 'sizeId' | 'sizeName'>[] = [
  { sizeId: 1, sizeName: '1kg' },
  { sizeId: 2, sizeName: '2kg' },
  { sizeId: 3, sizeName: '4kg' },
];
