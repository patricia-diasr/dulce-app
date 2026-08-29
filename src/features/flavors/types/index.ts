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
