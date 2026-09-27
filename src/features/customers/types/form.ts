import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Informe o nome do cliente')
    .max(150, 'Máximo de 150 caracteres'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Informe um telefone válido'),
  email: z.union([
    z.string().email('Informe um e-mail válido').max(255, 'Máximo de 255 caracteres'),
    z.literal(''),
  ]),
  notes: z.string().max(500, 'Máximo de 500 caracteres').optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
