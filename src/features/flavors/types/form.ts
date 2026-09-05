import { z } from 'zod';

export const flavorPriceFormSchema = z.object({
  sizeId: z.number(),
  sizeName: z.string(),
  costPrice: z.coerce.number().positive('O preço de custo deve ser maior que zero'),
  salePrice: z.coerce.number().positive('O preço de venda deve ser maior que zero'),
});

export const flavorFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome do recheio'),
  defaultCakeBase: z.enum(['white', 'dark'], { error: 'Selecione a massa padrão' }),
  defaultTopping: z.enum(['white', 'dark'], { error: 'Selecione a raspa padrão' }),
  prices: z.array(flavorPriceFormSchema).min(1),
});

export type FlavorPriceFormValues = z.infer<typeof flavorPriceFormSchema>;
export type FlavorFormValues = z.infer<typeof flavorFormSchema>;
