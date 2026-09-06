import { apiClient } from '@/lib/api/client';
import type { Customer, CustomerDetail, PaginatedResponse } from '../types';
import type { CustomerFormValues } from '../types/form';

export type CustomerSearchField = 'name' | 'email' | 'phone';

interface ListCustomersParams {
  searchField?: CustomerSearchField;
  searchValue?: string;
  page?: number;
  size?: number;
}

export async function listCustomers({
  searchField,
  searchValue,
  page = 0,
  size = 20,
}: ListCustomersParams): Promise<PaginatedResponse<Customer>> {
  const params: Record<string, string | number> = { page, size };

  if (searchField && searchValue) {
    params[searchField] = searchValue;
  }

  const { data } = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
    params,
  });

  return data;
}

export async function getCustomer(id: number): Promise<CustomerDetail> {
  const { data } = await apiClient.get<CustomerDetail>(`/customers/${id}`);
  return data;
}

export async function createCustomer(values: CustomerFormValues): Promise<Customer> {
  const { data } = await apiClient.post<Customer>('/customers', {
    name: values.name,
    phone: values.phone,
    email: values.email || undefined,
    notes: values.notes || undefined,
  });

  return data;
}

export async function updateCustomer(
  id: number,
  values: CustomerFormValues,
): Promise<Customer> {
  const { data } = await apiClient.patch<Customer>(`/customers/${id}`, {
    name: values.name,
    email: values.email || undefined,
    phone: values.phone,
    notes: values.notes || undefined,
  });

  return data;
}
