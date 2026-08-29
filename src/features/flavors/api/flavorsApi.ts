import { apiClient } from '@/lib/api/client';
import type { Flavor } from '../types';

export async function listFlavors(): Promise<Flavor[]> {
  const { data } = await apiClient.get<Flavor[]>('/flavors');
  return data;
}
