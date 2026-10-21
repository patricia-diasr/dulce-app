import { apiClient } from '@/lib/api/client';
import type {
  NotificationTemplate,
  PreviewTemplatePayload,
  PreviewTemplateResponse,
  UpdateNotificationTemplatePayload,
} from '../types/notificationTemplate';

export async function listNotificationTemplates(): Promise<NotificationTemplate[]> {
  const { data } = await apiClient.get<NotificationTemplate[]>(
    '/notifications/templates',
  );
  return data;
}

export async function getNotificationTemplate(id: number): Promise<NotificationTemplate> {
  const { data } = await apiClient.get<NotificationTemplate>(
    `/notifications/templates/${id}`,
  );
  return data;
}

export async function updateNotificationTemplate(
  id: number,
  payload: UpdateNotificationTemplatePayload,
): Promise<NotificationTemplate> {
  const { data } = await apiClient.patch<NotificationTemplate>(
    `/notifications/templates/${id}`,
    payload,
  );
  return data;
}

export async function previewNotificationTemplate(
  payload: PreviewTemplatePayload,
): Promise<PreviewTemplateResponse> {
  const { data } = await apiClient.post<PreviewTemplateResponse>(
    '/notifications/templates/preview',
    payload,
  );
  return data;
}
