import { apiClient } from '@/lib/api/client';
import type { Flavor } from '../types';

export async function listFlavors(): Promise<Flavor[]> {
  const { data } = await apiClient.get<Flavor[]>('/flavors?active=true');
  return data;
}

export async function deleteFlavor(id: number): Promise<void> {
  await apiClient.delete(`/flavors/${id}`);
}
