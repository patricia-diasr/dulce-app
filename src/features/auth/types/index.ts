import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome completo'),
  email: z.string().email('Informe um e-mail válido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Informe um telefone válido'),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe a senha'),
});
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const emailSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
});
export type EmailFormValues = z.infer<typeof emailSchema>;

export const codeSchema = z.object({
  code: z.string().length(6, 'O código tem 6 dígitos'),
});
export type CodeFormValues = z.infer<typeof codeSchema>;
