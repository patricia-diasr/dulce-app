import type { CakeBase } from '@/shared/utils/cakeBase';

export interface CakeFormValues {
  sizeId: string;
  flavorId: string;
  cakeBase: CakeBase;
  topping: CakeBase;
  message: string;
  notes: string;
}

export const CAKE_SIZES = [
  { value: '1', label: '1 kg', messageLimit: 12 },
  { value: '2', label: '2 kg', messageLimit: 20 },
  { value: '3', label: '4 kg', messageLimit: 30 },
] as const;

export const EMPTY_CAKE_FORM: CakeFormValues = {
  sizeId: '1',
  flavorId: '',
  cakeBase: 'white',
  topping: 'white',
  message: '',
  notes: '',
};
