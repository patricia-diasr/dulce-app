export type NotificationTypeCode =
  | 'ORDER_CREATED'
  | 'ORDER_UPDATED'
  | 'ORDER_ACCEPTED'
  | 'ORDER_REJECTED'
  | 'ORDER_CANCELED'
  | 'ORDER_COMPLETED'
  | 'PICKUP_REMINDER'
  | 'PAYMENT_UPDATED';

export interface NotificationTemplate {
  id: number;
  code: NotificationTypeCode;
  description: string;
  subject: string;
  content: string;
}

export interface UpdateNotificationTemplatePayload {
  subject?: string;
  content?: string;
}

export interface PreviewTemplatePayload {
  subject: string;
  content: string;
}

export interface PreviewTemplateResponse {
  subject: string;
  renderedHtml: string;
}
