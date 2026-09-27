import { apiClient } from '@/lib/api/client';
import type { UserRole } from '@/shared/utils/tokenStorage';
import type { AdminLoginFormValues, RegisterFormValues } from '../types';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: string;
  role: UserRole;
  name: string;
  expiresAt: string;
}

export async function registerCustomer(values: RegisterFormValues): Promise<Customer> {
  const { data } = await apiClient.post<Customer>('/customers', values);
  return data;
}

export async function adminLogin(values: AdminLoginFormValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/admin/login', values);
  return data;
}

export async function requestCustomerLoginCode(email: string): Promise<void> {
  await apiClient.post('/auth/customers/login/code', { email });
}

export async function verifyCustomerLoginCode(
  email: string,
  code: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/customers/login', {
    email,
    code,
  });
  return data;
}
