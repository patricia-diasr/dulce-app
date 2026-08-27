import { isAxiosError } from 'axios';

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message?: string;
  path: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
}
