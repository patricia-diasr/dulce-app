import { apiClient } from '@/lib/api/client';
import type { Flavor } from '../types';
import type { FlavorFormValues } from '../types/form';

export async function listFlavor(id: number): Promise<Flavor> {
  const { data } = await apiClient.get<Flavor>(`/flavors/${id}`);
  return data;
}

export async function listFlavors(): Promise<Flavor[]> {
  const { data } = await apiClient.get<Flavor[]>('/flavors?active=true');
  return data;
}

export async function createFlavor(values: FlavorFormValues): Promise<Flavor> {
  const { data } = await apiClient.post<Flavor>('/flavors', values);
  return data;
}

export async function updateFlavor(
  id: number,
  values: FlavorFormValues,
): Promise<Flavor> {
  const { data } = await apiClient.patch<Flavor>(`/flavors/${id}`, values);
  return data;
}

export async function deleteFlavor(id: number): Promise<void> {
  await apiClient.delete(`/flavors/${id}`);
}
