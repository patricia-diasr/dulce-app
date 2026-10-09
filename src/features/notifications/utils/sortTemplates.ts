import { NOTIFICATION_TYPE_ORDER } from '../constants/notificationTypes';
import type { NotificationTemplate } from '../types/notificationTemplate';

export function sortTemplatesByLifecycle(
  templates: NotificationTemplate[],
): NotificationTemplate[] {
  return [...templates].sort(
    (a, b) =>
      NOTIFICATION_TYPE_ORDER.indexOf(a.code) - NOTIFICATION_TYPE_ORDER.indexOf(b.code),
  );
}
